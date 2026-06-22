import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  ImageBackground,
  Dimensions,
  AppState,
  Animated,
  Platform,
} from "react-native";
import styles from "./style";
import {
  Header,
  LiveStreamRender,
  Loader,
  DataManager,
} from "./../../Components";
import { AppImages } from "./../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  RoutePostAction,
  CreatePostAction,
} from "../../Redux/actions/RoutePostAction";
import moment from "moment";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";
import NetInfo from "@react-native-community/netinfo";
import { getUSerDetail, getPopRef } from "../../Config/index";
import { Notifications } from "react-native-notifications";
import PushNotification from "../../PushManager/index.ios";
const { height, width } = Dimensions.get("screen");

class TimeLine extends Component {
  constructor(porps) {
    super(porps);
    this.state = {
      userId: "",
      isLogin: false,
      userData: null,
      animationValue: new Animated.Value(1),
      indexing: 1,
      back: false,
      data: [],
      refresh: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
    this.isLogin();
  }
  isLogin = async () => {
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      this.setState({ isLogin: true });
      return true;
    }
  };

  Notifications = async () => {
    Notifications?.events()?.registerNotificationReceivedForeground(
      async (
        notification,
        completion: (response: NotificationCompletion) => void
      ) => {
        let data;
        if (notification?.payload?.data) {
          data = await JSON.parse(notification?.payload?.data);
          if (data?.Notifykey == "location") {
            let data = await getUSerDetail();
            console.log("data", data);
            this.setState({ userData: data });
          }
        } else if (notification?.payload?.sendDetail) {
          data = await JSON.parse(notification?.payload?.sendDetail);
          if (data?.Notifykey == "location") {
            let data = await getUSerDetail();
            console.log("data", data);
            this.setState({ userData: data });
          } else {
          }
        }
      }
    );
  };

  getDetail = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({ userId: jsonData?.data?._id });

