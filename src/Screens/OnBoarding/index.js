import React, { Component } from "react";
import {
  StatusBar,
  View,
  Platform,
  TouchableOpacity,
  Image,
  Text,
  PermissionsAndroid,
  Linking,
  Keyboard
} from "react-native";
import styles from "./styles";
import Video from "react-native-video";
import {
  Button,
  Inputs,
  CountriesData,
  ContactsModal,
  Loader,
  Validations,

} from "./../../Components";
import { AppColor, AppImages } from "./../../Themes";
import I18n from "react-native-i18n";
import CompleteSignup from "../CompleteSignup";
import OTPScreen from "../OTP_Screen";
import ContactPermission from "../ContactPermission";
import InviteContacts from "../InviteContacts";
import Contacts from "react-native-contacts";
import SendSMS from "react-native-sms";
import { connect } from "react-redux";
import DeviceInfo from "react-native-device-info";
import { bindActionCreators } from "redux";

import {
  registerAction,
  loginAction,
  otpVerify,
  checkUserAction,
  OTPAction,
  onBackPress,
  onNextAction,
  resetViewIndex,
  setViewIndex
} from "../../Redux/actions/Authentication";
import otpVerifyP from 'react-native-otp-verify'
import { Clipboard } from "react-native";
import Geolocation from "@react-native-community/geolocation";
import { fontFamily } from "../../Themes/AppFontFamily";
import AsyncStorage from "@react-native-async-storage/async-storage";

var SendIntentAndroid = require("react-native-send-intent");

