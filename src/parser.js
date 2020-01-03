/* eslint-disable no-magic-numbers */
const errorHandler = function(type, option) {
  const errorList = {
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
  return errorList[type];
};

const isOption = function(element) {
  const reg = new RegExp('^-.+$');
  return reg.test(element);
};

const extractOption = function(element) {
  const sign = element[0];
  const char = element[1];
  const optionValue = element.slice(2);
  const newOption = sign.concat(char);
  return{char, newOption, optionValue};
};

const callOnerror = function(parsedValue, char) {
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
  return callOnerror(parsedValue, char);
};

const reducer = function(optionsList, parsedValue, element) {
  if(parsedValue.optionChoice) {
    parsedValue[parsedValue.lastOptionOfList] = element;
    parsedValue.optionChoice = false;
    return parsedValue;
  }
  if(isOption(element)){
    return checkForOption(optionsList, parsedValue, element);
  }
  parsedValue.files.push(element);
  Object.freeze(parsedValue);
  return parsedValue;
};

const parser = function(optionsList, args){
  let parsedValue = {error: {}, files: []};
  parsedValue = args.reduce(reducer.bind(null, optionsList), parsedValue);
  if(parsedValue.optionChoice){
    parsedValue.error.errorKey = 'argumentReq';
    parsedValue.error.option = parsedValue.lastOption;
  }
  return parsedValue;
};

const isInvalidDelim = function(value) {
  return value && (value ==='' || value.length > 1);
};

const isInvalidField = function(value) {
  const reg = new RegExp('^[0-9,-]+$');
  return value && !reg.test(value);
};

class ErrorInParser{
  constructor(parsedValue){
    this.parsedValue = parsedValue;
  }
  getErrorType() {
    const errorKey = this.parsedValue.error.errorKey;
    const errOption = this.parsedValue.error.option;
    const errorLine = errorHandler(errorKey, errOption);
    return {errorLine};
  }

  isOptionValError() {
    const delimError = 
    isInvalidDelim(this.parsedValue.delimiter) && 'badDelim' ;
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
  const errorManager = new ErrorInParser(parsedValue);
  if(parsedValue.error.errorKey){
    return errorManager.getErrorType();
  }
  if(errorManager.isError()){
    const errorLine = errorHandler(errorManager.isError());
    return {errorLine};
  }
  const delimiter = parsedValue.delimiter || '\t';
  return {delimiter, fields: parsedValue.fields, files: parsedValue.files};
};

module.exports = cutParser;
