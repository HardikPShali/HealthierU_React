export const searchFilterForDoctor = (genderFilter, feesFilter, countryFilter, docStartTime, specialityFilter, languageFilter, startTime, endTime) => {
  let url;
  let obj = {
    "gender.in": genderFilter,
    "docStartTime": startTime,
    "docEndTime": endTime,
    "rate.greaterThanOrEqual": feesFilter[0],
    "rate.lessThanOrEqual": feesFilter[1],
    "countryId.in": countryFilter,
    "specialitiesId.in": specialityFilter.join(","),
    "languageName.in": languageFilter.join(","),
  }
  let temp = []
  Object.keys(obj).forEach(c => {
    if (c === "specialitiesId.in") {
      if (specialityFilter.length > 0) {
        temp.push(`${c}=${obj[c]}`)
      }
    }
    else if (c === "languageName.in") {
      if (languageFilter.length > 0) {
        temp.push(`${c}=${obj[c]}`)
      }
    }
    else if (c === "countryId.in") {
      if (countryFilter !== "") {
        temp.push(`${c}=${obj[c]}`)
      }
    }
    else if (c === "gender.in") {
      if (genderFilter !== "") {
        temp.push(`${c}=${obj[c]}`)
      }
    }
    else if (obj[c] !== "undefined") {
      temp.push(`${c}=${obj[c]}`)
    }
  })
  let finalStr = temp.join('&');
  url = '/api/admin/doctors?' + finalStr;

  return url;
}