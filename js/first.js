// Лабораторная работа №1
// Вариант А: Подсчёт кол-ва подформул логической формулы.
var formula = "";
var subformulaCount = 0;
var ValidFormula = new RegExp('([(][!]([A-Z]|[0-1])[)])|([(]([A-Z]|[0-1])((&)|(\\|)|(->)|(~))([A-Z]|[0-1])[)])', 'g');
var AtomarFormula = new RegExp('([A-Z]|[0-1])', 'g');
var ComplexSubformula = new RegExp('([(][!]([A-Z]+|[0-1])[)])|([(]([A-Z]+|[0-1])((&)|(\\|)|(->)|(~))([A-Z]+|[0-1])[)])', 'g');
var AtomarOrConstantFormula = new RegExp('([A-Z]|[0-1])', 'g');

var replacementSymbol = "N";
var countOfSubformulas = 0;
var subformulas = [];

var symbols =[];

// Функиция запуска выполнения действий проверки введенной формулы и подсчёта кол-ва подстрок.
function run() {
    clear();
    countOfSubformulas = 0;
    subformulas = [];
    symbols = [];
    formula = document.getElementById("formula").value;
    if (!isFormula(formula)) {
        alert("Ошибка ввода формулы. Повторите ввод");
        return 0;

    }
    
    subformulaCount = getNumberOfSubformulas(formula); 
    checkAnswer();   
}

// Функция проверки ответа пользователя.
function checkAnswer(){
var number = document.getElementById("user_answer").value;
    if (number == "") {
    alert("Вы не ввели число подформул.Введите число подформул");
    return;
  }
    if (subformulaCount == number) {
        document.getElementById("output-field").innerHTML += "<p id='correct-answer'>Вы правы!</p>";
    } else {
        document.getElementById("output-field").innerHTML += "<p id='wrong-answer'>Попробуйте ещё раз.</p>";
    }
}

//Показать правильный ответ
function getAnswer(){
document.getElementById("output-field").innerHTML = "<p id='correct-answer'>Количество подформул: " + subformulaCount + "</p>";
} 

// Функция проверки на правильность введённой формулы.
function isFormula(formula) {
    var tempFormula;
    while (formula != tempFormula) {
      tempFormula = formula;
      formula = formula.replace(ValidFormula, replacementSymbol);
    }
    if (formula.length == 1) 
        return true;
    else
        return false;
}

// Функция находит подформулы во введенной формуле.
function searchSubformulas(formula) {
    var tempFormula;
    var result = formula.match(AtomarOrConstantFormula, 'g');
    for (var i = 0; i < result.length; i++) {
        addToSubformulas(result[i]);
    }

    var formulaLength = formula.length;

    if(formulaLength > 1) {
        tempFormula = formula; 

        while (tempFormula !== replacementSymbol) {
            result = tempFormula.match(ComplexSubformula);
            if (result != null) {
                for (var temp = 0; temp < result.length; temp++) {
                    var subformula = result[temp];
                    
                    addToSubformulas(subformula);
                    tempFormula = tempFormula.replace(subformula, replacementSymbol);
                }
            }
        }
    }
}


// Функция возвращает кол-во найденных подформул введённой формулы. 
function getNumberOfSubformulas(formula) {
    //var tempFormula = formula;
    searchSubformulas(formula);
    return countOfSubformulas;
}


// Функция добавления в массив подформул.
function addToSubformulas(subformula) {
    var isPresent = false;
    if(subformulas.length === 0){
            subformulas[0] = subformula;
            countOfSubformulas++;
    } else {
            for (var i = 0; i < countOfSubformulas; i++) {
                if(subformula === subformulas[i]){
                    isPresent = true;
                }
            }
            if(!isPresent){
                subformulas[countOfSubformulas] = subformula;
                countOfSubformulas++;
            }
        }
        if (subformula.length == 1 && subformula != "1" && subformula != "0"){
                    symbols[symbols.length] = subformula;
                }
}


// Функция возвращения форм к первоначальному состоянию.
function clear() {
    document.getElementById("output-field").innerHTML = "";
    formula = "";
}

// Функция генерации формулы
function generate() {
    let countOfArgs = getRandomInt(3);
    let countOfGroups = getRandomInt(Math.pow(2, countOfArgs));
    let formula = '';
    var variablesCodes = [ 'A', 'B', 'C'];


    for (i = 0; i < countOfGroups; i++) {
        let countOfArgsInParticualarGroup = countOfArgs - getRandomInt(countOfArgs) + 1;
        let group = '';

        if (countOfGroups !== 1 && i < countOfGroups - 1) {
            formula += '(';
        }

        for (j = 0; j < countOfArgsInParticualarGroup; j++) {
            if (countOfArgsInParticualarGroup !== 1 && j < countOfArgsInParticualarGroup - 1) {
                group += '(';
            }

            let isNegative = (Math.random() >= 0.5);
            group += (isNegative ? '(!' : '') + variablesCodes[j] + (isNegative ? ')' : '');
            if (j < countOfArgsInParticualarGroup - 1) {
                let random  = Math.random();
                group += ((random >= 0.2) ? '|' : (random >= 0.1 ? '&' : (random >= 0.05 ? '~' : '->')));
            }
        }

        for (j = 0; j < countOfArgsInParticualarGroup - 1; j++) {
            if (countOfArgsInParticualarGroup !== 1) {
                group += ')';
            }
        }

        formula += group;

        if (i < countOfGroups - 1) {
            let random  = Math.random();
            formula += ((random >= 0.3) ? '|' : (random >= 0.2 ? '&' : (random >= 0.1 ? '~' : '->')));
        }
    }

    for (j = 0; j < countOfGroups - 1; j++) {
        if (countOfGroups !== 1) {
            formula += ')';
        }
    }
    document.getElementById('formula').value = formula;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}