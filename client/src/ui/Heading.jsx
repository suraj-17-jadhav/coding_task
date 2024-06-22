import React from "react";

const Heading = ({ children }) => {
  return (
    <h1 className='pt-20 pb-10 text-3xl w-full text-center font-semibold text-stone-800 font-pop'>
      {children}
    </h1>
  );
};

export default Heading;
