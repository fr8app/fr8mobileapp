import React, { Component } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Alert,
  Linking,
  Share,
  Text,
  Platform,
} from "react-native";
import styles from "./styles";
import {
  Header,
  SettingRender,
  ChangeLanguage,
  Loader,
  DataManager,
} from "./../../Components";
import { AppStyles, AppConstants, AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  deleteAccountAction,
  logOutAction,
  ChangeLanguageAction,
  resetViewIndex,
  changePasswordAction,
  setPassword,
} from "./../../Redux/actions/Authentication";
import I18n from "react-native-i18n";
import { EventRegister } from "react-native-event-listeners";
import NetInfo from "@react-native-community/netinfo";
import { AFLogEvent } from "../../Config/aws";
import { getUSerDetail, getPopRef, getPopRef2 } from "../../Config";
import { fontFamily } from "../../Themes/AppFontFamily";
import ChangePassword from "../../Components/ChangePassword/ChangePassword";
import { ProfileDataInitate } from "../../Redux/actions/profileAction";
import SetPasswordView from "../../Components/SetPassword/SetPassword";

class Settings extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     header: (
  //       <Header
  //         headerTitle={I18n.t('App_Settings')}
  //         leftImageSource={AppImages.images.back}
  //         leftbackbtnPress={() => navigation.goBack()}
  //       />
  //     )
  //   };
  // };
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: props?.navigation?.state?.params?.isLogin,
      userDetail: null,
      listArray: [
        { key: "Change_Mobile_Number", image: AppImages.images.arrowRight },
        // { key: "Terms_And_Conditions", image: AppImages.images.arrowRight },
        // { key: "Privacy_Policy", image: AppImages.images.arrowRight },
        { key: "Change_Language", image: AppImages.images.arrowRight },
        { key: "Support_Center", image: AppImages.images.arrowRight },
        { key: "App_Share", image: AppImages.images.arrowRight },
        { key: "location_Setting", image: AppImages.images.arrowRight },
        // { key: "deleteAccount", image: AppImages.images.arrowRight },
        { key: "Region", image: AppImages.images.arrowRight },
        { key: "Change_Password", image: AppImages.images.arrowRight },
      ],
      ChangeLanguage: false,
    };
    this.selectedLanguage = null;
    this.setPasswordRef = null;
    this.setLangugae();
  }

  isLogin = async () => {
    let data = await getUSerDetail();
    let parseData = JSON.parse(data);
    console.log("data:::::data", parseData?.data);
    if (data) {
      this.setState({ isLoggedIn: true, userDetail: parseData?.data });
      return true;
    } else {
      this.setState({ isLoggedIn: false });
      // console.log('kkkkkkk', getPopRef());
      // getPopRef().modalOpen()
      return false;
    }
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      "focus",
      async () => {
        let login = await this.isLogin();
        if (login) {
          this.props.ProfileDataInitate({ navigation: this.props.navigation });
        }
        AFLogEvent("Setting", { screen: "Setting" });
        DataManager.getUserDetails().then(async (response) => {
          console.log("response", response);
          if (response) {
            let parseData = await JSON.parse(response);
            this.setState({ userDetail: parseData?.data });
          }
        });
      }
    );
  }
  componentDidUpdate(prevProps) {
    console.log("this.props.LoginState", this.props.LoginState);
    if (this.props !== prevProps) {
      if (this.props.LoginState !== prevProps.LoginState) {
        if (this.props.LoginState.loggedIn == true) {
          this.props.LoginState.loggedIn = false;
          this.props.ProfileDataInitate({ navigation: this.props.navigation });
          this.isLogin();
          this.setPasswordRef.modalClose();
        }
      }
      if (this.props.Profile !== prevProps.Profile) {
        if (this.props.Profile.status == 1) {
          this.props.Profile.status = 0;
          this.isLogin();
        }
      }
    }
  }
  setLangugae() {
    DataManager.getAppLanguage().then((response) => {
      if (response !== null) {
        this.selectedLanguage = JSON.parse(response);
      } else {
        this.selectedLanguage = I18n.currentLocale();
      }
    });
  }

  _renderItem = ({ item, index }) =>
    this.state.isLoggedIn ? (
      <SettingRender
        Text={
          item.key == "Change_Mobile_Number"
            ? this.state?.userDetail?.phone_number
              ? I18n.t(item.key)
              : I18n.t("addmobile")
            : item.key == "Change_Password"
            ? this.state.userDetail?.isPasswordSet
              ? I18n.t(item.key)
              : "Set Password"
            : I18n.t(item.key)
        }
        source={item.image}
        visible={index == this.state.listArray.length - 1 ? false : true}
        onPress={this.selectedList.bind(this, item, index)}
      />
    ) : index == 1 || index == 6 ? null : (
      <SettingRender
        Text={
          item.key == "Change_Mobile_Number"
            ? this.state?.userDetail?.phone_number
              ? I18n.t(item.key)
              : I18n.t("addmobile")
            : item.key == "deleteAccount"
            ? this.state.isLoggedIn
              ? I18n.t(item.key)
              : I18n.t("addAccount")
            : I18n.t(item.key)
        }
        source={item.image}
        visible={index == this.state.listArray.length - 1 ? false : true}
        onPress={this.selectedList.bind(this, item, index)}
      />
    );

  sharePress = async () => {
    try {
      const result = await Share.share(
        {
          message:
            Platform.OS == "ios"
              ? this.state.isLoggedIn
                ? this.state.userDetail?.userName + I18n.t("appShareMessage")
                : I18n.t("appShareMessage2")
              : this.state.isLoggedIn
              ? this.state.userDetail?.userName +
                I18n.t("appShareMessage") +
                "\n" +
                "http://onelink.to/fr8app"
              : I18n.t("appShareMessage2") + "\n" + "http://onelink.to/fr8app",
          title: "FR8",
          url: "http://onelink.to/fr8app",
        },
        {
          subject: "FR8",
        }
      );
      if (result.action == Share.sharedAction) {
        if (result.activityType) {
        } else {
        }
      } else if (result.action == Share.dismissedAction) {
      }
    } catch (e) {}
  };

  selectedList = (item, index) => {
    let { navigation } = this.props;
    if (index == 0) {
      // navigation.navigate("EditProfile");
      this.state.isLoggedIn == true
        ? navigation.navigate("EditPhoneNumber")
        : this.props.navigation.navigate("EditProfile", {
            onNavigationBack: () => this.onNavigationBack(),
            addProfile: true,
          });
    } else if (index == 1) {
      this.state.isLoggedIn == true
        ? this.setState({ ChangeLanguage: true })
        : getPopRef().modalOpen();
    } else if (index == 2) {
      navigation.navigate("Support");
    } else if (index == 3) {
      this.sharePress();
    } else if (index == 4) {
      navigation.navigate("LocationSetting");
    } else if (index == 5) {
      NetInfo.fetch().then(async (res) => {
        if (res.isConnected == true) {
          let id = await DataManager.getDummyUserDetails();
          navigation.navigate("Regions", { id: id.data.userId });
        }
      });
    } else if (index == 6) {
      this.state.isLoggedIn == true
        ? this.state.userDetail
          ? this.state.userDetail?.isPasswordSet
            ? this.modalRef.modalOpen()
            : this.setPasswordRef.modalOpen(
                this.state.userDetail?.userName,
                this.props.navigation
              )
          : // getPopRef2().modalOpen(this.state.userDetail?.userName,null,"","",this.props.navigation,true)
            null
        : getPopRef().modalOpen();
    }
  };

  internetPouup = () => {
    Alert.alert(
      I18n.t("Alert"),
      I18n.t("please_check_your_internet_connection"),
      [
        {
          text: I18n.t("Ok"),
          onPress: () => {},
        },
      ],
      { cancelable: false }
    );
  };

  onNavigationBack = async () => {
    let isLogin = await this.isLogin();
    if (isLogin == true) {
      this.props.ProfileDataInitate({ navigation: this.props.navigation });
    }
  };

  submitButtonLanguge = () => {
    this.setState({ ChangeLanguage: false });
    if (this.selectedLanguage !== null) {
      console.log("this.selectedLanguage", this.selectedLanguage);
      if (this.selectedLanguage.includes("es")) {
        this.props.ChangeLanguageAction("es", this.props.navigation);
      } else if (this.selectedLanguage.includes("pt")) {
        this.props.ChangeLanguageAction("pt", this.props.navigation);
      } else if (this.selectedLanguage.includes("it")) {
        this.props.ChangeLanguageAction("it", this.props.navigation);
      } else if (this.selectedLanguage.includes("hi")) {
        this.props.ChangeLanguageAction("hi", this.props.navigation);
      } else if (this.selectedLanguage.includes("ph")) {
        this.props.ChangeLanguageAction("ph", this.props.navigation);
      } else if (this.selectedLanguage.includes("fr")) {
        this.props.ChangeLanguageAction("fr", this.props.navigation);
      } else if (this.selectedLanguage.includes("ko")) {
        this.props.ChangeLanguageAction("ko", this.props.navigation);
      } else if (this.selectedLanguage.includes("ru")) {
        this.props.ChangeLanguageAction("ru", this.props.navigation);
      } else if (this.selectedLanguage.includes("bn")) {
        this.props.ChangeLanguageAction("bn", this.props.navigation);
      } else if (this.selectedLanguage.includes("de")) {
        this.props.ChangeLanguageAction("de", this.props.navigation);
      } else if (this.selectedLanguage.includes("zh")) {
        this.props.ChangeLanguageAction("zh", this.props.navigation);
      } else {
        this.props.ChangeLanguageAction("en", this.props.navigation);
      }
      DataManager.setAppLanguage(this.selectedLanguage);
    }
    EventRegister.emit("language", "it works!!!");
    //  setTimeout(() => {
    // this.props.navigation.replace("FavouriteTerminal2");
    this.props.navigation.popToTop();
    this.props.navigation.replace("FavouriteTerminal2");
    //  }, 200);
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {Platform.OS == "android" ? (
          <Header
            headerTitle={I18n.t("App_Settings")}
            leftImageSource={AppImages.images.back}
            leftbackbtnPress={() => this.props.navigation.goBack()}
          />
        ) : (
          <View style={{ flex: 0.13 }}>
            <Header
              headerTitle={I18n.t("App_Settings")}
              leftImageSource={AppImages.images.back}
              leftbackbtnPress={() => this.props.navigation.goBack()}
            />
          </View>
        )}
        <Loader loading={this.props.logOutState.onLoad} />
        <View style={[AppStyles.container, { paddingHorizontal: 20 }]}>
          <FlatList
            bounces={false}
            contentContainerStyle={{ paddingTop: 5 }}
            data={this.state.listArray}
            extraData={this.state}
            renderItem={this._renderItem}
          />
        </View>
        <ChangeLanguage
          loading={this.state.ChangeLanguage}
          anyTap={() => this.setState({ ChangeLanguage: false })}
          caneclButton={() => this.setState({ ChangeLanguage: false })}
          submitButton={this.submitButtonLanguge}
          englishPress={(lang) => (this.selectedLanguage = "en")}
          spanishPress={(lang) => (this.selectedLanguage = "es")}
          portugusePress={(lang) => (this.selectedLanguage = "pt")}
          newLanguagePress={(lang) => (this.selectedLanguage = lang)}
        />

        <View style={{ alignSelf: "center", marginBottom: "11%" }}>
          <View style={{ flexDirection: "row" }}>
            <Text
              onPress={() =>
                Linking.openURL(AppConstants.constants.TermsUrl).catch((err) =>
                  console.error("Couldn't load page", err)
                )
              }
              style={{
                color: "#28A2E1",
                fontFamily: fontFamily.bold,
                fontSize: 16,
              }}
            >
              {I18n.t("Terms_And_Conditions")}
            </Text>
            <Text
              style={{
                marginHorizontal: 10,
                fontFamily: fontFamily.regular,
                fontSize: 16,
              }}
            >
              {I18n.t("And").toLowerCase()}
            </Text>
            <Text
              onPress={() =>
                Linking.openURL(AppConstants.constants.PrivacyUrl).catch(
                  (err) => console.error("Couldn't load page", err)
                )
              }
              style={{
                color: "#28A2E1",
                fontFamily: fontFamily.bold,
                fontSize: 16,
              }}
            >
              {I18n.t("Privacy_Policy")}
            </Text>
          </View>
          <Text
            onPress={() => {
              this.state.isLoggedIn == true
                ? Alert.alert(
                    I18n.t("Alert"),
                    I18n.t("deleteAccountAlert"),
                    [
                      {
                        text: "Cancel",
                        // onPress: () =>Alert.dismiss(),
                      },
                      {
                        text: "Yes",
                        onPress: () => {
                          this.props.deleteAccountAction(this.props.navigation);

                          // this.props.logOutAction(this.props.navigation);
                          // this.props.navigation.dispatch(resetAction)
                          // AsyncStorage.clear()
                        },
                      },
                    ],
                    { cancelable: false }
                  )
                : // getPopRef().modalOpen()
                  this.props.navigation.navigate("EditProfile", {
                    onNavigationBack: () => this.onNavigationBack(),
                    addProfile: true,
                  });
            }}
            style={{
              color: "gray",
              alignSelf: "center",
              fontFamily: fontFamily.bold,
              fontSize: 16,
            }}
          >
            {this.state.isLoggedIn
              ? I18n.t("deleteAccount")
              : I18n.t("addAccount")}
          </Text>
        </View>
        <ChangePassword
          ChangePassword={(oldPassword, newPassword) => {
            this.props.changePasswordAction(
              oldPassword,
              newPassword,
              this.props.navigation,
              this.modalRef
            );
          }}
          ref={(ref) => (this.modalRef = ref)}
        />
        <SetPasswordView
          {...this.props}
          ref={(ref) => (this.setPasswordRef = ref)}
        />
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    Profile: state.Profile,
    logOutState: state.LogOutState,
    LoginState: state.LoginState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setPassword,
      logOutAction,
      ProfileDataInitate,
      deleteAccountAction,
      changePasswordAction,
      resetViewIndex,
      ChangeLanguageAction,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
