import style from "./styles";
import React, { Component } from "react";
import {
  View,
  TextInput,
  Keyboard,
  SafeAreaView,
  Text,
} from "react-native";
import { Button, Header, Loader } from "./../../Components";
import styles from "./styles";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  OTPAction,
  updatePhoneNumber,
  otpVerify,
  updateUserProfileAction
} from "./../../Redux/actions/Authentication";
import I18n from 'react-native-i18n'
import { Platform } from "react-native";
import SmsRetriever from 'react-native-sms-retriever';
import { fontFamily } from "../../Themes/AppFontFamily";

class EditProfileOtp extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={"CONFIRMATION CODE"}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => navigation.goBack()}
  //       />
  //     )
  //   };
  // };
  constructor() {
    super();
    this.state = {
      code: "",
      n1: "",
      n2: "",
      n3: "",
      n4: "",
      n5: "",
      n6: ""
    };
    this.inputs = {};
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
  resetInput() {
    this.setState({
      n1: "",
      n2: "",
      n3: "",
      n4: "",
      n5: "",
      n6: ""
    });
  }
  componentDidMount() {
    this._onSmsListenerPressed()

    setTimeout(() => {
    }, 500);
  }
  componentDidUpdate(nextProps) {
    if (nextProps !== this.props) {
      if (nextProps.otpState !== this.props.otpState) {
        if (this.props.otpState.otpVerify == true) {
          let getData = this.props.updateProfileState;

          this.props.otpState.otpVerify = false
          this.props.updatePhoneNumber(
            getData.profileData.phoneNo,
            this.props.navigation,
            this.state.keyValue
          );
        }
      }
    }
  }



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

  _onReceiveSms = (event) => {
    console.log('event', event);
    if (event.message) {
      const otp = /(\d{6})/g.exec(event.message)[1];
      console.log('otp', otp);
      this.setState({ code: otp })
      SmsRetriever.removeSmsListener();
      // Clipboard.setString(otp.toString())
    }
  };


  submitOtp = () => {
    let getData = this.props.updateProfileState;
    if (Platform.OS == 'android') {
      if (this.state.code == "" || this.state.code.trim().length == 0) {
        alert(I18n.t('enter_otp_alert'));
      } else {
        this.props.otpVerify(
          getData.profileData.phoneNo,
          '+1',
          this.state.code,
          this.props.navigation,
          null,
          I18n.currentLocale()
        )
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
        this.setState({ code: '' })
      } else {
        this.props.otpVerify(
          getData.profileData.phoneNo,
          '+1',
          this.state.code,
          this.props.navigation,
          null,
          I18n.currentLocale()
        )
        // this.props.updatePhoneNumber(
        //   getData.profileData.phoneNo,
        //   this.props.navigation,
        //   this.state.keyValue
        // );
      }
    }
  };

  otpInputs = () => {
    return (
      <View>
        <View style={styles.inputCompleteView}>

          <View style={styles.input_View}>
            <TextInput
              maxLength={6}
              keyboardType={"numeric"}
              style={[styles.input_style, { backgroundColor: 'rgba(249,249,249,1)' }]}
              onChangeText={n1 => this.setState({ code: n1 })}
              value={this.state.code}
              textContentType={"oneTimeCode"}>

            </TextInput>
          </View>

        </View>
        <View style={styles.otpSubmitView}>
          <Button onPress={this.submitOtp} Text={I18n.t("Submit")} />
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

  //On Submit
  onSubmit = () => {
    Keyboard.dismiss();
    var OTP_Text =
      this.state.n1 + this.state.n2 + this.state.n3 + this.state.n4;
    var cnfrm_OTP_Text =
      this.state.cn1 + this.state.cn2 + this.state.cn3 + this.state.cn4;
    if (
      this.state.n1 != null &&
      this.state.n2 != null &&
      this.state.n3 != null &&
      this.state.n4 != null
    ) {
      if (
        this.state.cn1 == null &&
        this.state.cn2 == null &&
        this.state.cn3 == null &&
        this.state.cn4 == null
      ) {
        alert("Confirm the OTP");
      } else if (OTP_Text != cnfrm_OTP_Text) {
        alert("Enter does not match");
      } else {
        this.props.navigation.goBack();
      }
    } else {
      alert("Enter Valid OTP");
    }
  };

  removeProtection = () => {
    this.props.navigation.goBack();
  };

  render() {
    return (
      <>
        <Loader loading={this.props.UpdatePhoneNo.onLoad || this.props.otpState.onLoad} />
        <View style={{ flex: Platform.OS == 'ios' ? 0.11 : 0.11 }}>
          <Header
            headerTitle={"CONFIRMATION CODE"}
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={{ flex: Platform.OS == 'ios' ? 0.89 : 0.89 }}>
          <View style={style.mainContainer}>

            <Text style={{ fontFamily: fontFamily.semiBold, alignSelf: 'center', fontSize: 18, textAlign: 'center' }}>{"ENTER CONFIRMATION CODE"}</Text>
            <Text style={{ fontFamily: fontFamily.regular, alignSelf: 'center', fontSize: 12, textAlign: 'center', marginTop: 10 }}>{"Enter 6 digit confirmation code we sent to +1" + this.props.updateProfileState.profileData.phoneNo}</Text>

            {this.otpInputs()}
          </View>
        </View>
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    otpState: state.OTPState,
    getUserProfileState: state.GetUserProfileState,
    updateProfileState: state.UpdateProfileState,
    UpdatePhoneNo: state.UpdatePhoneNumber
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      OTPAction,
      otpVerify,
      updateUserProfileAction,
      updatePhoneNumber
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfileOtp);

