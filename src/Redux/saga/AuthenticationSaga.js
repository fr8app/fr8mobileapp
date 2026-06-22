import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { put, call, delay } from "redux-saga/effects";
import { FetchApi, DataManager } from "../../Components";
import { ApiConstants } from "../../Themes";
import { getPopRef, getPopRef2, getEmailpopUpRef } from "../../Config";
import { StackActions } from "@react-navigation/native";
export function* loginApiSaga(action) {
  console.log("number", action);
  try {
    const result = yield call(
      FetchApi.login,
      action.phoneNo,
      action.countryCode,
      action.locale
    );
    console.log("Number Otp", result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_LOGIN_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        loginData: action,
      });
    } else {
      yield put({ type: ApiConstants.constants.API_LOGIN_FAIL, isBlock: true });
      if (result?.result?.data?.is_block == true) {
        Alert.alert("Alert", result.result.message, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        yield put({
          type: ApiConstants.constants.API_LOGIN_FAIL,
          isBlock: false,
        });
        setTimeout(() => {
          // alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: ApiConstants.constants.API_LOGIN_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* loginApiSaga2(action) {
  console.log("number", action);
  try {
    // let selectedRegions=

    const result = yield call(
      FetchApi.loginwithUserName,
      action.userName,
      action.password,
      action.name,
      action.email,
      action.list,
      action.userId,
      action.phoneNumber
    );
    console.log("login", result);
    if (result.status === 1) {
      FetchApi.setAccessToken(result.result.data.token);
      DataManager.setAccessToken(result.result.data.token);
      DataManager.setUserDetails(result.result);
      yield put({
        type: "API_LOGIN_WITH_USERNAME_SUCCESS",
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      yield put({
        type: "API_HOME_DETAIL_LOAD",
        navigation: action.navigation,
      });
      getPopRef().modalClose();
      getPopRef2().modalClose();
      if (action.screen == "addProfile") {
        action.navigation.goBack();
      }
    } else {
      yield put({ type: "API_LOGIN_WITH_USERNAME_FAIL" });
      if (result?.result?.data?.is_block == true) {
        Alert.alert("Alert", result.result.message, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: "API_LOGIN_WITH_USERNAME_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* dummyUserCreateSaga(action) {
  try {
    const result = yield call(FetchApi.dummyUSerCreate);
    if (result.status === 1) {
      DataManager.setDummyUserDetails(result.result);
      yield put({
        type: "API_DUMMY_USER_CREATE_SUCCESS",
        payload: result.result.data.userId,
      });
      yield put({
        type: "API_FAV_TERMINAL_LOAD",
        list: [],
        navigation: null,
        FromOnBoarding: null,
        id: result.result.data.userId,
      });
    } else {
      yield put({ type: "API_DUMMY_USER_CREATE_FAIL" });
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: "API_DUMMY_USER_CREATE_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* setPasswordSaga(action) {
  console.log("number", action);
  try {
    const result = yield call(
      FetchApi.passwordSet,
      action.userName,
      action.password
      // action.list,
      // action.userId
    );
    console.log("login", result);
    if (result.status === 1) {
      // if(result?.result?.data?.token){
      FetchApi.setAccessToken(result.result.data.token);
      DataManager.setAccessToken(result.result.data.token);
      DataManager.setUserDetails(result.result);
      // }
      console.log("action.screen", action.screen);

      yield put({
        type: "API_PASSWORD_SET_SUCCESS",
        result: result,
        status: result.status,
        // navigation: action.navigation,
      });
      getPopRef().modalClose();
      getPopRef2().modalClose();
      console.log("action.screen1", action.screen);
      if (action.screen == "addProfile") {
        console.log("action.screen2", action.screen);
        setTimeout(() => {
          action.navigation.goBack();
        }, 500);
      }
      // yield put({
      //   type: "API_HOME_DETAIL_LOAD",
      //   navigation: action.navigation,
      // });
    } else {
      yield put({ type: "API_PASSWORD_SET_FAIL" });
      if (result?.result?.data?.is_block == true) {
        Alert.alert("Alert", result.result.message, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: "API_PASSWORD_SET_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* userExist(action) {
  console.log("number", action);
  try {
    const result = yield call(FetchApi.userExist, action.userName);
    console.log("usernamecheck", result);
    if (result.status === 1) {
      yield put({
        type: "API_USERNAME_EXIST_SUCCESS",
        result: result,
      });

      if (action.screen == "addProfile") {
        if (result.result.data.otpSent) {
          getPopRef2().modalOpen(
            action.userName,
            result.result.data,
            action.screen,
            action.text,
            action.navigation
          );
          setTimeout(() => {
            Alert.alert("Alert", result.result.message, [
              {
                text: "OK",
                onPress: () => {},
              },
            ]);
          }, 300);
        }
        // else if(result.result.data.usernameExits){
        //   getPopRef2().modalOpen(action.userName, result.result.data,'',action.text)

        // }
      } else {
        getPopRef().modalClose();
        getPopRef2().modalOpen(
          action.userName,
          result.result.data,
          "",
          action.text
        );
        if (result.result.data.otpSent) {
          Alert.alert("Alert", result.result.message, [
            {
              text: "OK",
              onPress: () => {},
            },
          ]);
        }
      }
    } else {
      yield put({ type: "API_USERNAME_EXIST_FAIL" });
      if (result?.result?.data?.is_block == true) {
        Alert.alert("Alert", result.result.message, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: "API_USERNAME_EXIST_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* verifyOtp(action) {
  console.log("verifyOtp", action);
  try {
    const result = yield call(
      FetchApi.verify,
      action.userName,
      action.otp,
      action.list
    );
    console.log("verifyOtp", result);
    if (result.status === 1) {
      FetchApi.setAccessToken(result.result.data.token);
      DataManager.setAccessToken(result.result.data.token);
      DataManager.setUserDetails(result.result);
      yield put({
        type: "API_VERIFY_OTP_FOR_PASSWORD_SUCCESS",
        result: result,
      });
      getPopRef2().otpVerified();
      // Alert.alert(
      //   "Alert",
      //   result.result.message,
      //   [
      //     {
      //       text: 'OK',
      //       onPress: () => {

      //       }

      //     }
      //   ]

      // )
      yield put({
        type: "API_HOME_DETAIL_LOAD",
        navigation: action.navigation,
      });
    } else {
      yield put({ type: "API_VERIFY_OTP_FOR_PASSWORD_FAIL" });
      if (result?.result?.data?.is_block == true) {
        Alert.alert("Alert", result.result.message, [
          {
            text: "OK",
            onPress: () => {},
          },
        ]);
      } else {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
      }
    }
  } catch (error) {
    console.log("error", error);
    yield put({
      type: "API_VERIFY_OTP_FOR_PASSWORD_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* otpVerifyApiSaga(action) {
  console.log("number", action);
  try {
    const result = yield call(
      FetchApi.otpVerify,
      action.phoneNo,
      action.countryCode,
      action.code,
      action.locale
    );
    console.log("Number Otp", result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_OTP_VERIFY_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        loginData: action,
      });
    } else {
      yield put({ type: ApiConstants.constants.API_OTP_VERIFY_FAIL });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_OTP_VERIFY_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* registerApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.register,
      action.name,
      action.firstName,
      action.lastName,
      action.email,
      action.userType,
      action.driveType,
      action.countryCode,
      action.phoneNo
    );
    console.log("result ", result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_REGISTER_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({ type: ApiConstants.constants.API_REGISTER_FAIL });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("error ", error);
    yield put({
      type: ApiConstants.constants.API_REGISTER_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* resetPasswordApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.resetPassword,
      action.phoneNo,
      action.password
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_RESET_PASSWORD_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({ type: ApiConstants.constants.API_RESET_PASSWORD_FAIL });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_RESET_PASSWORD_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* checkUserApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.checkUser,
      action.userName,
      action.email,
      action.phoneNo,
      action.countryCode
    );
    console.log(result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_CHECK_USER_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // setTimeout(() => {
      //   alert("Verification code is" + result.result.data.OTP);
      // }, 800);
    } else {
      yield put({ type: ApiConstants.constants.API_CHECK_USER_FAIL });
      if (result.result.message) {
        // if (result.result.message.is_unique_email !== "") {
        //   setTimeout(() => { alert(result.result.message.is_unique_email) }, 800)
        // }
        // else if (result.result.message.is_unique_phone_number !== "") {
        //   setTimeout(() => { alert(result.result.message.is_unique_phone_number) }, 800)
        // }
        // else if (result.result.message.is_unique_user_name !== "") {
        //   setTimeout(() => { alert(result.result.message.is_unique_user_name) }, 800)
        // }
        // else {
        setTimeout(() => {
          alert(result.result.message);
        }, 800);
        // }
      }
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_CHECK_USER_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* OTPApiSaga(action) {
  try {
    // console.error('error')
    const result = yield call(FetchApi.otp, action.phoneNo, action.countryCode);
    console.log("result", result);

    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_OTP_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        sentData: action,
      });
      action?.keyValue == "editProfile"
        ? action.navigation.navigate("EditProfileOtp")
        : null;
      // setTimeout(() => {
      //   alert("Verification code is " + result.result.data.OTP);
      // }, 800);
    } else {
      yield put({ type: ApiConstants.constants.API_OTP_FAIL });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("errorerror", error);
    yield put({
      type: ApiConstants.constants.API_OTP_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* logOutApiSaga(action) {
  try {
    const result = yield call(FetchApi.logOut);
    console.log("result logout", result);
    if (result.status === 1) {
      DataManager.clearData();
      FetchApi.setAccessToken("");
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      yield put({
        type: "API_DUMMY_USER_CREATE_LOAD",
      });
      yield delay(1000);
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
    } else if (result.status === 3 || result.status === 4) {
      console.log("API_LOG_OUT_UNAUTHENTICATED", action.navigation);
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });

      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("error", error);
    yield put({ type: ApiConstants.constants.API_LOG_OUT_ERROR, error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* deleteAccountSaga(action) {
  try {
    const result = yield call(FetchApi.deleteAccount);
    console.log("result logout", result);
    if (result.status === 1) {
      DataManager.clearData();
      FetchApi.setAccessToken("");
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      yield put({
        type: "API_DUMMY_USER_CREATE_LOAD",
      });

      yield delay(1000);
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");

      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      console.log("API_LOG_OUT_UNAUTHENTICATED", action.navigation);
      yield put({
        type: ApiConstants.constants.API_LOG_OUT_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetActions)
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: "API_DELETE_ACCOUNT_FAIL",
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({ type: "API_DELETE_ACCOUNT_ERROR", error: error });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* changePasswordApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.changePassword,
      action.oldPassword,
      action.newPassword
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_CHANGE_PASSWORD_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      action.modalRef.modalClose();
      setTimeout(() => {
        alert(result.result.message);
        //   const resetActions= StackActions.replace('FavouriteTerminal2')
        // action.navigation.dispatch(resetActions)
        action.navigation.popToTop();
        action.navigation.replace("FavouriteTerminal2");
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_CHANGE_PASSWORD_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetActions)
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_CHANGE_PASSWORD_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_CHANGE_PASSWORD_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* getUserProfileApiSaga(action) {
  try {
    const result = yield call(FetchApi.getUserProfile);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_GET_USER_PROFILE_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_GET_USER_PROFILE_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetActions)
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_GET_USER_PROFILE_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_GET_USER_PROFILE_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* updateUserProfileApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.updateUserProfile,
      action.name,
      action.firstName,
      action.lastName,
      action.email,
      // action.countryCode,
      action.phoneNumber,
      action.userType,
      action.driverType
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_UPDATE_USER_PROFILE_SUCCESS,
        result: result,
        name: action.name,
        status: result.status,
        navigation: action.navigation.goBack(),
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else if (result.status === 3 || result.status === 4) {
      yield put({
        type: ApiConstants.constants.API_UPDATE_USER_PROFILE_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetActions)
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_UPDATE_USER_PROFILE_FAIL,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_UPDATE_USER_PROFILE_ERROR,
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* updateUserEmailApiSaga(action) {
  try {
    const result = yield call(FetchApi.updateUserEmailProfile, action.email);
    if (result.status === 1) {
      DataManager.setUserDetails({ data: result.result.data.user_id });

      console.log("resultresultresultresult", result.result);
      yield put({
        type: "API_UPDATE_EMAIL_PROFILE_SUCCESS",
        result: result,
      });
      getEmailpopUpRef()?.modalClose();
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
      yield put({
        type: ApiConstants.constants.PROFILE_DATA_INITATE,
        payload: { navigation: action.navigation },
        // loginData: action
      });
    } else if (result.status === 3 || result.status === 4) {
      getEmailpopUpRef()?.modalClose();
      yield put({
        type: ApiConstants.constants.API_UPDATE_USER_PROFILE_UNAUTHENTICATED,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      // const resetActions= StackActions.replace('FavouriteTerminal2')
      // action.navigation.dispatch(resetActions)
      action.navigation.popToTop();
      action.navigation.replace("FavouriteTerminal2");
      result.status === 3
        ? setTimeout(() => {
            alert(result.result.message);
          }, 800)
        : setTimeout(() => {
            alert(result.result.message);
          }, 800);
    } else {
      yield put({
        type: "API_UPDATE_EMAIL_PROFILE_FAIL",
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    console.log("errorerror", error);
    yield put({
      type: "API_UPDATE_EMAIL_PROFILE_ERROR",
      error: error,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* contactApiSaga(action) {
  try {
    const result = yield call(FetchApi.getContact, action.contactnumber);
    console.log(result);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_GETCONTACT_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
    } else {
      yield put({
        type: ApiConstants.constants.API_GETCONTACT_FAIL,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_GETCONTACT_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
export function* changeLAnguage(action) {
  try {
    const result = yield call(FetchApi.changeLang, action.value);
    console.log(result);
    if (result.status === 1) {
      yield put({
        type: "LANGUAGE_CHANGE_SUCCESS",
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 2000);
    } else {
      yield put({
        type: "LANGUAGE_CHANGE_FAIL",
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: "LANGUAGE_CHANGE_ERROR",
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}

export function* sentInviteApiSaga(action) {
  try {
    const result = yield call(
      FetchApi.sendInvite,
      action.phoneNo,
      action.message
    );
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_SENTINVITE_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    } else {
      yield put({
        type: ApiConstants.constants.API_SENTINVITE_ERROR,
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_SENTINVITE_FAIL,
      error: error,
      status: error.status,
    });
    // setTimeout(() => {
    //   alert("Invalid number.");
    // }, 800);
  }
}
export function* updatePhoneApiSaga(action) {
  try {
    const result = yield call(FetchApi.updatePhone, action.phoneNo);
    if (result.status === 1) {
      yield put({
        type: ApiConstants.constants.API_UPDATE_PHONE_NUMBER_SUCCESS,
        result: result,
        status: result.status,
        navigation: action.navigation,
        // loginData: action
      });
      yield put({
        type: ApiConstants.constants.PROFILE_DATA_INITATE,
        payload: { navigation: action.navigation },
        // loginData: action
      });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
      action.navigation.pop(2);
    } else {
      yield put({ type: ApiConstants.constants.API_UPDATE_PHONE_NUMBER_FAIL });
      setTimeout(() => {
        alert(result.result.message);
      }, 800);
    }
  } catch (error) {
    yield put({
      type: ApiConstants.constants.API_UPDATE_PHONE_NUMBER_ERROR,
      error: error,
      status: error.status,
    });
    setTimeout(() => {
      alert(error.result);
    }, 800);
  }
}