class OnBoarding extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
    };
  };


  constructor(props) {
    super(props);
    this.state = {
      playWhenInactive: false,
      phoneNumber: "",
      view: true,
      countryCode: "+1",
      viewIndex: 1,
      keydata: "login",
      allContacts: [],
      messageModel: "false",
      volume: 1,
      bottomView: true

    };
    this.loginSuccess = "";
    this.inputs = {};
    this.countryDialCodeArray = [];
    for (let i in CountriesData.codes) {
      this.countryDialCodeArray.push(CountriesData.codes[i].dial_code);
    }
  }
  componentDidMount() {

    if (Platform.OS == 'ios') {
      Geolocation.setRNConfiguration({
        authorizationLevel: 'always'
      })
      Geolocation.requestAuthorization()
    }
    else {


    }

    Clipboard.setString('')
    if (Platform.OS == 'android') {
      otpVerifyP.getHash().then((res) => {
        console.log('app hash', res);
      })
    }
    this.setState({ playWhenInactive: true });
    Keyboard.addListener('keyboardDidShow', () => {
      this.setState({ bottomView: false })
    })
    Keyboard.addListener('keyboardDidHide', () => {
      this.setState({ bottomView: true })
    })
  }
  componentDidUpdate(nextProps) {
    if (nextProps.loginState !== this.props.loginState) {
      if (
        this.props.loginState.result !== null &&
        this.props.loginState.error == null
      ) {
        let userDetail = this.props.loginState.playerStop;
        this.setState({ playWhenInactive: userDetail });
      }
    }
    if (nextProps !== this.props) {
      if (nextProps.otpState !== this.props.otpState) {
        if (this.props.otpState.otpSent == true) {
          this.props.otpState.otpSent = false

        }
        if (this.props.otpState.otpVerify == true) {

          this.props.otpState.otpVerify = false
          this.props.loginAction(
            this.props.otpState.phoneNumber,
            this.props.otpState.countryCode,
            this.props.navigation,
            this.state.keydata,
            I18n.currentLocale()
          );
        }
      }
    }
  }

  fetchConacts() {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS).then((res) => {
        if (res == 'granted') {
          Contacts.getAll((err, contacts) => {
            if (err === "denied") {
              this.navigationFR8()
            } else {
              let contactsArrray = ContactsModal.getPhonesData(contacts);
              this.setState({ allContacts: contactsArrray });
              this.props.onNextAction(this.state.allContacts);
            }
          });
        }
        else {
          console.log('denay');
          this.navigationFR8()
        }
      }).catch((e) => {
        console.log(e);
      });
    } else {
      Contacts.getAll((err, contacts) => {
        console.log(err, contacts);
        if (err === "denied") {
          this.navigationFR8()
        } else {
          let contactsArrray = ContactsModal.getPhonesData(contacts);
          this.setState({ allContacts: contactsArrray });
          this.props.onNextAction(this.state.allContacts);
        }
      });
    }
  }

  sendSms() {
    if (Platform.OS == 'ios') {
      SendSMS.send(
        {
          //Message body
          body: "Please follow https://aboutreact.com",
          //Recipients Number
          recipients: ["9815010225"],
          //An array of types that would trigger a "completed" response when using android
          successTypes: ["sent", "queued"]
        },
        (completed, cancelled, error) => {
          if (completed) {
            console.log("SMS Sent Completed");
          } else if (cancelled) {
            console.log("SMS Sent Cancelled");
          } else if (error) {
            console.log("Some error occured");
          }
        }
      );
    }
    else {
      SendIntentAndroid.sendSms('9815010225', 'Please follow https://aboutreact.com');

    }
  }

  updateRefs(id, input) {
    this.inputs[id] = input;
  }

  focusNextField(id) {
    if (id == "done") {
      Keyboard.dismiss();
    } else {
      this.inputs[id].focus();
    }
  }


  termsView = () => {
    Linking.openURL(I18n.t('TermsUrl')).catch(err => console.error("Couldn't load page", err));

  }
  privacyPolicy = () => {
    Linking.openURL(I18n.t('PrivacyUrl')).catch(err => console.error("Couldn't load page", err));

  }


  modelOpen = () => {
    this.setState({ messageModel: true });
  };
  ///method to render phone number screen view
  phoneNumberView = () => {
    return (
      <View style={styles.phoneNumberView}>


        <View
          style={{
            flex: 0.4,
            alignItems: "center",
            justifyContent: "flex-end",
            marginTop: Platform.OS == 'ios' ? 0 : 20
          }}
        >
          <TouchableOpacity onPress={() => {
            if (this.state.volume === 1) {
              this.setState({ volume: 0.0, })
            } else {
              this.setState({ volume: 1, })

            }
          }
          }>
            {this.state.volume === 1 ? <Image
              style={[{ marginBottom: DeviceInfo.hasNotch() ? 50 : 40, width: 30, height: 30 }]}
              source={AppImages.images.volume}
              resizeMode={"contain"}
            /> : <Image
              style={[{ marginBottom: DeviceInfo.hasNotch() ? 50 : 40, width: 30, height: 30 }]}
              source={AppImages.images.mute}
              resizeMode={"contain"}
            />}
          </TouchableOpacity>

          <Image
            style={styles.phoneImage}
            source={AppImages.images.smartphone}
            resizeMode={"contain"}
          />
          <Text style={styles.verifyAc}>
            {I18n.t('verifyAccount')}
          </Text>
          <Text style={styles.loginText}>
            {I18n.t('PhoneNumber_required_for_login')}
          </Text>
        </View>
        <View style={styles.phoneNumberInputView}>
          <Inputs
            maxLength={15}
            value={this.state.phoneNumber}
            source={AppImages.images.phone}
            onRef={input => this.updateRefs("phoneNo", input)}
            placeholder={I18n.t('Enter_Your_Phone_Number')}
            onChangeText={phoneNumber => this.setState({ phoneNumber })}
            autoCapitalize={"none"}
            keyboardType={"numeric"}
            returnKeyType={"done"}
            countryText={
              "+1"
            }
          />
          <Button Text={I18n.t("Submit")} onPress={this.submitPhoneNo} />
          <Text style={styles.privacyTerms}>
            {I18n.t('Privacy_policy')}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: "center" }}>
            <Text style={styles.policyText} onPress={this.termsView}>
              {I18n.t('Terms')}
            </Text>
            <Text style={styles.privacyTerms}>
              {" " + I18n.t('And') + " "}
            </Text>
            <Text style={styles.policyText} onPress={this.privacyPolicy}>
              {I18n.t('Policy')}
            </Text>
          </View>
        </View>
        {this.state.bottomView == true && <View style={styles.phoneSubmitView}>
          <Text style={styles.modelText} onPress={this.modelOpen}>
            {I18n.t('Why_you_need_my_phone_number') + "?"}
          </Text>
        </View>}
      </View>
    );
  };

  ///method to submit the phone number
  submitPhoneNo = () => {
    let { navigation } = this.props;
    if (
      this.state.phoneNumber == "" ||
      this.state.phoneNumber.trim().length === 0
    ) {
      alert(I18n.t("enter_phone_number_alert"));
    } else if (this.state.phoneNumber.length < 8) {
      alert(I18n.t("enter_phone_number_length_alert"));
    } else if (!Validations.validatePhoneNumber(this.state.phoneNumber)) {
      alert(I18n.t("enter_Numbers_allowed__phone_alert"));
    } else {
      Keyboard.dismiss()
      setTimeout(() => {
        this.props.OTPAction(
          this.state.phoneNumber,
          this.state.countryCode,
          navigation
        );
      }, 500);
      setTimeout(() => {
        if (this.props.valueIndex !== 1) {
          this.setState({ phoneNumber: "" });
        }
      }, 1300);
    }
  };

  switchView = () => {
    switch (this.props.viewIndex) {
      case 1:
        return this.phoneNumberView();
      case 2:
        return <OTPScreen onPress={(code) => this.submitOTP(code)} />;
      case 3:
        return <CompleteSignup navigation={this.props.navigation} />;
      case 4:
        return (
          <ContactPermission
            onPressAllow={this.allowContactPermission}
            skipPress={this.navigationFR8}
            navigation={this.props.navigation}
          />
        );

      case 5:
        return (
          <InviteContacts
            backPress={this.backButtonPress}
            rightBackBtnPress={this.navigationFR8}
            continuePress={this.navigationFR8}
          />
        );

      case 8:
        this.props.otpState.viewIndex = 1
        return this.props.navigation.navigate('Regions', { FromOnBoarding: true })

      default:
        return this.phoneNumberView();
    }
  };

  //method to submit OTP
  submitOTP = (code) => {
    let { navigation } = this.props;
    if (Platform.OS == 'android') {
      this.props.otpVerify(
        this.props.otpState.phoneNumber,
        this.props.otpState.countryCode,
        code,
        navigation,
        this.state.keydata,
        I18n.currentLocale()
      )
    }
    else {
      this.props.loginAction(
        this.props.otpState.phoneNumber,
        this.props.otpState.countryCode,
        navigation,
        this.state.keydata,
        I18n.currentLocale()
      );
    }

  };


  //method to allow contact Permission
  allowContactPermission = () => {
    this.fetchConacts();
  };

  //method to show back button and update the class view on press
  backButton = () => {
    return this.props.viewIndex > 1 && this.props.viewIndex < 5 ? (
      <TouchableOpacity
        style={styles.backImageView}
        onPress={this.backButtonPress}
      >
        <Image
          resizeMode="contain"
          source={AppImages.images.backLeft}
          style={styles.backImage}
        />
      </TouchableOpacity>
    ) : null;
  };

  //method to navigate to FR8  screen
  navigationFR8 = () => {
    this.props.setViewIndex(8, this.props.navigation)
    this.props.resetViewIndex();
    this.setState({ playWhenInactive: false });
  };

  ///method to decrease the view index on press of back button
  backButtonPress = () => {
    this.props.onBackPress();
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader isLogin={true} loading={this.props.otpState.onLoad} />
        {this.backButton()}

        {Platform.OS == "ios" ? (
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor={AppColor.colors.lightBlue}
          />
        ) :
          <StatusBar
            translucent
            barStyle="light-content"
            backgroundColor={'transparent'}
          />
        }
        <Video
          source={require("./../../Images/fr8Video.m4v")}
          volume={this.state.volume}
          ref={ref => {
            this.player = ref;
          }}
          style={{ flex: 1 }}
          resizeMode="cover"
          repeat={true}
          onError={buffer => console.log("error", buffer)}
          playWhenInactive={this.state.playWhenInactive}
          paused={!this.state.playWhenInactive}
        />
        <View style={{ position: 'absolute', top: '10%', width: '100%' }}>
          <Image style={{ tintColor: 'white', alignSelf: 'center', height: 100, width: 100 }} resizeMode='contain' source={require('../../Images/Login_logo.png')} />
          <Text style={{ color: 'white', fontFamily: fontFamily.bold, fontSize: 30, marginTop: '6%', alignSelf: 'center' }}>Welcome to FR8</Text>
          <TouchableOpacity
            onPress={() => {
              AsyncStorage.setItem('isStarted', JSON.stringify(true))
              this.props.navigation.replace('FavouriteTerminal2')

            }}
            style={{ alignSelf: 'center', alignItems: 'center', justifyContent: 'center', width: '50%', paddingVertical: 15, marginTop: '100%', borderRadius: 14, justifyContent: 'center', backgroundColor: '#28A2E1' }}>
            <Text
              style={{ fontSize: 20, fontFamily: fontFamily.bold, color: 'white' }}
            >{"Get Started"}</Text>

          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    registerState: state.RegisterState,
    loginState: state.LoginState,
    otpState: state.OTPState,
    viewIndex: state.OTPState.viewIndex
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      registerAction,
      checkUserAction,
      loginAction,
      OTPAction,
      onBackPress,
      onNextAction,
      otpVerify,
      resetViewIndex,
      setViewIndex
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnBoarding);