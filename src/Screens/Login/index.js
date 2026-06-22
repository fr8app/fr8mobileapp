import React, { Component } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  StatusBar,
} from "react-native";
import styles from "./styles";
import {
  Inputs,
  Button,
  Loader,
  Validations,
} from "./../../Components";
import {
  AppStyles,
  AppImages,
  AppColor,
  Dimensions,
} from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { loginAction } from "../../Redux/actions/Authentication";
import Permissions from "react-native-permissions";
import SplashScreen from "react-native-splash-screen";
import I18n from "react-native-i18n";
import geolocation from "@react-native-community/geolocation";
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: null,
      password: null,
    };
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    Permissions.request("location").then((response) => { });
    this.inputs = {};
    this.getLatLong();
  }

  getLatLong() {
    geolocation.getCurrentPosition(
      (position) => {
        let region = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.00922 * 1.5,
          longitudeDelta: 0.00421 * 1.5,
        };
      },
      (error) => console.log(error)
    );
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

  signUp = () => {
    this.props.navigation.navigate("SignUp");
  };

  forgotButton = () => {
    this.props.navigation.navigate("ForgotPassword");
  };

  loginButton = () => {
    Keyboard.dismiss();
    let { navigation } = this.props;
    if (this.state.email == null || this.state.email.trim().length === 0) {
      alert(I18n.t("enter_email_alert"));
    } else if (!Validations.validateEmail(this.state.email.trim())) {
      alert(I18n.t("enter_valid_email_alert"));
    } else if (
      this.state.password == null ||
      this.state.password.trim().length === 0
    ) {
      alert(I18n.t("enter_password_alert"));
    } else {
      this.props.loginAction(this.state.email, this.state.password, navigation);
    }
  };

  signUpView = () => {
    return (
      <View>
        <TouchableOpacity
          style={[AppStyles.bottomView, { bottom: 30, alignSelf: "center" }]}
          onPress={this.signUp}
        >
          <Text style={styles.accountText}>
            {I18n.t(constants.Doesnt_have_an_account)}{" "}
            <Text
              style={[styles.accountText, { color: AppColor.colors.white }]}
            >
              {constants.Sign_up}
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <ImageBackground
        style={{ flex: 1 }}
        resizeMode="stretch"
        source={AppImages.images.loginBackground}
      >
        {Platform.OS == "ios" ? (
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor={AppColor.colors.lightBlue}
          />
        ) : (
          <StatusBar
            translucent
            barStyle="dark-content"
            backgroundColor={AppColor.colors.lightBlue}
          />
        )}
        <Loader whiteColor loading={this.props.loginState.onLoad} />
        <Image
          style={styles.logoImage}
          resizeMode="contain"
          source={AppImages.images.loginLogo}
        />
        <View style={[AppStyles.container, { justifyContent: "center" }]}>
          <Inputs
            Text={I18n.t("Email")}
            source={AppImages.images.atTheRate}
            textColor={AppColor.colors.white}
            onRef={(input) => this.updateRefs("email", input)}
            placeholder={I18n.t("Enter_Email")}
            onSubmitEditing={() => this.focusNextField("password")}
            onChangeText={(email) => this.setState({ email })}
            autoCapitalize={"none"}
            keyboardType={"email-address"}
            returnKeyType={"next"}
            changeBorder
          />
          <Inputs
            Text={I18n.t("Password")}
            source={AppImages.images.key}
            onRef={(input) => this.updateRefs("password", input)}
            textColor={AppColor.colors.white}
            placeholder={I18n.t("Enter_Password")}
            secureTextEntry={true}
            autoCapitalize={"none"}
            keyboardType={"ascii-capable"}
            returnKeyType={"done"}
            changeBorder
            onChangeText={(password) => this.setState({ password })}
          />
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.forgotButton}
            onPress={this.forgotButton}
          >
            <Text style={styles.forgotText}>
              {I18n.t("Forgot_Your_Password")}
            </Text>
          </TouchableOpacity>
          <View style={styles.loginButtonView}>
            <Button Text={I18n.t("Login")} onPress={this.loginButton} />
          </View>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[
              AppStyles.bottomView,
              {
                bottom: Dimensions.deviceHeight > 600 ? 30 : 25,
                alignSelf: "center",
              },
            ]}
            onPress={this.signUp}
          >
            <Text numberOfLines={1} style={styles.accountText}>
              {I18n.t("Doesnt_have_an_account")}{" "}
              <Text
                style={[
                  styles.accountText,
                  {
                    color: AppColor.colors.white,
                    textDecorationLine: "underline",
                  },
                ]}
              >
                {I18n.t("Sign_up")}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }
}

function mapStateToProps(state) {
  return {
    loginState: state.LoginState,
    logOutState: state.LogOutState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ loginAction }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
