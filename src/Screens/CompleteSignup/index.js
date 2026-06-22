import React, { Component } from "react";
import { SafeAreaView, View, Keyboard } from "react-native";
import styles from "./styles";
import { Button, Inputs, PickerInput, Loader } from "./../../Components";
import { AppColor, AppConstants, AppImages } from "./../../Themes";
import I18n from "react-native-i18n";
import Picker from "react-native-picker";
import {
  registerAction,
  loginAction
} from "../../Redux/actions/Authentication";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ScrollView } from "react-native";
import { Platform } from "react-native";

class CompleteSignUp extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      userName: '',
      keydata: "register",
      fullName: "",
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      userTypeSelectedIndex: "",
      userTypeArray: [
        I18n.t('Driver'),
        I18n.t("Owner Operator"),
        I18n.t("Company"),
        I18n.t("Air Cargo Carrier"),
        I18n.t("Exporter"),
        I18n.t("Freight Broker"),
        I18n.t("Importer"),
        I18n.t("Shipper"),
        I18n.t("Trucking"),
        I18n.t("Warehouse")
      ],
      driverType: "",
      driverTypeSelectedIndex: "",
      driverTypeArray: [I18n.t("Owner Operator"), I18n.t("Company Driver")]
    };
    this.inputs = {};
  }
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('blur', () => {
      Picker.hide()
    })
    Keyboard.addListener('keyboardDidShow', () => {
      Picker.hide()
    })
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

  userTypeButton = () => {
    Keyboard.dismiss()
    Picker.init({
      pickerData: this.state.userTypeArray,
      pickerConfirmBtnText: I18n.t("Confirm"),
      pickerCancelBtnText: I18n.t("Cancel"),
      pickerTitleText: I18n.t("Please_Select"),
      pickerTextEllipsisLen: 100,
      onPickerConfirm: (data, index) => {
        let selectIndex = Number(index) + Number(1);
        this.setState({ userType: data, userTypeSelectedIndex: selectIndex });
      },
      onPickerCancel: data => {
        Picker.hide();
      },
      onPickerSelect: data => {
      }
    });
    Picker.show();
  };

  driverTypeButton = () => {
    Keyboard.dismiss()

    Picker.init({
      pickerData: this.state.driverTypeArray,
      pickerConfirmBtnText: I18n.t("Confirm"),
      pickerCancelBtnText: I18n.t("Cancel"),
      pickerTitleText: I18n.t("Please_Select"),
      pickerTextEllipsisLen: 100,
      onPickerConfirm: (data, index) => {
        let selectIndex = Number(index) + Number(1);
        this.setState({
          driverType: data,
          driverTypeSelectedIndex: selectIndex
        });
      },
      onPickerCancel: data => {
        Picker.hide();
      },
      onPickerSelect: data => {
      }
    });
    Picker.show();
  };
  validateSpecialCharacter(passport) {
    var passportNumber = /[!"#$%&'()*+.\/:;<=>?@\[\\\]^_`{|}~-]/;
    return passportNumber.test(passport);
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }


  validUserName(userName) {
    var userReg = /^(?![.])(?!.*[.]{2})[a-zA-Z0-9._]+(?![.])$/
    return userReg.test(userName)
  }

  containonlyDigit(userName) {
    var regex = /(?!^\d+$)^.+$/
    return regex.test(userName)
  }


  notDotTogeather(userName) {
    var regex = /\.{2,}/
    return regex.test(userName)
  }

  submit = () => {
    this.setState({ disable: true })
    setTimeout(() => {
      this.setState({ disable: false })
    }, 2000);
    Picker.hide()
    if (this.state.userName == "" || this.state.userName.trim().length == 0) {
      alert(I18n.t('enter_user_name_alert'));
    }
    else if (this.state.userName.trim().charAt(0) == '.') {
      alert(I18n.t('user_name_start'))
    }
    else if (this.state.userName.trim().length < 3) {
      alert(I18n.t('enter_user_name_length_alert'))
    }
    else if (this.state.userName.trim().charAt(this.state.userName.trim().length - 1) == '.') {
      alert(I18n.t('user_name_end'))
    }
    else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t('twoDots'))
    }

    else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t('onlyNumberAlert'))
    }
    else if (!this.validUserName(this.state.userName.trim())) {
      alert(I18n.t('validUserName'));
    }

    else if (this.state.firstName == "" || this.state.firstName.trim().length == 0) {
      alert(I18n.t('enter_full_name_alert'));
    }
    else if (this.state.firstName.trim().length < 3) {
      alert(I18n.t('enter_first_name_length_alert'));
    }
    else if (this.state.lastName == "" || this.state.lastName.trim().length == 0) {
      alert(I18n.t('enter_last_name_alert'))
    }
    else if (this.state.lastName.trim().length < 3) {
      alert(I18n.t('enter_last_name_length_alert'));
    }
    else if (this.validateSpecialCharacter(this.state.firstName)) {
      alert(I18n.t('enter_full_name_aplhanumeric_alert'));
    }
    else if (this.validateSpecialCharacter(this.state.lastName)) {
      alert(I18n.t('enter_full_name_aplhanumeric_alert'));
    }
    else if (this.state.email.trim().length == 0) {
      alert(I18n.t('enter_email_alert'))
    }
    else if (!this.validateEmail(this.state.email)) {
      alert(I18n.t('enter_valid_email_alert'))
    }
    else if (this.state.userType == "" || this.state.userType.length == 0) {
      alert(I18n.t('enter_user_type_alert'));
    } else if (
      this.state.userTypeSelectedIndex == 1 &&
      this.state.driverType == ""
    ) {
      alert(I18n.t('enter_driver_type_alert'));
    }

    else {

      let user_type = this.state.userTypeSelectedIndex
      let driver_type = this.state.driverTypeSelectedIndex
      let userType = user_type === 1 ? "Driver"
        : user_type === 2 ? "Owner Operator" :
          user_type === 3 ? "Company" :
            user_type === 4 ? "Air Cargo Carrier" :
              user_type === 5 ? "Exporter" :
                user_type === 6 ? "Freight Broker" :
                  user_type === 7 ? "Importer" :
                    user_type === 8 ? "Shipper" :
                      user_type === 9 ? "Trucking" : "Warehouse"
      let driverType = driver_type === 1 ? "Owner Operator" : "Company Driver"
      this.props.registerAction(
        this.state.userName.trim(),
        this.state.firstName.trim(),
        this.state.lastName.trim(),
        this.state.email,
        userType,
        driverType,
        this.props.otpState.countryCode,
        this.props.otpState.phoneNumber,
      );
    }
  };

  //Method for input view
  inputView = () => {
    let constants = AppConstants.constants;
    return (
      <ScrollView
        keyboardShouldPersistTaps='always'
        showsVerticalScrollIndicator={false} bounces={false} style={{ flex: 1, paddingBottom: Platform.OS == 'android' ? '0%' : '30%' }} contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
        <View style={styles.inputView}>
          <Inputs
            spaceRemove={true}
            value={this.state.userName}
            source={AppImages.images.userNew}
            onRef={input => this.updateRefs("uName", input)}
            placeholder={I18n.t('Enter_Username')}
            onSubmitEditing={() => this.focusNextField("fName")}
            onChangeText={userName => {
              var temp = userName.toLowerCase()
              this.setState({ userName: temp })
            }}
            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
            returnKeyType={"next"}
            maxLength={20}
            autoCapitalize={"none"}
            customStyles={{
              mainView: styles.customMainView,
              containerInputImage: styles.customContainerInputImage
            }}
          />
          <Inputs
            source={AppImages.images.userNew}
            onRef={input => this.updateRefs("fName", input)}
            placeholder={I18n.t('Enter_first_Name')}
            onSubmitEditing={() => this.focusNextField("lName")}
            onChangeText={fullName => this.setState({ firstName: fullName })}
            keyboardType={"ascii-capable"}
            returnKeyType={"next"}
            maxLength={20}
            autoCapitalize={"sentences"}
            customStyles={{
              mainView: styles.customMainView,
              containerInputImage: styles.customContainerInputImage
            }}
          />
          <Inputs
            source={AppImages.images.userNew}
            onRef={input => this.updateRefs("lName", input)}
            placeholder={I18n.t('Enter_last_Name')}
            onSubmitEditing={() => this.focusNextField("email")}
            onChangeText={fullName => this.setState({ lastName: fullName })}
            keyboardType={"ascii-capable"}
            returnKeyType={"next"}
            maxLength={20}
            autoCapitalize={"sentences"}
            customStyles={{
              mainView: styles.customMainView,
              containerInputImage: styles.customContainerInputImage
            }}
          />
          <Inputs
            source={AppImages.images.userMail}
            onRef={input => this.updateRefs("email", input)}
            placeholder={I18n.t("Enter_Email_Address")}
            onChangeText={email => this.setState({ email })}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            returnKeyType={"done"}
            customStyles={{
              mainView: styles.customMainView,
              containerInputImage: styles.customContainerInputImage
            }}
          />
          <PickerInput
            source={AppImages.images.userNew}
            placeHolderText={
              this.state.userType == ""
                ? I18n.t("Select_User_Type")
                : this.state.userType
            }
            color={
              this.state.userType == ""
                ? AppColor.colors.placeHolder
                : AppColor.colors.inputColor
            }
            sourceRight={AppImages.images.dropdownArrow}
            onPress={this.userTypeButton}
            customStyles={{
              mainView: styles.customMainView,
              containerInputImage: styles.customContainerInputImage
            }}
          />
          {this.state.userTypeSelectedIndex == 1 ? (
            <PickerInput
              source={AppImages.images.userGrey}
              placeHolderText={
                this.state.driverType == ""
                  ? I18n.t("Select_Driver_Type")
                  : this.state.driverType
              }
              sourceRight={AppImages.images.dropdownArrow}
              color={
                this.state.driverType == ""
                  ? AppColor.colors.placeHolder
                  : AppColor.colors.inputColor
              }
              onPress={this.driverTypeButton}
            />
          ) : null}
          <View style={styles.signUpSubmitView}>
            <Button
              disabled={this.state.disable}
              Text={I18n.t("Submit")} onPress={this.submit} />
          </View>
        </View>
      </ScrollView>
    );
  };

  render() {
    return (
      <>
        <Loader loading={this.props.registerState.onLoad} />
        <SafeAreaView style={styles.mainContainer}>
          {this.inputView()}
        </SafeAreaView>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    loginState: state.LoginState,
    registerState: state.RegisterState,
    otpState: state.OTPState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ registerAction, loginAction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompleteSignUp);
