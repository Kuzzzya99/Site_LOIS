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

function validateFormula(formula) {
    return formula.match(/^([10A-Z()|&!~]|->)*$/g) && (formula.match(/^[A-Z10]$/) ||
        (!formula.match(/\)\(/) && !formula.match(/[A-Z10]([^|&~]|(?!->))[10A-Z]/) &&
        !formula.match(/[^(]![A-Z10]/) && !formula.match(/![A-Z10][^)]/) &&
        !formula.match(/\([A-Z10]\)/) && validateBracing(formula)));
}

function validateBracing(formula) {
    if (formula.split('(').length !== formula.split(')').length) { // -1 to both?
        return false;
    }

    let formulaCopy = formula;
    let replacingSymbol = 'X';

    while (formulaCopy.match(/([|&~]|->)/g) || !formulaCopy.match(/^[X()]+$/g)) {
        let snapshot = formulaCopy;

        formulaCopy = formulaCopy.replace(/\(![A-Z01]\)/g, replacingSymbol);
        formulaCopy = formulaCopy.replace(/\([A-Z01]([|&~]|->)[A-Z01]\)/g, replacingSymbol);

        if (formulaCopy === snapshot) {
            return false;
        }
    }

    return formulaCopy === replacingSymbol;
}

var _atoms = [];
var _sets = [];
var _results = [];


function check() {
  const _tableElement = document.getElementById('17');
    const formula = document.getElementById('formula').value;
    console.log(formula);
    let messageElement = document.getElementById("message");

    let isFormulaValid = validateFormula(formula);
    messageElement.innerHTML = isFormulaValid ? '' : "Введите корректную формулу";
    
    if (!isFormulaValid) {
        return;
    }

    messageElement.innerHTML = isInconsistent(formula) ? "" : "";
    if (_atoms.length !== 0) {
        _tableElement.innerHTML = fillTable(_atoms, _sets, _results);
    }
}

function isInconsistent(formula) {
    let atoms = [...new Set(formula.split(/[^A-Z]/).filter(atom => atom !== ''))];
    if (atoms.length === 0) {
        return getResult(formula) == 0;
    }

    let sets = getValueSets(atoms);
    let results = getResults(formula, atoms, sets);

    _atoms = atoms;
    _sets = sets;
    _results = results;

    return results.every(result => result == 0);
}

function getValueSets(atoms) {
    let sets = [];

    for (let setCounter = 0; setCounter < Math.pow(2, atoms.length); setCounter++) {
        let setCounterBinary = Array.from(setCounter.toString(2));
        if (setCounterBinary.length !== atoms.length) {
            let zerosLeft = Array.from('0'.repeat(atoms.length - setCounterBinary.length));
            setCounterBinary.forEach(digit => zerosLeft.push(digit));

            setCounterBinary = zerosLeft;
        }

        sets.push(setCounterBinary);
    }

    return sets;
}

function getResults(formula, atoms, sets) {
    let results = [];

    sets.forEach(set => {
        let injected = injectAtomsValues(formula, atoms, set);
        results.push(getResult(injected));
    });

    return results;
}

function injectAtomsValues(formula, atoms, set) {
    atoms.forEach((atom, index) => formula = formula.replace(new RegExp(atom, 'g'), set[index]));
    return formula;
}

function getResult(formula) {
    while (!formula.match(/^[01]$/g)) {
        formula = calcUnary(formula);
        formula = calcBinary(formula);
    }

    return formula;
}

function calcBinary(formula) {
    formula = formula.replace(/\(1&1\)/g, '1');
    formula = formula.replace(/\(0&1\)|\(1&0\)|\(0&0\)/g, '0');
    formula = formula.replace(/\(0\|0\)/g, '0');
    formula = formula.replace(/\(0\|1\)|\(1\|0\)|\(1\|1\)/g, '1');
    formula = formula.replace(/\(1~1\)|\(0~0\)/g, '1');
    formula = formula.replace(/\(1~0\)|\(0~1\)/g, '0');
    formula = formula.replace(/\(1->0\)/g, '0');
    formula = formula.replace(/\(0->1\)|\(1->1\)|\(0->0\)/g, '1');

    return formula;
}

function calcUnary(formula) {
    formula = formula.replace(/\(!1\)/g, '0');
    formula = formula.replace(/\(!0\)/g, '1');

    return formula;
}

function fillTable(atoms, sets, results) {
    let inner = '';

    inner += '<tr>';
    atoms.forEach(atom => {
        inner  += '<th>' + atom + '</th>'
    });
    inner += '<th><i>F</i></th>'
    inner += '</tr>';

    sets.forEach((set, index) => {
        inner += '<tr>';
        set.forEach(value => {
            inner += '<td>' + value + '</td>'
        });

        inner += '<td>' + results[index] + '</td>';
        inner += '</tr>';       
    });

    return inner;
}