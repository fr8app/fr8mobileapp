import React, { Component } from "react";
import { SafeAreaView, View, Keyboard } from "react-native";
import styles from "./styles";
import {
  Inputs,
  Button,
  PickerInput,
  Header,
  Loader,
  DataManager,
  Validations,
} from "./../../Components";
import { AppStyles, AppImages, AppColor } from "./../../Themes";
import { ScrollView } from "react-native-gesture-handler";
import Picker from "react-native-picker";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  getUserProfileAction,
  saveEditDataAction,
  updateUserProfileAction,
  isUserExistss,
  setLogin,
  loginActionWithUserName,
} from "./../../Redux/actions/Authentication";
import I18n from "react-native-i18n";
import { Platform } from "react-native";
import { AFLogEvent } from "../../Config/aws";
import { getUSerDetail } from "../../Config";

class EditProfile extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   console.log('dsdsdsads',navigation?.state?.params?.addProfile);
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={navigation?.state?.params?.addProfile?'Add Profile': I18n.t('Edit_Profile')}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => { navigation.goBack(), Picker.hide() }}
  //       />
  //     )
  //   };
  // };
  constructor(porps) {
    super(porps);
    this.state = {
      userDetail: null,
      verified: false,
      phoneNumber: "",
      userId: "",
      cpassword: "",
      password: "",
      isLoggedIn: false,
      disable: false,
      userName: "",
      fullName: "",
      firstName: "",
      lastName: "",
      email: "",
      userType: "",
      userTypeSelectedIndex: "",
      fileName: "",
      isDateTimePickerVisible: false,
      userTypeArray: [
        I18n.t("Driver"),
        I18n.t("Owner Operator"),
        I18n.t("Company"),
        I18n.t("Air Cargo Carrier"),
        I18n.t("Exporter"),
        I18n.t("Freight Broker"),
        I18n.t("Importer"),
        I18n.t("Shipper"),
        I18n.t("Trucking"),
        I18n.t("Warehouse"),
      ],
      driverType: "",
      phoneNo: "",
      countryCode: "",
      driverTypeSelectedIndex: "",
      driverTypeArray: [I18n.t("Owner Operator"), I18n.t("Company Driver")],
    };
    this.inputs = {};
  }
  isLogin = async () => {
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      this.setState({ isLoggedIn: true });
      return true;
    } else {
      this.setState({ isLoggedIn: false });
      return false;
    }
  };

  getDetail = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({
      userId: jsonData?.data?._id,
    });

    if (!jsonData) {
       DataManager.getDummyUserDetails().then((e)=>{
        if (e) {
          this.setState({
            userId: e.data?.userId,
            userName: e.data?.userName,
          });
        }
      })
      
    }
  };

  async componentDidMount() {
    this.getDetail();
    let isLogin = await this.isLogin();

    AFLogEvent("EditProfile", { screen: "EditProfile" });

    Keyboard.addListener("keyboardDidShow", () => {
      Picker.hide();
    });
    if (isLogin == true) {
      this.props.getUserProfileAction(this.props.navigation);
    }
    this.focusListener = this.props.navigation.addListener("blur", () => {
      Picker.hide();
      this.getDetail();
      if (isLogin == true) {
        this.props.getUserProfileAction(this.props.navigation);
      }
    });
    this.focusListener2 = this.props.navigation.addListener("focus", () => {
      this.getDetail();

      if (isLogin == true) {
        this.props.getUserProfileAction(this.props.navigation);
      }
    });
  }

  componentDidUpdate(nextProps) {
    if (nextProps.getUserProfileState !== this.props.getUserProfileState) {
      if (
        this.props.getUserProfileState.result !== null &&
        this.props.getUserProfileState.error == null
      ) {
        let userDetail = this.props.getUserProfileState.result;

        this.setState({
          userDetail: userDetail,
          verified: userDetail.phoneVerified ? userDetail.phoneVerified : false,
          userName: this.state.userName
            ? this.state.userName
            : userDetail.userName == null
            ? ""
            : userDetail.userName,
          email: this.state.email
            ? this.state.email
            : userDetail.email == null
            ? ""
            : userDetail.email,
          fullName: this.state.fullName
            ? this.state.fullName
            : userDetail.name == null
            ? ""
            : userDetail.name,
          firstName: this.state.firstName
            ? this.state.firstName
            : userDetail.name == null
            ? userDetail.name == null
              ? ""
              : userDetail.name
            : userDetail.name,
          lastName: userDetail.lastName == null ? "" : userDetail.lastName,
          userType:
            userDetail.user_type == null ? "" : I18n.t(userDetail.user_type),
          phoneNumber: this.state.phoneNumber
            ? this.state.phoneNumber
            : userDetail.phone_number
            ? userDetail.phone_number
            : "",
        });
        for (let i in this.state.userTypeArray) {
          if (userDetail?.user_type) {
            if (I18n.t(userDetail.user_type) == this.state.userTypeArray[i]) {
              this.setState({ userTypeSelectedIndex: Number(i) + Number(1) });
            }
          }
        }
        for (let i in this.state.driverTypeArray) {
          if (userDetail?.driver_type) {
            if (
              I18n.t(userDetail.driver_type) == this.state.driverTypeArray[i]
            ) {
              this.setState({
                driverTypeSelectedIndex: Number(i) + Number(1),
                driverType: I18n.t(userDetail.driver_type),
              });
            }
          }
        }
      }
    } else if (nextProps.updateProfileState !== this.props.updateProfileState) {
      if (
        this.props.updateProfileState.result !== null &&
        this.props.updateProfileState.error == null
      ) {
        this.props.route.params.onNavigationBack();
      }
    } else if (nextProps.userExist !== this.props.userExist) {
      if (nextProps.userExist.loggedIn !== this.props.userExist.loggedIn) {
        if (this.props.userExist.loggedIn == true) {
          this.props.setLogin(false);
          DataManager.getFavList().then((res) => {
            let listParse = JSON.parse(res);
            this.props.loginActionWithUserName(
              this.state.userName.trim(),
              this.state.password.trim(),
              this.props.navigation,
              listParse,
              this.state.userId,
              this.state.firstName.trim(),
              this.state.email.trim(),
              this.state.phoneNumber?.trim(),
              "addProfile"
            );
          });
        }
      }
    }
  }

  userTypeButton = () => {
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
      onPickerCancel: (data) => {
        Picker.hide();
      },
      onPickerSelect: (data) => {
        console.log(data);
      },
    });
    Picker.show();
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

  validateSpecialCharacter(passport) {
    var passportNumber = /[!"#$%&'()*+.\/:;<=>?@\[\\\]^_`{|}~-]/;
    return passportNumber.test(passport);
  }
  validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  validUserName(userName) {
    // var userReg=/^[a-zA-Z0-9._]+$/
    var userReg = /^(?![.])(?!.*[.]{2})[a-zA-Z0-9._]+(?![.])$/;
    return userReg.test(userName);
  }

  containonlyDigit(userName) {
    var regex = /(?!^\d+$)^.+$/;
    return regex.test(userName);
  }

  notDotTogeather(userName) {
    var regex = /\.{2,}/;
    return regex.test(userName);
  }

  updateButton = () => {
    Picker.hide();
    this.setState({ disable: true });
    setTimeout(() => {
      this.setState({ disable: false });
    }, 2000);
    if (this.state.userName == "" || this.state.userName.trim().length == 0) {
      alert(I18n.t("enter_user_name_alert"));
    } else if (this.state.userName.trim().charAt(0) == ".") {
      alert(I18n.t("user_name_start"));
    } else if (this.state.userName.trim().length < 3) {
      alert(I18n.t("enter_user_name_length_alert"));
    } else if (
      this.state.userName
        .trim()
        .charAt(this.state.userName.trim().length - 1) == "."
    ) {
      alert(I18n.t("user_name_end"));
    } else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t("twoDots"));
    } else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t("onlyNumberAlert"));
    } else if (!this.validUserName(this.state.userName.trim())) {
      alert(I18n.t("validUserName"));
    }

    // else if (this.state.firstName == "" || this.state.firstName.trim().length == 0) {
    //   alert(I18n.t('enter_full_name_alert'));
    // }
    // else if ( this.state.firstName.trim().length <3) {
    //   alert(I18n.t('enter_first_name_length_alert'));
    // }
    // else if(this.state.lastName == "" || this.state.lastName.trim().length == 0){
    //   alert(I18n.t('enter_last_name_alert'))
    // }
    // else if ( this.state.lastName.trim().length <3) {
    //   alert(I18n.t('enter_last_name_length_alert'));
    // }
    // else if (this.validateSpecialCharacter(this.state.firstName)) {
    //   alert(I18n.t('enter_full_name_aplhanumeric_alert'));
    // }
    // else if (this.validateSpecialCharacter(this.state.lastName)) {
    //   alert(I18n.t('enter_full_name_aplhanumeric_alert'));
    // }
    // else if (this.state.email.trim().length == 0) {
    //   alert(I18n.t('enter_email_alert'))
    // }
    else if (
      this.state.email.trim().length > 0 &&
      !this.validateEmail(this.state.email)
    ) {
      alert(I18n.t("enter_valid_email_alert"));
    } else if (
      this.state.phoneNumber?.trim().length < 8 &&
      this.state.phoneNumber?.trim().length > 0
    ) {
      alert(I18n.t("enter_phone_number_length_alert"));
    } else if (
      !Validations.validatePhoneNumber(this.state?.phoneNumber) &&
      this.state?.phoneNumber?.trim()?.length > 0
    ) {
      alert(I18n.t("enter_Numbers_allowed__phone_alert"));
    }
    // else if (this.state.userType == "" || this.state.userType.length == 0) {
    //   alert(I18n.t('enter_user_type_alert'));
    // } else if (
    //   this.state.userTypeSelectedIndex == 1 &&
    //   this.state.driverType == ""
    // ) {
    //   alert(I18n.t('enter_driver_type_alert'));
    // }
    else {
      let user_type = this.state.userTypeSelectedIndex;
      let driver_type = this.state.driverTypeSelectedIndex;
      let userType =
        user_type === 1
          ? "Driver"
          : user_type === 2
          ? "Owner Operator"
          : user_type === 3
          ? "Company"
          : user_type === 4
          ? "Air Cargo Carrier"
          : user_type === 5
          ? "Exporter"
          : user_type === 6
          ? "Freight Broker"
          : user_type === 7
          ? "Importer"
          : user_type === 8
          ? "Shipper"
          : user_type === 9
          ? "Trucking"
          : "Warehouse";
      let driverType = driver_type === 1 ? "Owner Operator" : "Company Driver";

      this.props.updateUserProfileAction(
        this.state.userName.trim(),
        this.state.firstName,
        this.state.lastName,
        this.state.email,
        userType,
        driverType,
        this.state.phoneNumber,
        this.props.navigation
      );
      if (this.props.route.params) {
      }
    }
  };

  driverTypeButton = () => {
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
          driverTypeSelectedIndex: selectIndex,
        });
      },
      onPickerCancel: (data) => {
        console.log(data);
        Picker.hide();
      },
      onPickerSelect: (data) => {
        console.log(data);
      },
    });
    Picker.show();
  };

  registerPress = () => {
    if (this.state.userName == "" || this.state.userName.trim().length == 0) {
      alert(I18n.t("enter_user_name_alert"));
    } else if (this.state.userName.trim().charAt(0) == ".") {
      alert(I18n.t("user_name_start"));
    } else if (this.state.userName.trim().length < 3) {
      alert(I18n.t("enter_user_name_length_alert"));
    } else if (
      this.state.userName
        .trim()
        .charAt(this.state.userName.trim().length - 1) == "."
    ) {
      alert(I18n.t("user_name_end"));
    } else if (this.notDotTogeather(this.state.userName)) {
      alert(I18n.t("twoDots"));
    } else if (!this.containonlyDigit(this.state.userName)) {
      alert(I18n.t("onlyNumberAlert"));
    } else if (!this.validUserName(this.state.userName.trim())) {
      alert(I18n.t("validUserName"));
    } else if (
      this.state?.email?.trim().length > 0 &&
      !this.validateEmail(this.state.email)
    ) {
      alert(I18n.t("enter_valid_email_alert"));
    } else if (
      this.state.phoneNumber?.trim().length < 8 &&
      this.state.phoneNumber?.trim().length > 0
    ) {
      alert(I18n.t("enter_phone_number_length_alert"));
    } else if (
      !Validations.validatePhoneNumber(this.state.phoneNumber) &&
      this.state.phoneNumber?.trim()?.length > 0
    ) {
      alert(I18n.t("enter_Numbers_allowed__phone_alert"));
    } else if (this.state.password.trim().length == 0) {
      alert(I18n.t("enter_password_alert"));
    } else if (this.state.password.trim().length < 6) {
      alert(I18n.t("enter_password_length_alert"));
    } else if (this.state.cpassword.trim().length == 0) {
      alert(I18n.t("enter_confirm_password_alert"));
    } else if (this.state.cpassword != this.state.password) {
      alert(I18n.t("enter_password_not_match_alert"));
    } else {
      // this.props.loginActionWithUserName(this.state.userName.trim(), this.state.password.trim(), this.props.navigation,this.state.firstName.trim(),this.state.email.trim())
      // console.log('this.props',NavigationService.getFullRoute()?._navigation);
      this.props.isUserExistss(
        this.state.userName,
        "addProfile",
        "",
        this.props.navigation
      );
    }
  };
  //Method for input view
  inputView = () => {
    return (
      <View style={{ paddingTop: 15 }}>
        <Inputs
          spaceRemove={true}
          keyboardType={
            Platform.OS === "ios" ? "ascii-capable" : "visible-password"
          }
          value={this.state.userName.toLowerCase()}
          source={AppImages.images.userNew}
          onRef={(input) => this.updateRefs("uName", input)}
          placeholder={I18n.t("Enter_Username")}
          onSubmitEditing={() => this.focusNextField("fName")}
          onChangeText={(userName) => {
            var temp = userName;
            this.setState({ userName: temp });
          }}
          // keyboardType={"ascii-capable"}
          returnKeyType={"next"}
          maxLength={20}
          autoCapitalize={"none"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        <Inputs
          source={AppImages.images.userNew}
          onRef={(input) => this.updateRefs("fName", input)}
          placeholder={I18n.t("Enter_Name")}
          onSubmitEditing={() => this.focusNextField("email")}
          onChangeText={(firstName) => this.setState({ firstName })}
          keyboardType={"ascii-capable"}
          returnKeyType={"next"}
          maxLength={20}
          autoCapitalize={"sentences"}
          value={this.state.firstName}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        {/* <Inputs
          source={AppImages.images.userNew}
          onRef={input => this.updateRefs("lName", input)}
          placeholder={I18n.t('Enter_last_Name')}
          onSubmitEditing={() => this.focusNextField("email")}
          onChangeText={lastName => this.setState({ lastName })}
          keyboardType={"ascii-capable"}
          returnKeyType={"next"}
          maxLength={20}
          autoCapitalize={"sentences"}
          value={this.state.lastName}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage
          }}
        /> */}

        <Inputs
          secureTextEntry={false}
          source={AppImages.images.userMail}
          onRef={(input) => this.updateRefs("email", input)}
          placeholder={I18n.t("Enter_Email_Address")}
          onChangeText={(email) => this.setState({ email })}
          autoCapitalize={"none"}
          keyboardType={"email-address"}
          value={this.state.email}
          returnKeyType={"done"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        <Inputs
          isVerified={this.state.verified}
          phoneVerifyPress={() => {
            if (this.state.verified) {
            } else {
              this.props.navigation.navigate("EditPhoneNumber", {
                number: this.state.phoneNumber,
              });
            }
          }}
          verify={
            !Validations.validatePhoneNumber(this.state.phoneNumber) ||
            this.state.phoneNumber?.length < 8
              ? null
              : this.state.verified
              ? "Verified"
              : "Verify"
          }
          countryText={
            "+1"
            // this.state.countryCode == "" ? "+91" : this.state.countryCode
          }
          maxLength={15}
          value={this.state.phoneNumber}
          source={AppImages.images.phone}
          onRef={(input) => this.updateRefs("phoneNo", input)}
          placeholder={I18n.t("Enter_Your_Phone_Number")}
          onChangeText={(phoneNumber) => {
            if (this.state.userDetail?.phone_number != phoneNumber) {
              this.setState({ verified: false });
            } else {
              this.setState({ verified: this.state.userDetail?.phoneVerified });
            }
            this.setState({ phoneNumber });
          }}
          autoCapitalize={"none"}
          keyboardType={"numeric"}
          returnKeyType={"done"}
        />
        {/* <PickerInput
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
        ) : null} */}
      </View>
    );
  };
  inputViewForAddUser = () => {
    return (
      <View style={{ paddingTop: 15 }}>
        <Inputs
          spaceRemove={true}
          keyboardType={
            Platform.OS === "ios" ? "ascii-capable" : "visible-password"
          }
          value={this.state.userName.toLowerCase()}
          source={AppImages.images.userNew}
          onRef={(input) => this.updateRefs("uName", input)}
          placeholder={I18n.t("Enter_Username")}
          onSubmitEditing={() => this.focusNextField("fName")}
          onChangeText={(userName) => {
            var temp = userName;
            this.setState({ userName: temp });
          }}
          // keyboardType={"ascii-capable"}
          returnKeyType={"next"}
          maxLength={20}
          autoCapitalize={"none"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        <Inputs
          source={AppImages.images.userNew}
          onRef={(input) => this.updateRefs("fName", input)}
          placeholder={I18n.t("Enter_Name")}
          onSubmitEditing={() => this.focusNextField("email")}
          onChangeText={(firstName) => this.setState({ firstName })}
          keyboardType={"ascii-capable"}
          returnKeyType={"next"}
          maxLength={20}
          autoCapitalize={"sentences"}
          value={this.state.firstName}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />

        <Inputs
          source={AppImages.images.userMail}
          onRef={(input) => this.updateRefs("email", input)}
          placeholder={I18n.t("Enter_Email_Address")}
          onSubmitEditing={() => this.focusNextField("phoneNo")}
          onChangeText={(email) => this.setState({ email })}
          autoCapitalize={"none"}
          keyboardType={"email-address"}
          value={this.state.email}
          returnKeyType={"next"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        <Inputs
          countryText={
            "+1"
            // this.state.countryCode == "" ? "+91" : this.state.countryCode
          }
          maxLength={15}
          value={this.state.phoneNumber}
          source={AppImages.images.phone}
          onRef={(input) => this.updateRefs("phoneNo", input)}
          placeholder={I18n.t("Enter_Your_Phone_Number")}
          onChangeText={(phoneNumber) => this.setState({ phoneNumber })}
          autoCapitalize={"none"}
          keyboardType={"numeric"}
          returnKeyType={"done"}
        />
        <Inputs
          source={AppImages.images.key}
          onSubmitEditing={() => this.focusNextField("confirmPassword")}
          secureTextEntry
          onRef={(input) => this.updateRefs("password", input)}
          placeholder={I18n.t("Enter_Password")}
          onChangeText={(password) => this.setState({ password })}
          // autoCapitalize={"none"}
          // keyboardType={"email-address"}
          value={this.state.password}
          returnKeyType={"next"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
        <Inputs
          source={AppImages.images.key}
          onRef={(input) => this.updateRefs("confirmPassword", input)}
          placeholder={I18n.t("Enter_Confirm_Password")}
          onChangeText={(cpassword) => this.setState({ cpassword })}
          // autoCapitalize={"none"}
          secureTextEntry
          // keyboardType={"email-address"}
          value={this.state.cpassword}
          returnKeyType={"done"}
          customStyles={{
            mainView: styles.customMainView,
            containerInputImage: styles.customContainerInputImage,
          }}
        />
      </View>
    );
  };

  updateView = () => {
    return (
      <View style={styles.marginTop40}>
        <Button
          disabled={this.state.disable}
          Text={this.state.isLoggedIn ? I18n.t("Update") : I18n.t("Add")}
          onPress={
            this.state.isLoggedIn
              ? this.updateButton.bind(this)
              : this.registerPress.bind()
          }
        />
      </View>
    );
  };
  render() {
    const { navigation, route } = this.props;
    return (
      <View style={styles.mainContainer}>
        {Platform.OS == "android" ? (
          <Header
            headerTitle={
              route?.params?.addProfile ? "Add Profile" : I18n.t("Edit_Profile")
            }
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={() => {
              navigation.goBack(), Picker.hide();
            }}
          />
        ) : (
          <View style={{ flex: 0.13 }}>
            <Header
              headerTitle={
                route?.params?.addProfile
                  ? "Add Profile"
                  : I18n.t("Edit_Profile")
              }
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => {
                navigation.goBack(), Picker.hide();
              }}
            />
          </View>
        )}
        <Loader
          loading={
            this.props.getUserProfileState.onLoad ||
            this.props.updateProfileState.onLoad
          }
        />
        <ScrollView
          style={AppStyles.container}
          bounces={false}
          contentContainerStyle={styles.scrollView}
        >
          {this.state.isLoggedIn
            ? this.inputView()
            : this.inputViewForAddUser()}
          {this.updateView()}
        </ScrollView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    getUserProfileState: state.GetUserProfileState,
    updateProfileState: state.UpdateProfileState,
    userExist: state.userExist,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loginActionWithUserName,
      getUserProfileAction,
      setLogin,
      updateUserProfileAction,
      isUserExistss,
      saveEditDataAction,
    },
    dispatch
  );
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
