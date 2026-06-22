import { ApiConstants } from "../../Themes";
import Picker from "react-native-picker";
const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null,
  userData: null,
  viewIndex: 1,
  sentData: null,
  phoneNumber: "",
  countryCode: "",
  index: 0,
  key: "",
  otpSent: false,
  otpVerify: false
};

function checkUser(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_OTP_LOAD:
      return { ...state, onLoad: true, userData: action };

    case ApiConstants.constants.API_OTP_SUCCESS:

      state.key = action.sentData.keyValue;
      state.phoneNumber = action.sentData.phoneNo;
      state.countryCode = action.sentData.countryCode;

      return {
        ...state,
        otpSent: true,
        onLoad: false,
        result: action.result.result,
        status: action.status,
        // navigation:
        //   state.key == "editProfile"
        //     ? action.navigation.navigate("EditProfileOtp")
        //     : null,
        viewIndex: 2
      };
    case "onBackPressLoad":
      Picker.hide()

      let index = state.viewIndex;
      state.viewIndex = index - 1;
      return { ...state };

    case "onNextAction":
      let nextIndex = state.viewIndex;
      state.viewIndex = nextIndex + 1;
      return { ...state };

    case "resetViewIndex":
      state.viewIndex = 1;
      return { ...state };


    case ApiConstants.constants.API_OTP_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,

      };

    case ApiConstants.constants.API_OTP_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_LOGIN_FAIL:
      return {
        ...state,
        viewIndex: action.isBlock == true ? 1 : 3
      };
    case ApiConstants.constants.API_REGISTER_SUCCESS:
      return {
        ...state,
        viewIndex: 4
      };

    case ApiConstants.constants.API_LOG_OUT_SUCCESS:
      return {
        ...state,
        viewIndex: 1
      };
    case "SET_VIEW_INDEX":
      action.navigation.navigate('Regions', { FromOnBoarding: true })
      console.log('asdaasd', action.value);
      return {
        ...state,
        viewIndex: 1
      };

    case ApiConstants.constants.API_LOGIN_SUCCESS:
      if (action.loginData.keydata == "login") {
        if (action.result.result.data?.selectedRegions?.length == 0) {

          state.viewIndex = 8
        }
        else {
          action.navigation.replace("FR8")
        }
      }
      else {
        state.viewIndex
      }
      return {
        ...state,
      };
    case ApiConstants.constants.API_OTP_VERIFY_LOAD:
      return { ...state, onLoad: true };
    case ApiConstants.constants.API_OTP_VERIFY_SUCCESS:
      return {
        ...state, otpVerify: true, onLoad: false
      };
    case ApiConstants.constants.API_OTP_VERIFY_FAIL:
      return { ...state, onLoad: false };
    case ApiConstants.constants.API_OTP_VERIFY_ERROR:
      return {
        ...state, onLoad: false
      };

    default:
      return state;
  }
}

export default checkUser;
