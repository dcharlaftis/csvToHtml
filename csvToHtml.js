var lineReader = require('line-reader'),
    fs = require("fs");

var delimiter = "," ,
    first = true,
    previous = "",
    inFile="example.csv",
    outFile="index.html";

//write html header
var header = "<html><head><title>Template</title></head><body>"
fs.appendFile(outFile, header, function (err) {
          if (err){
          	console.log("error in file writing " , err);            
          }          
      });

lineReader.eachLine(inFile, function(line, last) {
    console.log(line);
    //avoid the first line - title
    if (!first){
    	 var arr_line = line.split(delimiter);

    }
   


    previous = arr_line;
    first = false;
    if (last) {
        // or check if it's the last one
    }
});

//write footer
var footer = "</body></html>"
fs.appendFile(outFile, footer, function (err) {
          if (err){
          	console.log("error in file writing " , err);            
          }          
      });