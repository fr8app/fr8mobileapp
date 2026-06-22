import React, { Component } from "react";
import {
  View,
  Platform,
  NativeModules,
  Alert,
} from "react-native";
import NetInfo from '@react-native-community/netinfo';
import Main_Stack_2 from "./route";
import { NavigationContainer } from "@react-navigation/native";
import SplashScreen from "react-native-splash-screen";
import { DataManager, FetchApi, Button } from "./../Components";
import NavigationService from "./NavigationService";
import {
  AppConstantsSpanish,
  AppConstants,
  AppConstantsHindi,
  AppPortuguse,
  AppConstantChineseSimplified,
  AppConstantsFilipino,
  AppConstantsBengali,
  AppConstantsFrench,
  AppConstantsGermen,
  AppConstantsKoren,
  AppConstantsRussian,
  AppConstantsItalian,
  AppConstantsVietnamese,
} from "./../Themes";
import { InAppNotificationProvider } from "react-native-in-app-notification";
import I18n from "react-native-i18n";
import { EventRegister } from "react-native-event-listeners";
import { PERMISSIONS, request } from 'react-native-permissions';
import {
  appversionAction
} from "../Redux/actions/AppVersionAction";
import {
  loginActionWithUserName,
  isUserExistss,
  verifyOtpForPassword,
  updateUserEmailAction,
  setPassword
} from "../Redux/actions/Authentication";
import { ProfileDataInitate } from '../Redux/actions/profileAction';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { PickerModal } from "../Components/PickerModal";
import appsFlyer from "react-native-appsflyer";
import LoginPopUp from "../Components/LoginPopUp/login";
import LoginPopUp2 from "../Components/LoginPopUp2/login";
import { setpopUpRef, setpopUpRef2, setEmailpopUpRef } from "../Config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Email from "../Components/EmailPop/Email";
I18n.translations = {
  ["en"]: AppConstants.constants,
  ["es"]: AppConstantsSpanish.constants,
  ["pt"]: AppPortuguse.constants,
  ['hi']: AppConstantsHindi.constants,
  ['zh']: AppConstantChineseSimplified.constants,
  ['ph']: AppConstantsFilipino.constants,
  ['bn']: AppConstantsBengali.constants,
  ['fr']: AppConstantsFrench.constants,
  ['de']: AppConstantsGermen.constants,
  ['ko']: AppConstantsKoren.constants,
  ['ru']: AppConstantsRussian.constants,
  ['it']: AppConstantsItalian.constants,
  ['vi']: AppConstantsVietnamese.constants
};

const initOptions = {
  isDebug: true,
  devKey: "jLYBXLPwHPCCcdJjmPBYbD",
  onInstallConversionDataListener: true,
  timeToWaitForATTUserAuthorization: 10,
  onDeepLinkListener: false,
  appId: Platform.OS == 'ios' ? 'id1562162277' : 'com.fr8'
};

// Appsflyer Gill

// Dev Key: jLYBXLPwHPCCcdJjmPBYbD
// iOS APp ID: 1562162277


