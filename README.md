## Clone the repository
git clone [https://github.com/yourusername/yourrepository.git](https://github.com/saad2786/roxiler-task.git)
`cd roxiler-task`

## Install server dependencies
`cd ./api`\
`npm install`

## Install client dependencies
`cd ../client`\ 
`npm install`

## Run the server (from api directory)
`npm run server`

## Run the client (from client directory)
`npm run dev`
<script>
  document.addEventListener('DOMContentLoaded', function() {
    var codeBlocks = document.querySelectorAll('pre > code');

    codeBlocks.forEach(function(codeBlock) {
      var button = document.createElement('button');
      button.className = 'copy-button';
      button.textContent = 'Copy';
      codeBlock.parentNode.insertBefore(button, codeBlock);

      button.addEventListener('click', function() {
        var text = codeBlock.textContent.trim();
        navigator.clipboard.writeText(text).then(function() {
          button.textContent = 'Copied!';
          setTimeout(function() {
            button.textContent = 'Copy';
          }, 2000);
        }).catch(function(err) {
          console.error('Failed to copy text: ', err);
        });
      });
    });
  });
</script>
