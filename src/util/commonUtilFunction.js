export const commonUtilFunction = {
  blobToFile,
  calculate_age,
  getQueryString,
  smoothScroll,
  getFullName,
  addDaysToDate,
  dummyEncrypt,
  dummyDecrypt,
};

function blobToFile(theBlob, fileName) {
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
}

function calculate_age(dob) {
  const birthDate = new Date(dob);
  const difference = Date.now() - birthDate.getTime();
  const age = new Date(difference);

  return Math.abs(age.getUTCFullYear() - 1970);
}

function getQueryString(id) {
  const queryString = window.location.search;
  const parameters = new URLSearchParams(queryString);
  return parameters.get(id);
}

function smoothScroll(id) {
  let objDiv = document.getElementById(id);
  objDiv &&
    objDiv.scrollTo({
      top: objDiv.lastElementChild.offsetHeight,
      behavior: "smooth",
    });
}

function getFullName(object) {
  // getting full name from object
  const { firstName, middleName, lastName } = object;
  return `${firstName} ${middleName ? middleName + " " : ""}${lastName}`;
}

function addDaysToDate(days = 0) {
  var date = new Date(); // Now
  date.setDate(date.getDate() + days); // Set now + / - days as the new date
  return date.toISOString();
}

function dummyEncrypt(value) {
  var result = "";
  for (let i = 0; i < value.length; i++) {
    if (i < value.length - 1) {
      result += value.charCodeAt(i) + 10;
      result += "-";
    } else {
      result += value.charCodeAt(i) + 10;
    }
  }
  return result;
}

function dummyDecrypt(value) {
  var result = "";
  var array = value.split("-");

  for (let i = 0; i < array.length; i++) {
    result += String.fromCharCode(array[i] - 10);
  }
  return result;
}
