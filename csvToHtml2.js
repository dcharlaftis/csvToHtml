var fs = require('fs');

var delimiter = '$',
    first = true,
    previous = '',
    inFile = 'example4.csv',
    outFile = 'index.html';

var stateA_prev = 'Null',
    stateB_prev = 'Null',
    stateC_prev = 'Null';

var first = true;

var arr_line;

function writetoHtml(str) {
    fs.appendFile(outFile, str, function(err) {
        if (err) {
            console.log('Error in file writing ', err);
        }
    });
}

var lineByLine = require('n-readlines');
var liner = new lineByLine(inFile);

var line;
var lineNumber = 0;

//write html header
var header = '<uib-accordion>'
writetoHtml(header);

function stateChange(A, B, C, preA, preB, preC) {
    var result = [];
    if (A != preA) {
        result.push([A, preA, "A"]);
        result.push([B, preB, "B"]);
        result.push([C, preC, "C"]);
        return result;
    }
    if (B != preB) {
        result.push([B, preB, "B"]);
        result.push([C, preC, "C"]);
        return result;
    }
    if (C != preC) {
        result.push([C, preC, "C"]);
        return result;
    }
    return result;
}

function closeDivs(stateArray) {
    var result = '';
    for (var i = stateArray.length-1; i >=0; i--) {
        if (stateArray[i][1] != 'Null')
            if (stateArray[i][2] === 'A')
                result += '</uib-accordion-group>';
            else
                result += '</div>';
    }
    return result;

}

function openDivs(stateArray) {
    var result = '';
    for (var i = 0; i < stateArray.length; i++) {
        if (stateArray[i][0] != 'Null')
            if (stateArray[i][2] === 'A')
                result += '<uib-accordion-group heading=\'' + stateArray[i][0] + '\'>';
            else
                result += '<div id=\'' + stateArray[i][0] + '\'>';
    }
    return result;
}

var statechange;
var output = '';

function toCamelCase(str) {
    var arr = str.split(' ');
    arr[0] = arr[0].toLowerCase();

    return arr.join('');
}

function element(el_name, el_dependencies, el_type, el_values, el_mandatory) {
    var result = '',
        mandatStr='';
    var el_id = toCamelCase(el_name);
    if (el_mandatory.substring(0, 3) ==='yes')
        mandatStr += ' mandatory = \'true\'';
    
    //console.log ("ddff%sfff", el_mandatory.substring(0, 3) );

    if (el_type === 'string')
        result = '<p>' + el_name + ':<input type=\'text\' name=\'' + el_id +  '\''+ mandatStr +' ></p>';
    else if (el_type === 'boolean')
        result = '<p>' + el_name + ':<input type=\'checkbox\' name=\'' + el_id + '\' value= \''+ el_id +'\''+ mandatStr +'></p>';   
    else if (el_type === 'date') 
        result = '<p>' + el_name + ':<input type=\'date\' name=\'' + el_id + '\''+ mandatStr +'></p>';  
    else  
        result = '<element id=\'' + el_id + '\'' 
    + 'dependencies=\'' + el_dependencies 
    + '\' type=\'' + el_type 
    + '\' values = \'' + el_values 
    + ' \' ></element>';
    return result;
}

while (line = liner.next()) {
    line = line.toString('ascii');
    //  if (!first) {

    arr_line = line.split(delimiter);

    stateA = arr_line[0];
    stateB = arr_line[1];
    stateC = arr_line[2];
    el_name = arr_line[3];
    el_dependencies = arr_line[4];
    el_type = arr_line[5];
    el_values = arr_line[6];
    el_mandatory = arr_line[7];

    if (arr_line[0].length === 0) stateA = 'Null';
    if (arr_line[1].length === 0) stateB = 'Null';
    if (arr_line[2].length === 0) stateC = 'Null';


    statechange = stateChange(stateA, stateB, stateC, stateA_prev, stateB_prev, stateC_prev);
    //console.log('-->', stateA, stateB, stateC, statechange);

    closingDivs = closeDivs(statechange);
    output += closingDivs;
    openingDivs = openDivs(statechange);
    output += openingDivs;
    output += element(el_name, el_dependencies, el_type, el_values, el_mandatory);

    //update previous states
    stateA_prev = stateA;
    stateB_prev = stateB;
    stateC_prev = stateC;

    // }
    //first = false;
    lineNumber++;
}

statechange = stateChange('Null', 'Null', 'Null', stateA_prev, stateB_prev, stateC_prev);
//console.log('-->', stateA, stateB, stateC, statechange);

closingDivs = closeDivs(statechange);
output += closingDivs;

//console.log('end of line reached');
writetoHtml(output + '</uib-accordion>');
