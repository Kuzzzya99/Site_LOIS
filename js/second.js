var countOne = 0;
var countZero = 0;
var rowsInTable;
var truthTable = {};

var NEGATION = "!";
var CONJUNCTION = "&";
var DISJUNCTION = "|";
var IMPLICATION = "->";
var EQUIVALENCE = "~";

function checkAnswer(){

 var radioButton=document.getElementsByName('rr');  
  
  for (var i=0; i<radioButton.length; i++) {
    if (radioButton[i].checked) {
        rad=radioButton[i].value;
      }
    }
 
    if (rad == "Y") {
        rad = true;
      }
    if (rad == "N") {
        rad = false;
      }

    if (checkIsNeutral(formula) == rad) {
        document.getElementById("output-field").innerHTML += "<p id='correct-answer'>Вы правы!</p>";
    } else {
        document.getElementById("output-field").innerHTML += "<p id='wrong-answer'>Вы ошиблись.</p>";
    }
}
// Функция вызова функций по проверке введённой формулы на нейтральность
function checkIsNeutral(formula){
  var sizeSymbols = symbols.length;
  
  rowsInTable = Math.pow(2, sizeSymbols);
  countOne = 0;
  countZero = 0;
  truthTable = {};

  if(sizeSymbols!=0){
    for (var i = 0; i < rowsInTable; i++) {
      var valuesInRow = numberInBinary(i, sizeSymbols);
      let rowInTable = setValueForSymbol(symbols, valuesInRow);
      rowInTable[formula] = rewriteFormula(formula, rowInTable);
      truthTable[i] = rowInTable;
      if (rowInTable[formula] == 1) 
        countOne++;
      if (rowInTable[formula] == 0) 
        countZero++;
      if (countZero > 0 && countOne > 0) {
          rowsInTable = ++i;
          return true;
      }
    }
  }
  return false;
}

// Функция перевода числа в бинарный вид и приведение к нужной длине
function numberInBinary(number, stringSize){
    var string = (number).toString(2);
    for (var i = string.length; i < stringSize; i++){
        string = "0" + string;
    }
    return string;
}

// Функция установления значения для символа в таблице истинности.
function setValueForSymbol(symbolInFormula, valuesInRow){
    var row = {};
    for (var i = 0; i < symbolInFormula.length; i++){
        var symbol = symbolInFormula[i];
        row[symbol] = valuesInRow[i];
    }
    return row;
}

// Функция заменяет переменные на константы из таблицы истинности.
function rewriteFormula(formula, truthTable){
    var rewrittenFormula = formula;
    for (var key of Object.keys(truthTable)) {
        var val = truthTable[key];
        rewrittenFormula = rewrittenFormula.replace(new RegExp(key, 'g'), val);
    }

    var calculatedFormula = calculateFormula(rewrittenFormula);

    return calculatedFormula;
}

// Функция, подсчитывающая значение выражения.
function calculateFormula(formula){
    var regFormula = "([(][" + NEGATION + "][0-1][)])|" +
        "([(][0-1]((" + CONJUNCTION + ")|("+ "\\" + DISJUNCTION + ")|(" + IMPLICATION + ")|(" + EQUIVALENCE + "))[0-1][)])";
    regFormula = new RegExp(regFormula);
    while (regFormula.exec(formula) != null){
        var subFormula = regFormula.exec(formula)[0];
        var result = calcSubFormula(subFormula);
        formula = formula.replace(subFormula, result);
    }
    return formula;
}

// Функция подсчитывает значение подформул
function calcSubFormula(formula){
    if (formula[1]=="!") {
      var value = parseInt(formula[2]);
      if (!value) 
        return 1;
      else 
        return 0;
    }
    else if (formula[2]=="&") {
      var firstValue = parseInt(formula[1]);
      var secondValue = parseInt(formula[3]);
      if (firstValue && secondValue)  
        return 1;
      else 
        return 0;
    }
    else if (formula[2]=="|") {
      var firstValue = parseInt(formula[1]);
      var secondValue = parseInt(formula[3]);
      if (firstValue || secondValue) 
        return 1;
      else 
        return 0;
    }
    else if (formula[2] == "-") {
      var firstValue = parseInt(formula[1]);
      var secondValue = parseInt(formula[4]);
      if ((!firstValue)||secondValue)
       return 1;
      else 
        return 0;
    }
    else if (formula[2] == "~"){
      var firstValue = parseInt(formula[1]);
      var secondValue = parseInt(formula[3]);
      if (firstValue == secondValue)
       return 1;
      else 
        return 0;
    }
}

// Функция построения таблицы истинности 
function objectToTable(table, symbols){
    var size = Math.pow(2, symbols);
    var innerHTML = "";
    var tr = "<tr>";
    for (var key of Object.keys(table[0])) {
        tr += "<td>" + key + "</td>"
    }
    tr += "</tr>";
    innerHTML += tr;
    for (var i = 0; i < rowsInTable; i++) {
        var object = table[i];
        var tr = "<tr>";
        for (var key of Object.keys(object)) {
            var val = object[key];
            tr += "<td>" + val + "</td>"
        }
        tr += "</tr>";
        innerHTML += tr;
    } 
    return innerHTML;
}