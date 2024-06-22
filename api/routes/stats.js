const router = require("express").Router();
const { default: axios } = require("axios");
const Stat = require("../models/statModel");

//? Get all Stat
router.get("/initialize", async (req, res) => {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
    );
    const data = response.data;
    const insertedData = await Stat.insertMany(data);
    res.status(200).json(insertedData);
  } catch (err) {
    res.status(400).send(err);
  }
});

//?Get record by search text and pagination
router.get("/transactions", async (req, res) => {
  const { search, page = 1, perPage = 10, month } = req.query;

  const query = {};
  if (search) {
    const searchRegex = new RegExp(search, "i"); // 'i' for case-insensitive
    const priceSearch = parseFloat(search); // Convert search to float for price comparison
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { price: isNaN(priceSearch) ? null : priceSearch }, // Only add price if it's a valid number
    ].filter(Boolean); // Remove any invalid search queries
  }

  if (month) {
    const monthInt = parseInt(month, 10);
    if (!isNaN(monthInt) && monthInt >= 1 && monthInt <= 12) {
      query.$expr = { $eq: [{ $month: "$dateOfSale" }, monthInt] };
    } else {
      return res.status(400).send("Invalid month");
    }
  }

  const skip = (parseInt(page) - 1) * parseInt(perPage);

  try {
    const total = await Stat.countDocuments(query);
    const transactions = await Stat.find(query)
      .skip(skip)
      .limit(parseInt(perPage));

    return res.status(200).json({
      page: parseInt(page),
      perPage: parseInt(perPage),
      total,
      transactions,
    });
  } catch (err) {
    return res.status(500).send(err);
  }
});

//? get some operated values
router.get("/statistics", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  try {
    // Validate and parse month input
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).send("Invalid month parameter");
    }

    // Aggregate pipeline to calculate total sold amount for the specified month
    const soldItems = await Stat.aggregate([
      {
        $match: {
          sold: true,
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$price" },
          totalItems: { $sum: 1 },
        },
      },
    ]);
    const unsoldItems = await Stat.aggregate([
      {
        $match: {
          sold: false,
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
        },
      },
    ]);
    // Respond with the total sold amount
    if (soldItems.length > 0) {
      res.status(200).json({
        totalItemSold: soldItems[0].totalItems,
        totalSoldAmount: soldItems[0].totalAmount,
        totalUnsoldItems: unsoldItems[0]?.totalItems,
      });
    } else {
      res.status(404).send("No records found for the specified month");
    }
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.get("/bar-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  try {
    // Validate and parse month input
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).send("Invalid month parameter");
    }

    // Aggregate pipeline to calculate price ranges and count of items in each range
    const barChartData = await Stat.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt],
          },
        },
      },
      {
        $bucket: {
          groupBy: "$price",
          boundaries: [
            1,
            101,
            201,
            301,
            401,
            501,
            601,
            701,
            801,
            901,
            Infinity,
          ],
          default: "901-above",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    // Format the response
    const formattedData = barChartData.map((item) => {
      let rangeLabel;
      if (item._id === 901) {
        rangeLabel = "901-above";
      } else {
        const min = item._id;
        const max = min + 99;
        rangeLabel = `${min}-${max}`;
      }
      return {
        priceRange: rangeLabel,
        count: item.count || 0,
      };
    });

    // Respond with the bar chart data
    res.status(200).json(formattedData);
  } catch (err) {
    console.error("Error fetching bar chart data:", err);
    res.status(500).send("Internal Server Error");
  }
});

//pie chart
router.get("/pie-chart", async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  try {
    // Validate and parse month input
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).send("Invalid month parameter");
    }

    // Aggregate pipeline to calculate unique categories and number of items in each category
    const pieChartData = await Stat.aggregate([
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, monthInt],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          count: 1,
        },
      },
    ]);

    // Respond with the pie chart data
    res.status(200).json(pieChartData);
  } catch (err) {
    console.error("Error fetching pie chart data:", err);
    res.status(500).send("Internal Server Error");
  }
});

//Combined
router.get("/combined-data", async (req, res) => {
  const { month } = req.query;
  const BASE_URL = "http://localhost:8800/stat";
  if (!month) {
    return res.status(400).send("Month parameter is required");
  }

  try {
    // Validate and parse month input
    const monthInt = parseInt(month, 10);
    if (isNaN(monthInt) || monthInt < 1 || monthInt > 12) {
      return res.status(400).send("Invalid month parameter");
    }

    // Fetch data from all three APIs concurrently
    const [statisticsResponse, barChartResponse, pieChartResponse] =
      await Promise.all([
        axios.get(`${BASE_URL}/statistics`, { params: { month } }),
        axios.get(`${BASE_URL}/bar-chart`, { params: { month } }),
        axios.get(`${BASE_URL}/pie-chart`, { params: { month } }),
      ]);

    // Combine responses into a single JSON object
    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    // Send the combined response
    res.status(200).json(combinedData);
  } catch (err) {
    console.error("Error fetching combined data:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
