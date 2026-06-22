function getContactsData(data) {
  var videoArray = [];
  for (let i in data) {
    var object = this.getContactsObject(data[i]);
    videoArray.push(object);
  }
  return videoArray;
}

function getPhonesData(data) {
  var videoArray = [];
  for (let i in data) {
    if (data[i].phoneNumbers.length > 0) {
      var object = this.getPhoneObject(data[i]);
    }
    videoArray.push(object);
  }
  return videoArray;
}

function getPhoneObject(data) {
  return {
    name:
      data.givenName == "" ||
        data.givenName == null ||
        data.givenName == undefined
        ? "no name"
        : data.givenName,
    phone_number:
      data.phoneNumbers.length > 0
        ? data.phoneNumbers[0].number.replace(/[- )(]/g, "")
        : "123456"
  };
}
function getContactsObject(data) {
  return {
    birthday: data.birthday,
    company: data.company,
    emailAddresses: this.getEmailAddressesData(data.emailAddresses),
    familyName: data.familyName,
    givenName: data.givenName,
    hasThumbnail: data.hasThumbnail,
    jobTitle: data.jobTitle,
    middleName: data.middleName,
    note: data.note,
    phoneNumbers: this.getPhoneNumbersData(data.phoneNumbers),
    postalAddresses: data.postalAddresses,
    recordID: data.recordID,
    thumbnailPath: data.thumbnailPath,
    isSelected: false
  };
}
function getEmailAddressesData(data) {
  var email = [];
  for (let i in data) {
    var object = this.getEmailAddressesObject(data[i]);
    email.push(object);
  }
  return email;
}

function getEmailAddressesObject(data) {
  return {
    email: data.email,
    label: data.label
  };
}

function getPhoneNumbersData(data) {
  var phoneNo = [];
  for (let i in data) {
    var object = this.getPhoneNumbersObject(data[i]);
    phoneNo.push(object);
  }
  return phoneNo;
}

function getPhoneNumbersObject(data) {
  return {
    label: data.label,
    number: data.number,
    isSelectedPhoneNumber: false
  };
}

module.exports = {
  getContactsData,
  getContactsObject,
  getPhoneNumbersObject,
  getEmailAddressesObject,
  getEmailAddressesData,
  getPhoneNumbersData,
  getPhonesData,
  getPhoneObject
};
