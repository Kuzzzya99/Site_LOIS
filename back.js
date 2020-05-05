var Formula = "";
var SYMBOLS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];
var replaceFormula = "R";

var unaryOrBinaryComplexFormula = new RegExp(
  "([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])",
  "g"
);
var unaryOrBinaryComplexSubformula = new RegExp(
  "([(][!]([A-Z]+|[0-1])[)])|([(]([A-Z]+|[0-1])((&)|(\\|)|(->)|(~))([A-Z]+|[0-1])[)])",
  "g"
);
var atomOrConstant = new RegExp("([A-Z]|[0-1])", "g");

var tempFormula;
var symbols = [];
var number_subformuls = 0;
var countedSubFormuls = [];

$(document).ready(function () {
  $("#show").on("click", function () {
    $(".overlay,.modal").show();
  });

  $(".overlay,.close").on("click", function () {
    $(".overlay,.modal").hide();
  });
});

function checkUserAnswer() {
  var number = document.getElementById("text-number").value;
  if (number == "") {
    alert("Вы не ввели число подформул.Введите число подформул");
    return;
  }
  if (number_subformuls == number) {
    document.getElementById("result_1").innerHTML = "Правильно";
  } else {
    document.getElementById("result_1").innerHTML = "Не правильно";
  }
}

function choice_option(genFormula) {
  number_subformuls = 0;
  countedSubFormuls = [];
  symbols = [];
  tempFormula = "";

  if (genFormula)
    document.getElementById("generate_formula").innerHTML = newFormula();
  else if (!genFormula)
    document.getElementById("generate_formula").innerHTML = input_formula();
  print();
}

function newFormula() {
  var type = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
  switch (type) {
    case 1:
      var answer = Math.floor(Math.random() * (1 - 0 + 1)) + 0;
      if (answer == 1) Formula = "1";
      else Formula = "0";
      break;

    case 2:
      var answer = Math.floor(Math.random() * (25 - 0 + 1)) + 0;
      Formula = SYMBOLS[answer];
      break;

    case 3:
      Formula = newFormula();
      Formula = "(" + "!" + Formula + ")";
      break;

    case 4:
      var relation = "";
      var type = Math.floor(Math.random() * (4 - 1 + 1)) + 1;
      switch (type) {
        case 1:
          relation = "&";
          break;

        case 2:
          relation = "|";
          break;

        case 3:
          relation = "->";
          break;

        case 4:
          relation = "~";
          break;
      }

      var leftFormula = newFormula();
      var rightFormula = newFormula();
      Formula = "(" + leftFormula + relation + rightFormula + ")";
      break;
  }
  addToSubFormuls(Formula);
  return Formula;
}

function addToSubFormuls(subFormuls) {
  var check = true;
  for (var i = 0; i < number_subformuls; i++) {
    if (subFormuls == countedSubFormuls[i]) check = false;
  }
  if (check) {
    countedSubFormuls[number_subformuls] = subFormuls;
    number_subformuls++;
  }
}
function input_formula(){

    Formula = document.getElementById('new_formula').value;
    var result  = Formula;
    if(!verificationFormula(Formula)) result = "Введенная строка не является формулой.";
    else searchSubformuls(Formula);
    document.getElementById('new_formula').value = "";
    return result;
  }

  function searchSubformuls(formula) {

    var result = formula.match(atomOrConstant, 'g');
      for (var i=0; i<result.length; i++){
        addToSubFormuls(result[i]);
      }
  
    while (formula !== tempFormula ){
      tempFormula = formula;
      result = formula.match(unaryOrBinaryComplexSubformula);
      if(result!=null){
        for(var temp=0; temp<result.length; temp++){
          var sub = result[temp];
          var beginIndex = formula.indexOf(sub);
          var endIndex = sub.length;
          var subFormula="";

          formula = tempFormula.substring(0,beginIndex);
            for (var i=beginIndex; i<beginIndex + endIndex; i++){
              subFormula = subFormula + Formula[i];
              formula = formula + replaceFormula;
            }   
          formula = formula + tempFormula.substring(beginIndex+endIndex, tempFormula.length);
          addToSubFormuls(subFormula);
          subFormula="";
        }
      }
    }
  }
  
  
  function verificationFormula(formula){
      while (formula != tempFormula ) {
        tempFormula = formula;
        formula = formula.replace(unaryOrBinaryComplexFormula, replaceFormula);
      }
      if ((formula.length == 1)) return true;
      else return false;
  }

function print() {
  var list = "<ol>";
  for (var i = 0; i < number_subformuls; i++) {
    list = list + "<li>" + countedSubFormuls[i] + "</li>";
  }
  list = list + "</ol>";
  document.getElementById("listOfSubformuls").innerHTML = list;
}