class Setup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissionEnable: false,
      version: null,
      loggedIn: null,
      isMedatory: false,
      language: "",
      isDropdownVisible: false,
      started: null
    };
    this.onBoard = false;
    this.setLangugae();
    this.checkInternetConnection();
    this.checkUserLogedIn();

    this.language = null;
    setTimeout(() => {
      SplashScreen.hide();
    }, 500);

  }

  componentWillMount() {
    if (Platform.OS == 'ios') {
      appsFlyer.setCurrentDeviceLanguage("EN");
    }
    appsFlyer.initSdk(initOptions, null, null);
    request(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION).then((res) => {
      if (res == 'granted') {

      }
      else {

      }
    })

    this.listener = EventRegister.addEventListener("language", data => {
      this.setLangugae("emiter");
    });
  }
  componentWillUnmount() {
    EventRegister.removeEventListener(this.listener);
  }

  checkInternetConnection() {
    NetInfo.addEventListener(state =>
      this.handleConnectionChange(state.isConnected)
    );
    NetInfo.fetch().then((isConnected) => {
      console.log('infetch', isConnected.isConnected);
      FetchApi.checkInternetConnection(isConnected.isConnected);
    })
  }

  handleConnectionChange = isConnected => {
    console.log('isConnected', isConnected);
    FetchApi.checkInternetConnection(isConnected);
  };

  checkUserLogedIn() {

    AsyncStorage.getItem('isStarted').then((res) => {
      let parseRes = JSON.parse(res)
      console.log('parseRes', parseRes);
      if (parseRes) {
        this.setState({ started: true })
      }
      else {
        this.setState({ started: false })

      }
    })

    DataManager.getUserDetails().then(response => {
      if (response) {
        let result = JSON.parse(response);
        DataManager.getAccessToken().then(token => {
          if (Platform.OS == 'ios') {
            if (token) {
              NativeModules.ViewController.notificationText(I18n.t('openApp'), I18n.t('openAppBody'))
            }
            else {
              NativeModules.ViewController.notificationText('empty', "empty")
            }

          }
          let accessToken = JSON.parse(token)
          DataManager.setAccessToken(accessToken);
          FetchApi.setAccessToken(accessToken);
        })

        this.setState({ loggedIn: true });
      } else {
        this.setState({ loggedIn: false });
        if (Platform.OS == 'ios') {
          NativeModules.ViewController.notificationText('empty', "empty")
        }
      }
    });

    DataManager.getOnBoardingValue().then(res => {
      if (res) {
        this.onBoard = true;
      } else {
        this.onBoard = false;
      }
    });
  }

  setLangugae(from) {
    DataManager.getAppLanguage().then(response => {
      if (response) {
        if (Platform.OS == 'ios') {
          console.log('I18n.t()', I18n.t('openApp'));
          setTimeout(() => {
            NativeModules.ViewController.notificationText(I18n.t('openApp'), I18n.t('openAppBody'))
          }, 200);
        }
        console.log('localeresp', JSON.parse(response))
        I18n.locale = JSON.parse(response);
        I18n.fallbacks = true;
      } else {
        if (Platform.OS == 'ios') {
          console.log('I18n.t()', I18n.t('openApp'));
          NativeModules.ViewController.notificationText('empty', "empty")
        }
        let locale = Platform.OS == 'ios' ? NativeModules.SettingsManager.settings.AppleLocale : NativeModules.I18nManager.localeIdentifier != undefined ? NativeModules.I18nManager.localeIdentifier : "en";
        let currentLang;
        if (locale?.includes('es')) {
          currentLang = 'es';
          I18n.locale = 'es';
          I18n.fallbacks = true;
        }
        else if (locale?.includes('pt')) {
          currentLang = 'pt';
          I18n.locale = 'pt';
          I18n.fallbacks = true;
        }
        else if (locale.includes('hi')) {
          currentLang = 'hi';
          I18n.locale = 'hi';
          I18n.fallbacks = true;
        }
        else if (locale.includes('zh')) {
          currentLang = 'zh';
          I18n.locale = 'zh';
          I18n.fallbacks = true;
        }
        else if (locale.includes('ph')) {
          currentLang = 'ph';
          I18n.locale = 'ph';
          I18n.fallbacks = true;
        }
        else if (locale.includes('bn')) {
          currentLang = 'bn';
          I18n.locale = 'bh';
          I18n.fallbacks = true;
        }
        else if (locale.includes('fr')) {
          currentLang = 'fr';
          I18n.locale = 'fr';
          I18n.fallbacks = true;
        }
        else if (locale.includes('de')) {
          currentLang = 'de';
          I18n.locale = 'de';
          I18n.fallbacks = true;
        }
        else if (locale.includes('ko')) {
          currentLang = 'ko';
          I18n.locale = 'ko';
          I18n.fallbacks = true;
        }
        else if (locale.includes('ru')) {
          currentLang = 'ru';
          I18n.locale = 'ru';
          I18n.fallbacks = true;
        }
        else if (locale.includes('it')) {
          currentLang = 'it';
          I18n.locale = 'it';
          I18n.fallbacks = true;
        }
        else if (locale.includes('vi')) {
          currentLang = 'vi';
          I18n.locale = 'vi';
          I18n.fallbacks = true;
        }
        else {
          currentLang = 'en';
          I18n.locale = "en";
          I18n.fallbacks = true;
        }
        console.log(currentLang)
        I18n.fallbacks = true;
      }
    });

  }
  componentDidMount() {
    setTimeout(() => {
      this.props.appversionAction();
    }, 2000);

  }



  render() {
    return (
      <>
        <InAppNotificationProvider onPress={() => Alert.alert('Alert', 'You clicked the notification!')}>
          <View style={{ flex: 1 }}>
            <LoginPopUp
              {...this.props}
              ref={(ref) => { setpopUpRef(ref) }} />
            <LoginPopUp2
              {...this.props}
              ref={(ref) => { setpopUpRef2(ref) }} />
            <Email
              {...this.props}
              ref={(ref) => { setEmailpopUpRef(ref) }} />
            {this.state.loggedIn !== null ? (
              <NavigationContainer
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              >
                <Main_Stack_2
                  loggedIn={this.state.loggedIn}
                  onBoard={this.onBoard}
                  permissionAllowed={this.state.permissionEnable}
                  started={this.state.started}
                />
              </NavigationContainer>
            ) : (
              <View />
            )}

          </View>
        </InAppNotificationProvider>
        <PickerModal />
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
  }
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      appversionAction,
      loginActionWithUserName,
      isUserExistss,
      verifyOtpForPassword,
      setPassword,
      updateUserEmailAction,
      ProfileDataInitate
    },
    dispatch
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Setup);
