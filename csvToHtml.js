var lineReader = require('line-reader');

lineReader.eachLine('example.csv', function(line, last) {
  console.log(line);
  // do whatever you want with line...
  if(last){
    // or check if it's the last one
  }
});