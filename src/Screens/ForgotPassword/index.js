import React, { Component } from "react";
import { SafeAreaView, View, Keyboard } from "react-native";
import styles from "./styles";
import {
  Inputs,
  Button,
  Header,
  CountriesData,
  Loader,
  Validations
} from "./../../Components";
import { AppStyles, AppConstants, AppImages } from "./../../Themes";
import Picker from "react-native-picker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { checkUserAction, OTPAction } from "../../Redux/actions/Authentication";
import I18n from 'react-native-i18n'

class ForgotPassword extends Component {
  static navigationOptions = ({ navigation }) => {
    navigation.state.key = "ForgotPassword";
    return {
      header: (
        <Header
          headerTitle={I18n.t('Forgot_Password')}
          leftImageSource={AppImages.images.back}
          leftbackbtnPress={() => navigation.goBack()}
        />
      )
    };
  };
  constructor(porps) {
    super(porps);
    this.state = {
      phoneNo: "",
      countryCode: ["+1"]
    };
    this.countryDialCodeArray = [];
    for (let i in CountriesData.codes) {
      this.countryDialCodeArray.push(CountriesData.codes[i].dial_code);
    }
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
    let { navigation } = this.props;
    if (this.state.phoneNo == "" || this.state.phoneNo.trim().length == 0) {
      alert(I18n.t('enter_phone_number_alert'));
    } else if (this.state.phoneNo.length < 8) {
      alert(I18n.t('enter_phone_number_length_alert'));
    } else if (!Validations.validatePhoneNumber(this.state.phoneNo)) {
      alert(I18n.t('enter_Numbers_allowed__phone_alert'));
    } else {
      this.props.OTPAction(
        this.state.phoneNo,
        this.state.countryCode,
        navigation
      );
    }
  };

  coutrySelection = () => {
    Picker.init({
      pickerData: this.countryDialCodeArray,
      pickerConfirmBtnText: I18n.t('Confirm'),
      pickerCancelBtnText: I18n.t('Cancel'),
      pickerTitleText: I18n.t('Please_Select'),
      pickerTextEllipsisLen: 100,
      onPickerConfirm: (data, index) => {
        this.setState({ countryCode: data });
      },
      onPickerCancel: data => {
        Picker.hide();
      },
      onPickerSelect: data => {}
    });
    Picker.show();
  };

  //Method for input view
  inputView = () => {
    let constants = AppConstants.constants;
    return (
      <View style={{ paddingTop: 15 }}>
        <Inputs
          Text={I18n.t('Phone_Number')}
          source={AppImages.images.phone}
          onRef={input => this.updateRefs("phoneNo", input)}
          placeholder={I18n.t('Enter_Phone_Number')}
          onChangeText={phoneNo => this.setState({ phoneNo })}
          autoCapitalize={false}
          keyboardType={"numeric"}
          returnKeyType={"done"}
          countryText={
            this.state.countryCode == "" ? "+1" : this.state.countryCode
          }
          countryTouchableOpacity={this.coutrySelection}
        />
      </View>
    );
  };

  submitButtonView = () => {
    let constants = AppConstants.constants;
    return (
      <View style={styles.bottomView}>
        <Button
          Text={I18n.t('Submit')}
          onPress={this.registerButton.bind(this)}
        />
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <Loader loading={this.props.OTPState.onLoad} />
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
    OTPState: state.OTPState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkUserAction, OTPAction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForgotPassword);
