import "./styles.css";

const numberButtons = [...document.querySelectorAll("[data-number]")];
const signButton = document.getElementById("sign");
const operationButtons = [...document.querySelectorAll("[data-operation]")];
const deleteButton = document.getElementById("clear-current");
const clearAllButton = document.getElementById("clear");
const inputText = document.getElementById("display");
const transactionText = document.getElementById("displayString");
const resultButton = document.getElementById("equals");
const decimalButton = document.getElementById("decimal");

let current_operand = "";
let previous_operand = "";
let isEvaluated = false;

const isOperator = /[*/+-]/;
const endsWithOperator = /[*+-/]$/;
const endsWithNegativeSign = /[*/+]-$/;

const endsWith = /[*+-/]$/;

deleteButton.addEventListener("click", deleteCurrent);
clearAllButton.addEventListener("click", clearAll);
numberButtons.forEach((button) => button.addEventListener("click", addNumber));
operationButtons.forEach((button) =>
  button.addEventListener("click", chooseOperation)
);
resultButton.addEventListener("click", evaluate);
decimalButton.addEventListener("click", addDecimal);

function addNumber(e) {
  let number = e.target.value;
  if (current_operand.length < 20) {
    if (current_operand === "0" && previous_operand === "0") {
      current_operand = "";
      current_operand = current_operand + number;
      previous_operand = current_operand;
    } else if (current_operand === "0" && previous_operand !== "0") {
      current_operand = "0";
      previous_operand = previous_operand;
    } else if (isEvaluated && previous_operand !== "") {
      current_operand = current_operand + number;
      previous_operand = "" + number;
      isEvaluated = false;
    } else if (isEvaluated === false) {
      current_operand = current_operand + number;
      previous_operand = previous_operand + number;
    }
  }
  if (current_operand.length >= 20) {
    warning();
  }
  updateDisplay();
}

function addDecimal(e) {
  if (current_operand !== "" && !current_operand.includes(".")) {
    current_operand = current_operand + ".";
    previous_operand = previous_operand + ".";
    updateDisplay();
  }
}

function reset() {
  if (previous_operand !== "") {
    current_operand = "";
  }
}

function warning() {
  previous_operand = previous_operand;
  current_operand = "digit limit met";
  return setTimeout(() => {
    transactionText.innerText = previous_operand;
    current_operand = previous_operand;
    inputText.innerText = previous_operand;
  }, 200);
}

function updateDisplay() {
  inputText.innerText = current_operand;
  transactionText.innerText = previous_operand;
}

function chooseOperation(e) {
  let operator = e.target.value;
  isEvaluated = false;
  if (current_operand.length < 20) {
    if (endsWithOperator.test(previous_operand)) {
      current_operand = operator;
      if (!endsWithNegativeSign.test(previous_operand.toString())) {
        if (endsWithNegativeSign.test(previous_operand + operator)) {
          previous_operand = previous_operand + operator;
        } else if (!endsWithNegativeSign.test(previous_operand + operator)) {
          previous_operand = previous_operand.toString().slice(0, -1);
        }
      } else if (operator !== "-") {
        previous_operand = previous_operand.toString().slice(0, -2) + operator;
      }
    }

    if (!endsWithOperator.test(previous_operand)) {
      current_operand = operator;
      previous_operand = previous_operand + operator;
      console.log("check1");
    }
  }
  if (current_operand.length >= 20) {
    warning();
  }

  updateDisplay();
  reset();
}

function evaluate(e) {
  var result;
  if (
    previous_operand !== "" &&
    endsWithOperator.test(current_operand) !== true
  ) {
    result = Math.round(1000000000000 * eval(previous_operand)) / 1000000000000;
    current_operand = result.toString();
    previous_operand = previous_operand.toString() + "=" + result;
    updateDisplay();
    isEvaluated = true;
  }

  if (isEvaluated) {
    previous_operand = result;
    current_operand = "";
    console.log(isEvaluated, "flag evaluated");
  }
}

function deleteCurrent(e) {
  if (!isEvaluated) {
    current_operand = current_operand.toString().slice(0, -1);
    previous_operand = previous_operand.toString().slice(0, -1);
  }
  if (isEvaluated) {
    current_operand = "0";
    previous_operand = "0";
    isEvaluated = false;
  }
  updateDisplay();
}

function clearAll(e) {
  current_operand = "0";
  previous_operand = "0";
  isEvaluated = false;
  updateDisplay();
}
