import { AFLogEvent } from "../../Config/aws";
import { ApiConstants } from "../../Themes";

function loginAction(phoneNo, countryCode, navigation, keydata, locale) {
  AFLogEvent("Loginaction", { action: 'Login'})
  const action = {
    type: ApiConstants.constants.API_LOGIN_LOAD,
    phoneNo: phoneNo,
    countryCode: countryCode,
    navigation: navigation,
    keydata: keydata,
    locale: locale
  };

  return action;
}
function loginActionWithUserName(userName,password,navigation,list=[],userId,name='',email='',phoneNumber='',screen='') {
  AFLogEvent("loginActionWithUserName", { action: 'Login'})
  const action = {
    type: "API_LOGIN_WITH_USERNAME_LOAD",
   userName:userName,
   password:password,
   navigation:navigation,
   name,
   email,
   list,
   screen,
   phoneNumber,
   userId
  };

  return action;
}
function setLogin(val) {
  const action = {
    type: "SET_LOGIN",
   val
  };

  return action;
}
function verifyOtpForPassword(otp,userName,list) {
  AFLogEvent("verifyOtpForPassword", { action: 'verifyOtpForPassword'})
  const action = {
    type: "API_VERIFY_OTP_FOR_PASSWORD_LOAD",
   userName:userName,
   otp:otp,
   list:list
  };

  return action;
}
function isUserExistss(userName,screen='',text='',navigation=null) {
  // AFLogEvent("userExist", { action: 'userExist'})
  const action = {
    type: "API_USERNAME_EXIST_LOAD",
   userName:userName,
   screen,
   text,
   navigation

  };

  return action;
}
function otpVerify(phoneNo, countryCode,code, navigation, keydata, locale) {
  AFLogEvent("OTPVerifyaction", { action: 'OTP Verify'})
  const action = {
    type: ApiConstants.constants.API_OTP_VERIFY_LOAD,
    code:code,
    phoneNo: phoneNo,
    countryCode: countryCode,
    navigation: navigation,
    keydata: keydata,
    locale: locale
  };

  return action;
}

function registerAction(
  name,
  firstName,
  lastName,
  email,
  userType,
  driveType,
  countryCode,
  phoneNo,
  navigation
) {
  AFLogEvent("Registeraction", { action: 'Register'})

  const action = {
    type: ApiConstants.constants.API_REGISTER_LOAD,
    name: name,
    firstName: firstName,
    lastName: lastName,
    email: email,
    userType: userType,
    driveType: driveType,
    countryCode: countryCode,
    phoneNo: phoneNo,
    navigation: navigation
  };

  return action;
}

function checkUserAction(
  image,
  name,
  userName,
  email,
  userType,
  driveType,
  countryCode,
  phoneNo,
  dob,
  password,
  navigation
) {
  const action = {
    type: ApiConstants.constants.API_CHECK_USER_LOAD,
    image: image,
    name: name,
    userName: userName,
    email: email,
    userType: userType,
    driveType: driveType,
    countryCode: countryCode,
    phoneNo: phoneNo,
    dob: dob,
    password: password,
    navigation: navigation
  };
  return action;
}

function OTPAction(phoneNo, countryCode, navigation, keyValue) {
  AFLogEvent("OTPAction", { action: 'OTP'})
  const action = {
    type: ApiConstants.constants.API_OTP_LOAD,
    phoneNo: phoneNo,
    countryCode: countryCode,
    navigation: navigation,
    keyValue: keyValue
  };

  return action;
}

function resetPasswordAction(phoneNo, password, navigation) {
  const action = {
    type: ApiConstants.constants.API_RESET_PASSWORD_LOAD,
    phoneNo: phoneNo,
    password: password,
    navigation: navigation
  };
  return action;
}
function setPassword(userName, password, navigation,userId,screen='',listParse=[]) {
  const action = {
    type: "API_PASSWORD_SET_LOAD",
    userName: userName,
    password: password,
    navigation: navigation,
    screen:screen,
    list:listParse,
    userId:userId
  };
  return action;
}

