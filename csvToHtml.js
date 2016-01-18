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

var stateBclosed = true,
    stateCclosed = true,
    arr_line;

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
    //console.log(line);
    //avoid the first line - title
    if (!first) {
        arr_line = line.split(delimiter);

        stateA = arr_line[0];
        stateB = arr_line[1];
        stateC = arr_line[2];
        el_name = arr_line[3];

        if (arr_line[0].length == 0) stateA = "Null";
        if (arr_line[1].length == 0) stateB = "Null";
        if (arr_line[2].length == 0) stateC = "Null";



        var attributes_str = " dependencies = '" + arr_line[4] + "', type='" + arr_line[5] + "', values='" + arr_line[6] + "', mandatory='" + arr_line[7] + "'";

        if (last) {
            //Close divs for open states A and B . state C closes immediately after it opens

            //close state C
            if (!stateCclosed)
                writetoHtml("</div>");

            //close state B
            if (!stateBclosed)
                writetoHtml("</div>");

            //close state A
            writetoHtml("</div>");

        } else {
            //stateA
            if ((stateA != "Null") && (stateA != stateA_prev)) {
                if (stateBclosed)
                    writetoHtml("<div id='" + stateA + "'>");
                else
                    writetoHtml("</div><div id='" + stateA + "'>");
            }

            //stateB
            if (((stateB != "Null") && (stateB != stateB_prev)) ||
                ((stateB != "Null") && (stateB == stateB_prev) && (stateA != stateA_prev))

            ) {
                if (stateB_prev == "Null") {
                    if (stateCclosed)
                        writetoHtml("<div id='" + stateB + "'>");
                    else {
                        writetoHtml("</div><div id='" + stateB + "'>");
                        stateCclosed = true;
                    }
                } else {
                    if (stateCclosed)
                        writetoHtml("</div><div id='" + stateB + "'>");
                    else {
                        writetoHtml("</div></div><div id='" + stateB + "'>");
                        stateCclosed = true;
                    }
                }

                stateBclosed = false;

            } else if ((stateB == "Null") && (stateB != stateB_prev) && (stateA == stateA_prev)) {
                writetoHtml("</div>");
                stateBclosed = true;
            }

            //stateC
            if (((stateC != "Null") && (stateC != stateC_prev)) ||
                ((stateC != "Null") && (stateC == stateC_prev) && (stateB != stateB_prev))
            ) {
                if (stateC_prev == "Null")
                    writetoHtml("<div id='" + stateC + "'>");
                else
                    writetoHtml("</div><div id='" + stateC + "'>");

                stateCclosed = false;

            } else if ((stateC == "Null") && (stateC != stateC_prev) && (stateB == stateB_prev)) {
                writetoHtml("</div>");
                stateCclosed = true;
            }

            //element name
            // writetoHtml("<div id='" + el_name + "', " + attributes_str + ">");
            writetoHtml("<div id='" + el_name + "', >");
            writetoHtml("</div>");
        }

        //update previous states
        stateA_prev = stateA;
        stateB_prev = stateB;
        stateC_prev = stateC;
    }
    first = false;
});

//write footer
var footer = "</body></html>"
writetoHtml(footer);
