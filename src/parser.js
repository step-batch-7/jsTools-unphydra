const errorMessageHandler = function(type, option) {
  const errorMessageList = {
    showUsages:
    `usage: cut -b list [-n] [file ...]
       cut -c list [file ...]
       cut -f list [-s] [-d delim] [file ...]`,
    illegalOption: `cut: illegal option -- ${option}\n` +
      `usage: cut -b list [-n] [file ...]
       cut -c list [file ...]
       cut -f list [-s] [-d delim] [file ...]`,
    badDelim: 'cut: bad delimiter',
    illegalListValue: 'cut: [-cf] list: illegal list value',
    argumentReq: `cut: option requires an argument -- ${option}\n` +
    `usage: cut -b list [-n] [file ...]
       cut -c list [file ...]
       cut -f list [-s] [-d delim] [file ...]`
  };
  return errorMessageList[type];
};

const isItAOption = function(element) {
  const reg = new RegExp('^-.+$');
  return reg.test(element);
};

/* eslint-disable no-magic-numbers */
const extractOption = function(element) {
  const sign = element[0];
  const char = element[1];
  const optionValue = element.slice(2);
  const newOption = sign.concat(char);
  return{char, newOption, optionValue};
};
/* eslint-enable no-magic-numbers */

const callOnErrorInOptions = function(parsedValue, char) {
  parsedValue.error.errorKey = 'illegalOption';
  parsedValue.error.option = char;
  Object.freeze(parsedValue.error);
  return parsedValue;
};

const checkForOption = function(optionsList, parsedValue, element) {
  const {char, newOption, optionValue} = extractOption(element);
  parsedValue.lastOption = char;
  if(!optionValue){
    parsedValue.optionChoice = true;
  }
  if(Object.keys(optionsList).includes(newOption)){
    parsedValue[optionsList[newOption]] = optionValue;
    parsedValue.lastOptionOfList = optionsList[newOption];
    return parsedValue;
  }
  return callOnErrorInOptions(parsedValue, char);
};

const operationOnElement = function(optionsList, parsedValue, element) {
  if(parsedValue.optionChoice) {
    parsedValue[parsedValue.lastOptionOfList] = element;
    parsedValue.optionChoice = false;
    return parsedValue;
  }
  if(isItAOption(element)){
    return checkForOption(optionsList, parsedValue, element);
  }
  parsedValue.files.push(element);
  Object.freeze(parsedValue);
  return parsedValue;
};

const parser = function(optionsList, args){
  let parsedValue = {error: {}, files: []};
  const operationOnEachElement = operationOnElement.bind(null, optionsList);
  parsedValue = args.reduce(operationOnEachElement, parsedValue);
  if(parsedValue.optionChoice){
    parsedValue.error.errorKey = 'argumentReq';
    parsedValue.error.option = parsedValue.lastOption;
  }
  return parsedValue;
};

const isInvalidDelim = function(value) {
  const one = 1;
  const isValid = value && value.length > one;
  return value === '' || isValid;
};

const isInvalidField = function(value) {
  const reg = new RegExp('^[0-9,-]+$');
  return value && !reg.test(value);
};

class ErrorChecker{
  constructor(parsedValue){
    this.parsedValue = parsedValue;
  }
  getErrorType() {
    const errorKey = this.parsedValue.error.errorKey;
    const errOption = this.parsedValue.error.option;
    const errorLine = errorMessageHandler(errorKey, errOption);
    return {errorLine};
  }

  isOptionValError() {
    const delimError = 
    isInvalidDelim(this.parsedValue.delimiter) && 'badDelim';
    const fieldError = 
    isInvalidField(this.parsedValue.fields) && 'illegalListValue';
    return delimError || fieldError;
  }

  isFieldUndefined() {
    return !this.parsedValue.fields && 'showUsages';
  }

  isError() {
    return this.isOptionValError() || this.isFieldUndefined();
  }
}
const cutParser = function(args) {
  const optionsList = {'-d': 'delimiter', '-f': 'fields'};
  const parsedValue = parser(optionsList, args);
  const errorManager = new ErrorChecker(parsedValue);
  if(parsedValue.error.errorKey){
    return errorManager.getErrorType();
  }
  if(errorManager.isError()){
    const errorLine = errorMessageHandler(errorManager.isError());
    return {errorLine};
  }
  const delimiter = parsedValue.delimiter || '\t';
  return {delimiter, fields: parsedValue.fields, files: parsedValue.files};
};

module.exports = cutParser;
