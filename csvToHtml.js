var lineReader = require('line-reader'),
    fs = require("fs");

var delimiter = ",",
    first = true,
    previous = "",
    inFile = "example.csv",
    outFile = "index.html";

var stateA_prev = "Null",
    stateB_prev = "Null",
    stateC_prev = "Null";

function writetoHtml(str) {
    fs.appendFile(outFile, str, function(err) {
        if (err) {
            console.log("Error in file writing ", err);
        }
    });
}

//write html header
var header = "<html><head><title>Template</title></head><body>"
writetoHtml(header);

lineReader.eachLine(inFile, function(line, last) {
    console.log(line);
    //avoid the first line - title
    if (!first) {
        var arr_line = line.split(delimiter);
    }
    stateA = arr_line[0];
    stateB = arr_line[1];
    stateC = arr_line[2];

    if (arr_line[0].length == 0) stateA = "Null";
    if (arr_line[1].length == 0) stateB = "Null";
    if (arr_line[2].length == 0) stateC = "Null";

    var attributes_str= "name='"+ arr_line[3] +"', dependencies = '"+arr_line[4]+ "', type='"+arr_line[5] +"', values='"+arr_line[6]+ "', mandatory='"+arr_line[7]+"'";
            
    //stateC
    if ((stateC != "Null") && (stateC != stateC_prev)) {
        if (stateC_prev == "Null")
        {  
            writetoHtml("<div id='" + stateC + "', " + attributes_str + "></div>");
        }
        else
            writetoHtml("</div><div id='" + stateC + "', " + attributes_str + "></div>");
    }

    //stateB
    if ((stateB != "Null") && (stateB != stateB_prev)) {
        if (stateB_prev == "Null")
            writetoHtml("<div id='" + stateB + "'>");
        else
            writetoHtml("</div><div id='" + stateB + "'>");
    }
    else if (stateB == "Null")
            writetoHtml("</div>");

    //stateA
    if ((stateA != "Null") && (stateA != stateA_prev)) {



    } else if (stateA == "Null"){
      
    }

    if (last) {

    }

    //update previous states
    stateA_prev = stateA;
    stateB_prev = stateB;
    stateC_prev = stateC;
    first = false;
});

//write footer
var footer = "</body></html>"
writetoHtml(footer);
