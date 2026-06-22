import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Keyboard,
  TouchableOpacity
} from "react-native";
import styles from "./styles";
import { Inputs, Button, Header, Loader } from "./../../Components";
import { AppStyles, AppConstants, AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  registerAction,
  checkUserAction
} from "../../Redux/actions/Authentication";
import I18n from 'react-native-i18n'
class OTP extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={I18n.t('OTP')}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => navigation.goBack()}
        />
      )
    };
  };
  constructor(porps) {
    super(porps);
    this.state = {
      otp: ""
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

  registerButton = () => {
    Keyboard.dismiss();
    // console.log('helloß')
    let { navigation, checkUserState } = this.props;
    if (this.state.otp == "" || this.state.otp.trim().length == 0) {
      alert(I18n.t('enter_otp_alert'));
    } else if (
      Number(checkUserState.result.data.OTP) !== Number(this.state.otp.trim())
    ) {
      alert(I18n.t('enter__valid_otp_alert'));
    } else {
      this.props.registerAction(
        checkUserState.userData.image,
        checkUserState.userData.name,
        checkUserState.userData.userName,
        checkUserState.userData.email,
        checkUserState.userData.userType,
        checkUserState.userData.driveType,
        checkUserState.userData.countryCode,
        checkUserState.userData.phoneNo,
        checkUserState.userData.dob,
        checkUserState.userData.password,
        navigation
      );
    }
  };

  resendOTPButton = () => {
    let { navigation, checkUserState } = this.props;
    this.props.checkUserAction(
      checkUserState.userData.image,
      checkUserState.userData.name,
      checkUserState.userData.userName,
      checkUserState.userData.email,
      checkUserState.userData.userType,
      checkUserState.userData.driveType,
      checkUserState.userData.countryCode,
      checkUserState.userData.phoneNo,
      checkUserState.userData.dob,
      checkUserState.userData.password,
      navigation
    );
  };

  //Method for input view
  inputView = () => {
    let constants = AppConstants.constants;
    return (
      <View style={{ paddingTop: 25 }}>
        <Loader loading={this.props.registerState.onLoad} />
        <Inputs
          Text={I18n.t('OTP')}
          source={AppImages.images.otp}
          onRef={input => this.updateRefs("otp", input)}
          placeholder={I18n.t('Enter_OTP')}
          onChangeText={otp => this.setState({ otp })}
          secureTextEntry={true}
          maxLength={5}
          autoCapitalize={false}
          keyboardType={"numeric"}
          returnKeyType={"done"}
        />

        <TouchableOpacity
          style={styles.resendButton}
          onPress={this.resendOTPButton}
        >
          <Text style={styles.resendText}>Resend OTP</Text>
        </TouchableOpacity>
      </View>
    );
  };

  submitButtonView = () => {
    let constants = AppConstants.constants;
    return (
      <View style={styles.bottomView}>
        <Button
          Text={'hello'}
          onPress={this.registerButton.bind(this)}
        />
      </View>
    );
  };

  render() {
    let constants = AppConstants.constants;
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={[AppStyles.container, { marginTop: 30 }]}>
          {this.inputView()}
          {this.submitButtonView()}
        </View>
      </SafeAreaView>
    );
  }
}
function mapStateToProps(state) {
  return {
    registerState: state.RegisterState,
    checkUserState: state.CheckUserState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ registerAction, checkUserAction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OTP);