function logOutAction(navigation) {
  AFLogEvent("logOutAction", { action: 'logOutAction'})

  const action = {
    type: ApiConstants.constants.API_LOG_OUT_LOAD,
    navigation: navigation
  };
  return action;
}
function deleteAccountAction(navigation) {
  AFLogEvent("deleteAccountAction", { action: 'deleteAccountAction'})

  const action = {
    type: "API_DELETE_ACCOUNT_LOAD",
    navigation: navigation
  };
  return action;
}

function changePasswordAction(oldPassword, newPassword, navigation,modalRef) {
  const action = {
    type: ApiConstants.constants.API_CHANGE_PASSWORD_LOAD,
    oldPassword: oldPassword,
    newPassword: newPassword,
    navigation: navigation,
    modalRef
  };
  return action;
}

function getUserProfileAction(navigation) {
  const action = {
    type: ApiConstants.constants.API_GET_USER_PROFILE_LOAD,
    navigation: navigation
  };
  return action;
}

function onBackPress() {
  const action = {
    type: "onBackPressLoad"
  };
  return action;
}
function onNextAction(contactnumber) {
  const action = {
    type: "onNextAction",
    contactnumber: contactnumber
  };

  return action;
}
function resetViewIndex() {
  const action = {
    type: "resetViewIndex"
  };
  return action;
}

function getContactAction(contactnumber) {
  const action = {
    type: ApiConstants.constants.API_GETCONTACT_LOAD,
    contactnumber: contactnumber
  };
  return action;
}
function sentInvite(phoneNo, message) {
  const action = {
    type: ApiConstants.constants.API_SENTINVITE_LOAD,
    phoneNo: phoneNo,
    message: message
  };
  return action;
}

function saveEditDataAction(
  // name,
  // email,
  countryCode,
  phoneNo
  // userType,
  // driverType
) {
  const action = {
    type: "saveProfileData",
    // name: name,
    // email: email,
    countryCode: countryCode,
    phoneNo: phoneNo
    // userType: userType,
    // driverType: driverType
  };

  return action;
}
function updatePhoneNumber(phoneNo, navigation) {
  const action = {
    type: ApiConstants.constants.API_UPDATE_PHONE_NUMBER_LOAD,
    phoneNo: phoneNo,
    navigation: navigation
  };
  return action;
}
function updateUserProfileAction(
  name,
  firstName,
  lastName,
  email,
  userType,
  driverType,
  phoneNumber,
  navigation
) {
  const action = {
    type: ApiConstants.constants.API_UPDATE_USER_PROFILE_LOAD,
    name: name,
    firstName:firstName,
    lastName:lastName,
    email: email,
    userType: userType,
    driverType: driverType,
    navigation: navigation,
    phoneNumber:phoneNumber
  };

  return action;
}
function updateUserEmailAction(
  email,
  navigation
) {
  const action = {
    type: "API_UPDATE_EMAIL_PROFILE_LOAD",
    
    email: email,
    navigation: navigation
  };

  return action;
}

function changeViewIndex(value) {
  const action = {
    type: "changeViewIndex",
    value: value
  };
  return action;
}
function ChangeLanguageAction(value, navigation) {
  AFLogEvent("ChangeLanguageAction", { action: 'ChangeLanguage',value:value})
  const action = {
    type: "CHANGE_LANGUAGE_LOAD",
    value: value,
    navigation: navigation
  };
  return action;
}
function setViewIndex(value,navigation) {
  const action = {
    type: "SET_VIEW_INDEX",
    value: value,
    navigation:navigation
  };
  return action;
}

module.exports = {
  setLogin,
  setViewIndex,
  loginAction,
  registerAction,
  checkUserAction,
  OTPAction,
  otpVerify,
  onBackPress,
  resetPasswordAction,
  logOutAction,
  changePasswordAction,
  getUserProfileAction,
  updateUserProfileAction,
  onNextAction,
  saveEditDataAction,
  getContactAction,
  sentInvite,
  changeViewIndex,
  resetViewIndex,
  updatePhoneNumber,
  ChangeLanguageAction,
  deleteAccountAction,
  loginActionWithUserName,
  isUserExistss,
  verifyOtpForPassword,
  setPassword,
  updateUserEmailAction
};