    if (!jsonData) {
      let dummyData = await DataManager.getDummyUserDetails();
      console.log("dummyData", dummyData);
      if (dummyData) {
        this.setState({ userId: dummyData.data.userId });
      }
    }
  };

  componentDidMount() {
    this.Notifications();
    AppState.addEventListener("change", async (state) => {
      if (state == "active") {
        let data = await getUSerDetail();
        console.log("data", data);
        this.setState({ userData: data });
        this.props.RoutePostAction(this.props.navigation, 1, this.state.userId);
      }
    });

    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.getDetail();
      this.props.homeState.isLoad = false;
      this.props.homeState.timeLineDetail = null;
      setTimeout(async () => {
        let data = await getUSerDetail();
        console.log("data", data);
        this.setState({ userData: data });
        this.props.RoutePostAction(this.props.navigation, 1, this.state.userId);
      }, 1000);
    });
    this.focusListener = this.props.navigation.addListener("blur", () => {});
  }
  componentDidUpdate() {
    PushNotification.updateProps(this.props);
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
    };
    return minutes > 60
      ? hours + " " + I18n.t("hrs") + " " + minutes + " " + I18n.t("mins")
      : seconds > 60
      ? minutes + " " + I18n.t("mins") + " " + seconds + " " + I18n.t("secs")
      : seconds + " " + I18n.t("secs");
  }

  _renderItem = ({ item, index }) => {
    return (
      <LiveStreamRender
        onTimelineSharePress={() => {
          NetInfo.fetch().then(async (res) => {
            if (res.isConnected) {
              let isLogin = await this.isLogin();
              if (isLogin == true) {
                this.props.navigation.navigate("TimeLineDetail", {
                  item: item,
                });
              } else {
                getPopRef().modalOpen();
              }
            } else {
              alert(I18n.t("please_check_your_internet_connection"));
            }
          });
        }}
        isTimeLineShare={true}
        cacheLess={true}
        timeLineType={item?.type}
        ratio={2}
        routeList
        userPostResized={"cover"}
        createdTime={moment(item.created_at).format("dddd, Do MMMM, YYYY")}
        dis={
          item.distance == 0
            ? "0"
            : ((item.distance / 1000) * 0.621371).toFixed(2)
        }
        minute={this.getTime(item.minute)}
        terminal={
          item?.type == "terminal" ? item?.terminal?.terminal_name : item.name
        }
        onPress={() => {
          NetInfo.fetch().then(async (res) => {
            if (res.isConnected) {
              let isLogin = await this.isLogin();
              if (isLogin == true) {
                this.props.navigation.navigate("TimeLineDetail", {
                  item: item,
                });
              } else {
                getPopRef().modalOpen();
              }
            } else {
              alert(I18n.t("please_check_your_internet_connection"));
            }
          });
        }}
        startTime={moment(item.start_time).format("HH:mm")}
        endTime={moment(item.end_time).format("HH:mm")}
        postSource={{ uri: imageBaseUrl + item.image }}
      />
    );
  };

  setPagination = () => {
    let { homeState, navigation } = this.props;
    if (homeState.result.data.total > this.props.homeState.routeData.length) {
      this.props.RoutePostAction(
        this.props.navigation,
        this.props.homeState.routeData.length,
        this.state.userId
      );
    }
  };
  getTime = (seconds) => {
    seconds = Number(seconds);
    var h = Math.floor(seconds / 3600);
    var m = Math.floor((seconds % 3600) / 60);
    var s = Math.floor(seconds % 60);
    var hDisplay =
      h > 0
        ? h + (h == 1 ? " " + I18n.t("hrs") + " " : " " + I18n.t("hrs") + " ")
        : "";
    var mDisplay =
      m > 0
        ? m + (m == 1 ? " " + I18n.t("mins") + " " : " " + I18n.t("mins") + " ")
        : [s > 29 ? "1 " : "0 "] + I18n.t("mins");
    if (h > 0) {
      return hDisplay + mDisplay;
    } else {
      return mDisplay;
    }
  };

  refreshControl = () => {
    this.setState({ refresh: true }, async () => {
      let data = await getUSerDetail();
      console.log("data", data);
      this.props.RoutePostAction(this.props.navigation, 1, this.state.userId);
      setTimeout(() => {
        this.setState({ refresh: false });
      }, 1000);
    });
  };

  doAnimationLongTouch = () => {
    Animated.spring(this.state.animationValue, {
      toValue: 1.4,
      tension: 50.0,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      this.props.navigation.navigate("TimeLineMap");
    }, 1000);
  };

  startPress = async () => {
    let isLogin = await this.isLogin();
    if (isLogin == true) {
      this.timerMeasureLongTouch = setTimeout(this.doAnimationLongTouch, 100);
    } else {
      getPopRef().modalOpen(
        `Ready to start tracking?\nSet up your profile to unlock this feature. It's quick, easy and free!`
      );
    }
  };
  startPressEnd = () => {
    Animated.spring(this.state.animationValue, {
      toValue: 1,
      friction: 2.4,
      tension: 50.0,
      useNativeDriver: true,
    }).start();
    clearTimeout(this.timerMeasureLongTouch);

    NetInfo.fetch().then((res) => {
      if (res.isConnected) {
      } else {
        alert(I18n.t("please_check_your_internet_connection"));
      }
    });
  };

  header = () => {
    return (
      <ImageBackground
        source={require("../../Images/bg_image.png")}
        style={{ width: "100%" }}
        resizeMode="cover"
      >
        <View style={{ paddingBottom: 10, paddingTop: "6%" }}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={() => this.startPress()}
            onPressOut={() => this.startPressEnd()}
            style={styles.startButtonView}
          >
            {I18n.currentLocale() == "pt" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={AppImages.images.startPortuguse}
              />
            ) : I18n.currentLocale() == "es" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={AppImages.images.startSpanish}
              />
            ) : I18n.currentLocale() == "hi" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/hindi.gif")}
              />
            ) : I18n.currentLocale() == "zh" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/chinese.gif")}
              />
            ) : I18n.currentLocale() == "ph" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/Tagalog.gif")}
              />
            ) : I18n.currentLocale() == "bn" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/bengoli.gif")}
              />
            ) : I18n.currentLocale() == "fr" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/French.gif")}
              />
            ) : I18n.currentLocale() == "de" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={AppImages.images.start}
              />
            ) : I18n.currentLocale() == "ko" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/Korean.gif")}
              />
            ) : I18n.currentLocale() == "ru" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/Russian.gif")}
              />
            ) : I18n.currentLocale() == "it" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/italian.gif")}
              />
            ) : I18n.currentLocale() == "vi" ? (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={require("../../Images/Start/Vietnamese.gif")}
              />
            ) : (
              <Animated.Image
                style={{
                  height: 140,
                  width: 140,
                  transform: [{ scale: this.state.animationValue }],
                }}
                resizeMode="contain"
                source={AppImages.images.start}
              />
            )}
          </TouchableOpacity>
          <View style={{ alignSelf: "center", marginTop: 20 }}>
            <Text
              style={[
                styles.trackTimeText,
                { textAlign: "center", paddingHorizontal: 20 },
              ]}
            >
              {I18n.t("trackAtimeLine")}
            </Text>
          </View>
        </View>
      </ImageBackground>
    );
  };

  render() {
    return (
      <>
        {Platform.OS == "android" ? (
          <Header headerTitle={I18n.t("Timeline")} />
        ) : (
          <View style={{ flex: Platform.OS == "android" ? 0.099 : 0.13 }}>
            <Header headerTitle={I18n.t("Timeline")} />
          </View>
        )}
        <SafeAreaView style={styles.mainContainer}>
          <Loader loading={this.props.homeState.onLoad} />
          <View
            style={[
              styles.inlineContainer,
              {
                backgroundColor:
                  this.state.back == true ? "black" : "transparent",
              },
            ]}
          >
            <FlatList
              ListEmptyComponent={
                <View
                  style={[
                    styles.listEmptyComponentView,
                    {
                      height:
                        this.props.homeState?.statusLocal == "manual"
                          ? height * 0.7
                          : height * 0.5,
                    },
                  ]}
                >
                  <Text style={styles.noValueText}>
                    {this.state.isLogin
                      ? !this.props.homeState.isLoad
                        ? I18n.t("loading")
                        : I18n.t("Journey")
                      : I18n.t("Journey")}
                  </Text>
                </View>
              }
              ListHeaderComponent={
                this.props.homeState?.statusLocal == null
                  ? this.header
                  : this.props.homeState?.statusLocal == "terminal"
                  ? null
                  : this.header()
              }
              refreshControl={
                <RefreshControl
                  onRefresh={() => {
                    this.refreshControl();
                  }}
                  refreshing={this.state.refresh}
                  tintColor="silver"
                />
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              scrollToOverflowEnabled={true}
              bounces={true}
              contentContainerStyle={{
                paddingBottom: 40,
              }}
              data={this.props.homeState.routeData}
              extraData={this.state}
              renderItem={this._renderItem}
              keyExtractor={(item, index) => index.toString()}
              onEndReachedThreshold={0.8}
              onEndReached={() => {
                if (!this.onEndReachedCalledDuringMomentum) {
                  this.setPagination();
                  this.onEndReachedCalledDuringMomentum = true;
                }
              }}
              onMomentumScrollBegin={() => {
                this.onEndReachedCalledDuringMomentum = false;
              }}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }
}
function mapStateToProps(state) {
  return {
    homeState: state.RoutePostData,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      RoutePostAction,
      CreatePostAction,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TimeLine);
