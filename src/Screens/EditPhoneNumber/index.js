import React, { Component } from "react";
import { Platform, Text, View } from "react-native";
import styles from "./styles";
import { Button, Header, Inputs, Loader, Validations, } from "./../../Components";
import PhoneText from '../../Components/Inputs/phoneInput'
import { AppImages } from "./../../Themes";
import I18n from "react-native-i18n";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  resetViewIndex,
  OTPAction,
  getUserProfileAction,
  saveEditDataAction
} from "../../Redux/actions/Authentication";
import { AFLogEvent } from "../../Config/aws";
import { getUSerDetail, getPopRef } from "../../Config";
import { fontFamily } from "../../Themes/AppFontFamily";

let _this
class EditPhoneNumber extends Component {
  static navigationOptions = ({ navigation }) => {
    // // let login=await _this?.isLogin()
    // console.log('loginlogin',_this);
    return {
      header: (
        null
        // <Header
        //   headerTitle={I18n.t('Change_Mobile_Number')}
        //   leftImageSource={AppImages.images.back}
        //   leftbackbtnPress={() => navigation.goBack()}
        // />
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      userDetail: null,
      isLoggedIn: false,
      phoneNumber: "",
      countryCode: "+1",
      email: "",
      fullName: "",

      keyValue: "editProfile",
      userTypeSelectedIndex: "",
      userTypeArray: [
        "Driver",
        "Owner Operator",
        "Company",
        "Air Cargo Carrier",
        "Exporter",
        "Freight Broker",
        "Importer",
        "Shipper",
        "Trucking",
        "Warehouse"
      ],
      driverTypeSelectedIndex: "",
      driverTypeArray: ["Owner Operator", "Company Driver"]
    };
    this.inputs = {};
    _this = this
  }
  componentDidMount() {
    this.isLogin()
    AFLogEvent("PhoneNumberUpdate", { screen: I18n.t('Change_Mobile_Number') })
    this.props.resetViewIndex();
    this.props.getUserProfileAction(this.props.navigation);
  }

  isLogin = async () => {
    let data = await getUSerDetail()
    console.log('data', data);
    if (data) {
      this.setState({ isLoggedIn: true })
      return true
    }
    else {
      this.setState({ isLoggedIn: false })
      // console.log('kkkkkkk', getPopRef());
      // getPopRef().modalOpen()
      return false
    }
  }


  componentDidUpdate(nextProps) {
    if (nextProps.getUserProfileState !== this.props.getUserProfileState) {
      if (
        this.props.getUserProfileState.result !== null &&
        this.props.getUserProfileState.error == null
      ) {
        let userDetail = this.props.getUserProfileState.result;
        this.setState({
          userDetail: userDetail ? userDetail : null,
          phoneNumber:
            this.props.route?.params?.number ? this.props.route?.params?.number : userDetail.phone_number == null ? "" : userDetail.phone_number,
          countryCode: userDetail.country_code == null ? "" : "+1"
        });
      }
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

  submitPhoneNo = () => {
    let { navigation } = this.props;
    if (
      this.state.phoneNumber == "" ||
      this.state.phoneNumber.trim().length === 0
    ) {
      alert(I18n.t("enter_phone_number_alert"));
    }
    else if (this.state.phoneNumber.length < 8) {
      alert(I18n.t("enter_phone_number_length_alert"));
    } else if (!Validations.validatePhoneNumber(this.state.phoneNumber)) {
      alert(I18n.t("enter_Numbers_allowed__phone_alert"));
    }

    else {
      this.props.OTPAction(
        this.state.phoneNumber,
        this.state.countryCode,
        navigation,
        this.state.keyValue
      );
      this.props.saveEditDataAction(
        this.state.countryCode,
        this.state.phoneNumber,
        navigation
      );
    }
  };

  ///method to render phone number screen view
  phoneNumberView = () => {
    return (
      <View style={styles.phoneNumberView}>
        <View style={styles.phoneNumberInputView}>
          <Text style={{ fontFamily: fontFamily.semiBold, alignSelf: 'center', fontSize: 18, textAlign: 'center' }}>{I18n.t('Enter_Your_Phone_Number')}</Text>
          <PhoneText
            countryText={
              "+1"
              // this.state.countryCode == "" ? "+91" : this.state.countryCode
            }
            maxLength={15}
            value={this.state.phoneNumber}
            source={null}
            onRef={input => this.updateRefs("phoneNo", input)}
            placeholder={I18n.t('Enter_Your_Phone_Number')}
            onChangeText={phoneNumber => this.setState({ phoneNumber })}
            autoCapitalize={"none"}
            keyboardType={"numeric"}
            returnKeyType={"done"}
          />
        </View>
        <View style={styles.phoneSubmitView}>
          <Button Text={I18n.t("Submit")} onPress={this.submitPhoneNo} />
          <Text style={{ fontFamily: fontFamily.light, alignSelf: 'center', fontSize: 12, textAlign: 'center', marginTop: 20 }}>{
            'You may receive sms notification from us for security.'
          }</Text>

        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <Loader loading={this.props.otpState.onLoad} />
        <View style={{ flex: Platform.OS == 'ios' ? 0.11 : 0.109 }}>
          <Header
            headerTitle={this.state.userDetail?.phone_number ? I18n.t('Change_Mobile_Number') : I18n.t('addmobile')}
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={() => this.props.navigation.goBack()}
          />
        </View>
        <View style={{ flex: Platform.OS == 'ios' ? 0.89 : 0.891 }}>
          {this.phoneNumberView()}
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    otpState: state.OTPState,
    getUserProfileState: state.GetUserProfileState
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      OTPAction,
      getUserProfileAction,
      resetViewIndex,
      saveEditDataAction
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditPhoneNumber);

