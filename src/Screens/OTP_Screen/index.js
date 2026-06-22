import style from "./style";
import React, { Component } from "react";
import {
  View,
  Text,
  Keyboard,
  SafeAreaView,
  BackHandler,
  Platform
} from "react-native";
import { Button, Loader } from "./../../Components";
import styles from "./style";
import { loginAction, OTPAction, onBackPress } from "../../Redux/actions/Authentication";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import I18n from 'react-native-i18n'
import OTPInputView from "@twotalltotems/react-native-otp-input";
import SmsRetriever from 'react-native-sms-retriever';
import { Clipboard } from "react-native";
import _BackgroundTimer from "react-native-background-timer";
import moment from "moment";
var interval
class OTPScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  constructor() {
    super();
    this.state = {
      timer: '00:59',
      code: "",
      n1: "",
      n2: "",
      n3: "",
      n4: "",
      n5: "",
      n6: "",
      keyValue: "login"
    };
    this.inputs = {};
    this.seconds = 59;
  }

  sub = () => {
    this.seconds--;
    this.getTime(this.seconds * 1000);
  };

  getTime = (miliseconds) => {
    let duration1 = moment.duration(miliseconds).seconds();
    let duration2 = moment.duration(miliseconds).minutes();

    let time =

      (duration2 > 9 ? duration2 : '0' + duration2) +
      ':' +
      (duration1 > 9 ? duration1 : '0' + duration1);
    this.setState({ timer: time });
  };

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
  resetInput = () => {
    this.setState({
      n1: "",
      n2: "",
      n3: "",
      n4: "",
      n5: "",
      n6: ""
    });
  };




  _onSmsListenerPressed = async () => {
    try {
      const registered = await SmsRetriever.startSmsRetriever();

      if (registered) {
        SmsRetriever.addSmsListener(this._onReceiveSms);
      }

      console.log(`SMS Listener Registered: ${registered}`);
    } catch (error) {
      console.log(`SMS Listener Error: ${JSON.stringify(error)}`);
    }
  };

  // Handlers

  _onReceiveSms = (event) => {
    console.log('event', event);
    if (event.message) {
      const otp = /(\d{6})/g.exec(event.message)[1];
      console.log('otp', otp);
      this.setState({ code: otp })
      SmsRetriever.removeSmsListener();
      Clipboard.setString(otp.toString())
    }
  };

  componentDidMount() {
    console.log(this.props);
    _BackgroundTimer.clearInterval(interval)
    interval = _BackgroundTimer.setInterval(() => {
      if (Number(this.seconds) > 0) {
        // console.log(this.seconds);
        this.sub()
      }
    }, 1000)
    if (Number(this.seconds) == 0) {
      _BackgroundTimer.clearInterval(interval)
    }
    this._onSmsListenerPressed()
    // this._onPhoneNumberPressed()

    let { navigation } = this.props;
    console.log('this.props', this.props);
    BackHandler.addEventListener('hardwareBackPress', () => {
      console.log('otpo back');
      Clipboard.setString('')
      if (this.props.otpState.viewIndex == 2) {
        this.props.onBackPress();
        return false
      }
      else {
        return false
      }
    })

    console.log(this.props.otpState.result.data.OTP)
  }

  componentDidUpdate(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.otpState !== this.props.otpState) {
        console.log('this.props.otpState', this.props.otpState);
        if (this.props.otpState.otpSent == true) {
          if (Platform.OS == 'android') {
            this._onSmsListenerPressed()
            this.otpRef.setState({ digits: [] })

          }
          this.props.otpState.otpSent = false
          this.setState({ timer: '00:59' })
          this.seconds = 59
          Clipboard.setString('')
        }
        if (this.props.otpState.otpVerify == true) {
          _BackgroundTimer.clearInterval(interval)
          this.seconds = 0
          this.setState({ timer: '00:00' })
        }
      }
    }
  }

  submitOtp = () => {
    if (Platform.OS == 'android') {
      if (this.state.code == "" || this.state.code.trim().length == 0) {
        alert(I18n.t('enter_otp_alert'));
      }
      else {
        if (this.props.logOutState.isLogOut == true) {
          this.props.logOutState.isLogOut = false
        }
        this.props.onPress(this.state.code);
      }
    }
    else {
      if (this.state.code == "" || this.state.code.trim().length == 0) {
        alert(I18n.t('enter_otp_alert'));
      } else if (
        Number(this.props.otpState.result.data.OTP) !==
        Number(this.state.code.trim())
      ) {
        alert(I18n.t('enter__valid_otp_alert'));
      } else {
        if (this.props.logOutState.isLogOut == true) {
          this.props.logOutState.isLogOut = false
        }
        this.props.onPress(this.state.code);
      }
    }
  };

  resendOtp = () => {

    Clipboard.setString('')
    let { navigation } = this.props;
    this.props.OTPAction(
      this.props.otpState.phoneNumber,
      this.props.otpState.countryCode,
      navigation,
      this.state.keyValue
    );

  };

  otpInputs = () => {
    return (
      <View>
        <View style={styles.inputCompleteView}>
          <Text style={[style.titleStyle, { paddingBottom: 25 }]}>
            {I18n.t('Enter_Six_Digit_Verification_Code')}
          </Text>
          <OTPInputView
            ref={(ref) => this.otpRef = ref}
            style={{ width: '80%', height: 100, paddingLeft: '5%' }}
            pinCount={6}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => {
              this.setState({ code });
            }}
            autoFocusOnLoad={Platform.OS == 'ios' ? true : false}
            codeInputFieldStyle={styles.input_style}
            codeInputHighlightStyle={{ borderColor: "red", borderWidth: 1 }}
            reset={this.resendOtp}
            // resendText={I18n.t('Resend_Verification_Code')}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
          <Text style={[style.titleStyle, { textAlign: 'center' }]} onPress={() => {
            Number(this.seconds) > 0 ? null :
              this.resendOtp()
          }}>
            {
              Number(this.seconds) > 0 ?
                this.state.timer
                :
                I18n.t('Resend_Verification_Code')}
          </Text>
          <View style={styles.input_View}>
          </View>

        </View>
        <View style={styles.otpSubmitView}>
          <Button onPress={this.submitOtp} Text={I18n.t('Submit')} />
        </View>
      </View>
    );
  };

  setN1(n) {
    this.setState({ n1: n });
    if (n.length == 1) {
      this.focusNextField("no2");
    } else if (n.length == 0) {
    }
  }
  setN2(n) {
    this.setState({ n2: n });
    if (n.length == 1) {
      this.focusNextField("no3");
    } else if (n.length == 0) {
      this.focusNextField("no1");
    }
  }
  setN3(n) {
    this.setState({ n3: n });
    if (n.length == 1) {
      this.focusNextField("no4");
    } else if (n.length == 0) {
      this.focusNextField("no2");
    }
  }
  setN4(n) {
    this.setState({ n4: n });
    if (n.length == 1) {
      this.focusNextField("no5");
    } else if (n.length == 0) {
      this.focusNextField("no3");
    }
  }
  setN5(n) {
    this.setState({ n5: n });
    if (n.length == 1) {
      this.focusNextField("no6");
    } else if (n.length == 0) {
      this.focusNextField("no4");
    }
  }
  setN6(n) {
    this.setState({ n6: n });
    if (n.length == 1) {
      this.focusNextField("done");
    } else if (n.length == 0) {
      this.focusNextField("no5");
    }
  }

  render() {

    return (
      <>
        <Loader
          loading={this.props.otpState.onLoad || this.props.loginState.onLoad}
        />
        <SafeAreaView style={style.mainContainer}>
          {this.otpInputs()}
        </SafeAreaView>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginState: state.LoginState,
    logOutState: state.LogOutState,
    otpState: state.OTPState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginAction, OTPAction, onBackPress }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OTPScreen);
