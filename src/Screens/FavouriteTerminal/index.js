import React, { Component } from "react";
import {
  View,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
  Alert,
  ImageBackground,
  Modal,
  StatusBar,
  AppState,
} from "react-native";
import styles from "./styles";
import {
  Header,
  UserRender,
  EmptyComponentList,
  Loader,
  DataManager,
  FetchApi,
} from "../../Components";
import {
  AppStyles,
  AppImages,
  DateFormat,
  AppColor,
  AppFontFamily,
} from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { chatHistoryAction, updateFriendID } from "../../Redux/actions/Chat";
import {
  favouriteTerminalAction,
  DeleteFavTerminal,
} from "../../Redux/actions/Home";
import I18n from "react-native-i18n";
import { imageBaseUrl, getUSerDetail, getPopRef } from "../../Config";
import PushNotification from "../../PushManager";
import {
  getTerminalWaitingTime,
  getTerminalWaitingTimeShowWithFormat,
} from "../../Components/getTerminalWaitingTime";
import { notificationGetInitiate } from "../../Redux/actions/Notification";
import { PushChatNotification } from "../../Redux/actions/Chat";
import {
  homeDetailAction,
  getGeoFences,
  homeAction,
  selectedTerminalAction,
  onReachEndTerminal,
  nearTerminalNotifcationInitiate,
  searchTerminalInitiate,
  notifyBadgeIncrerase,
  friendRequest,
  createDummyUSer,
} from "../../Redux/actions/Home";
import { ProfileDataInitate } from "../../Redux/actions/profileAction";
import GeoLocationService from "react-native-geolocation-service";
import { Notifications } from "react-native-notifications";
import { userInTerminal } from "../../Redux/actions/MyFrightingNetwork";
import moment from "moment";
import { connectSocket, intervalRef, socket } from "../../Config/socket";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
// import BackgroundGeolocation from "react-native-background-geolocation";
import { NativeEventEmitter, NativeModules } from "react-native";
import {
  check,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import _BackgroundTimer from "react-native-background-timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import geolocation from "@react-native-community/geolocation";
import { fontFamily } from "../../Themes/AppFontFamily";
import deviceInfoModule from "react-native-device-info";
import { withInAppNotification } from "react-native-in-app-notification";
import {
  addNotificationMessage,
  clearNotifyArray,
} from "../../Redux/actions/Chat";
import { AFLogEvent } from "../../Config/aws";
import NavigationService from "../../Route/NavigationService";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

import SwipeableList from "../../../libs/SwipeableSectionList/SwipeableList";
import DeleteTerminal from "../../Components/DeleteTerminal";

let _this;

var socketFeildArray = [];
var socketGlobalData = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};
let socketCopyArray = [];

Notifications?.events()?.registerNotificationReceivedForeground(
  async (
    notification,
    completion: (response: NotificationCompletion) => void
  ) => {
    let data;
    if (notification?.payload?.data) {
      data = await JSON.parse(notification.payload.data);
      if (data?.Notifykey == "location") {
        _this?.props?.userInTerminal(data.type);
      } else {
        _this?.props?.friendRequest(data);
      }
    } else if (notification?.payload?.sendDetail) {
      data = await JSON.parse(notification.payload.sendDetail);
      if (data?.Notifykey == "location") {
        _this?.props?.userInTerminal(data.type);
      } else {
        _this?.props?.friendRequest(data);
      }
    }
  }
);
const myEmitter = new NativeEventEmitter(NativeModules?.ViewController);

myEmitter?.addListener("calleventDelegates", (data) => {
  console.log("data.BBfenceCoordinate", data);
});

class FavouriteTerminal extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null,
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      regionList: [],
      dataEmpty: false,
      message: null,
      refreshing: false,
      searchText: "",
      lastProvidedTime: moment()
        .utc()
        .toISOString(),
      userId: "",
      token: "",
      IsDeleteClick: false,
      terminalID: "",
      swipe: true,
    };
    _this = this;
  }
  socketCall = () => {
    _BackgroundTimer.clearInterval(intervalRef.current);
    intervalRef.current = _BackgroundTimer.setInterval(() => {
      if (!this.state.userId) {
        this.getDetail();
      }
      if (socket.connected == false) {
        if (Platform.OS == "ios") {
          socket.disconnect();
        }
        socket.connect();
      } else {
        if (
          moment(this.state.lastProvidedTime).isBefore(
            moment()
              .utc()
              .toISOString()
          )
        ) {
          socket.emit("save_lat_long", {
            user_id: this.state.userId,
            longitude: socketGlobalData.longitude,
            latitude: socketGlobalData.latitude,
            date: moment()
              .utc()
              .toISOString(),
            fieldArray: socketFeildArray,
          });
          this.setState({
            lastProvidedTime: moment()
              .utc()
              .toISOString(),
          });
          socketFeildArray = [];
        }
      }
    }, 8000);
  };

  fetchData = (lat, long) => {
    if (Platform.OS == "ios") {
      AsyncStorage.getItem("geoFenceCalled").then((res) => {
        console.log("res", res);
        let parseData = JSON.parse(res);
        if (parseData) {
          let newTime = moment(new Date());
          let totalTime = moment.duration(moment(newTime).diff(parseData));
          if (totalTime.minutes() >= 10) {
            this.props.getGeoFences(lat, long);
          }
        } else {
          this.props.getGeoFences(lat, long);
        }
      });
    }
  };

  getFAvList = async () => {
    let list = await DataManager.getFavList();
    let listData = await JSON.parse(list);
    if (listData?.length == 0) {
      if (this.props.homeState.fromLanguage == false) {
        // this.props.navigation.navigate('Regions')
      } else {
        this.props.homeState.fromLanguage = false;
      }
    }
  };

  callAddAndRemoveFences = (data) => {
    NativeModules.ViewController.removeAllGeofence();
    console.log("this.props?.homeState geodata", data);
    data?.list.map((x, index) => {
      NativeModules.ViewController.methodgetContiniousLocation();
      NativeModules.ViewController.addFenceGeoatCurrentLocation(
        x.name,
        x.latitude.toString(),
        x.longitude.toString(),
        x.radius.toString(),
        x._id
      );
    });
    NativeModules.ViewController.showAllGeoFences();
  };

  dummy = async () => {
    if (Platform.OS == "android") {
      try {
        const checkResult = await check(
          PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION
        );
        console.log(RESULTS, checkResult, "status");
        switch (checkResult) {
          case RESULTS.UNAVAILABLE:
            console.log(RESULTS, "status");
            requestMultiple([
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
            ]);

            // Alert.alert(i18n.geolocation.notAvailableOnThisDevice);
            return;
          case RESULTS.DENIED:
            requestMultiple([
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
            ]);

            // The permission has not been requested / is denied but requestable
            // I ask for it then... (code not shown here)
            break;
          case RESULTS.GRANTED:
            // The permission is granted
            // Then I keep going
            break;
          case RESULTS.BLOCKED:
            requestMultiple([
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              // PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
            ]);

            // The permission is denied and not requestable anymore -> App settings
            // setTimeout(showGoToSettingsAlert, 1000);
            break;
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };

  getDetail = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({ userId: jsonData?.data?._id });
    if (!jsonData) {
      let dummyData = await DataManager.getDummyUserDetails();
      if (dummyData) {
        this.setState({ userId: dummyData.data.userId });
      }
    }
  };

  homeScreenDataCall = () => {
    setTimeout(() => {
      // this.props.homeDetailAction(this.props.navigation)
      // this.props.ProfileDataInitate({ navigation: this.props.navigation })
    }, 2000);
    if (Platform.OS == "ios") {
      BackgroundGeolocation.checkStatus((res) => {
        console.log("back Status", res);
        if (res.authorization == 0) {
          Alert.alert(
            "Location services are off",
            "FR8 would like to access your location to time stamp your terminal in and out time.",
            [
              {
                text: "Open settings",
                onPress: () => {
                  BackgroundGeolocation.showAppSettings();
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
    } else {
      BackgroundGeolocation.checkStatus((res) => {
        console.log("back Status", res);
        if (res.authorization == 0) {
          Alert.alert(
            "Location services are off",
            "FR8 would like to access your location to time stamp your terminal in and out time.",
            [
              {
                text: "Open settings",
                onPress: () => {
                  BackgroundGeolocation.showAppSettings();
                },
              },
            ],
            { cancelable: false }
          );
        }
      });
    }
    this.socketCall();
    this.getDetail();
    this.dummy();
    AsyncStorage.getItem("startTimer").then((res) => {
      let jsonParser = JSON.parse(res);
      if (jsonParser?.start) {
        this.props.navigation.navigate("TimeLineMap");
      }
    });
    // console.log('socket connected', socket.connected)
    if (!socket.connected) {
      let resp = connectSocket();
      console.log("respo", resp);
    }

    BackgroundGeolocation.checkStatus((status) => {
      if (status.hasPermissions && !status.authorization == 0) {
        BackgroundGeolocation.configure(
          {
            notificationsEnabled: false,
            activityType: "AutomotiveNavigation",
            desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
            distanceFilter: 0,
            debug: false,
            startOnBoot: true,
            stopOnTerminate: false,
            interval: 10,
            fastestInterval: 10,
            activitiesInterval: 10,
            locationProvider:
              Platform.OS == "ios"
                ? BackgroundGeolocation.DISTANCE_FILTER_PROVIDER
                : BackgroundGeolocation.ACTIVITY_PROVIDER,
            stopOnStillActivity: false,
            notificationTitle: "FR8",
            notificationText: I18n.t("ForegroundServiceTitle"),
            startForeground: true,
          },
          (state) => {
            console.log(state, "statestatestate");
          }
        );
        BackgroundGeolocation.start();
        BackgroundGeolocation.on("background", () => {
          console.log("[INFO] App is in background");
        });

        BackgroundGeolocation.on("foreground", () => {
          console.log("[INFO] App is in foreground");
        });

        BackgroundGeolocation.on("location", (location) => {
          socketGlobalData = location;
          if (location.latitude !== 0 && location.longitude !== 0) {
            socketFeildArray = [
              ...socketFeildArray,
              {
                latitude: location?.latitude,
                longitude: location?.longitude,
              },
            ];
          }

          AsyncStorage.getItem("startTimer").then((res) => {
            if (res) {
              let startParse = JSON.parse(res);
              if (startParse.start == true) {
                AsyncStorage.getItem("manualLatLng").then((res2) => {
                  let parseRes = JSON.parse(res2);
                  if (parseRes) {
                    let coord = [...parseRes.manualCoordinates, location];
                    AsyncStorage.setItem(
                      "manualLatLng",
                      JSON.stringify({ manualCoordinates: coord })
                    );
                  } else {
                    AsyncStorage.setItem(
                      "manualLatLng",
                      JSON.stringify({ manualCoordinates: [location] })
                    );
                  }
                });
              } else {
              }
            }
          });
        });

        BackgroundGeolocation.on("stationary", (stationaryLocation) => {
          console.log("stationaryLocation", stationaryLocation);
          socketGlobalData = stationaryLocation;
          if (
            stationaryLocation.latitude !== 0 &&
            stationaryLocation.longitude !== 0
          ) {
            socketFeildArray = [
              ...socketFeildArray,
              {
                latitude: stationaryLocation?.latitude,
                longitude: stationaryLocation?.longitude,
              },
            ];
          }
        });

        BackgroundGeolocation.on("error", (error) => {
          console.log("[ERROR] BackgroundGeolocation error:", error);
        });

        BackgroundGeolocation.on("start", () => {
          console.log("[INFO] BackgroundGeolocation service has been started");
        });

        BackgroundGeolocation.on("stop", () => {
          console.log("[INFO] BackgroundGeolocation service has been stopped");
        });
      } else {
        this.dummy();
      }
    });

    socket.on("got-connection", function(e) {
      console.log("a user connected");
      console.log(e.socketId);
    });

    socket.on("disconnect", function(e) {
      console.log("socket disconnected", e);
    });
    Notifications?.events()?.registerRemoteNotificationsRegistered((event) => {
      FetchApi.setDeviceToken(event.deviceToken);
    });
  };

  getLatLong() {
    if (Platform.OS == "android") {
      GeoLocationService.getCurrentPosition(
        (position) => {
          socketGlobalData = position?.coords;
          if (
            position.coords.longitude !== 0 &&
            position.coords.latitude !== 0
          ) {
            socketFeildArray = [
              ...socketFeildArray,
              {
                latitude: position?.coords?.latitude,
                longitude: position?.coords?.longitude,
              },
            ];
          }
          this.fetchData(
            position?.coords?.latitude,
            position?.coords?.longitude
          );
        },
        (error) => {
          let region = {
            latitude: 40.741231,
            longitude: -74.101984,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
        },
        {
          showLocationDialog: true,
          distanceFilter: 1,
        }
      );
    } else {
      geolocation.getCurrentPosition(
        (position) => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,

            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          this.fetchData(region.latitude, region.longitude);
        },
        (error) => {
          let region = {
            latitude: 40.741231,
            longitude: -74.101984,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
        }
      );
    }
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState === "active") PushNotification?.init(this.props);
    if (Platform.OS == "android") {
      Notifications?.removeAllDeliveredNotifications();
    } else {
      PushNotificationIOS.setApplicationIconBadgeNumber(0);
      PushNotificationIOS.removeAllDeliveredNotifications();
    }
  };

  componentDidMount() {
    
    this.getDetail();
    PushNotification?.init(this.props);
    setTimeout(() => {
      this.isLogin();
    }, 200);
    setTimeout(() => {
     AFLogEvent("waitTimeindicator", {
        screen: "waitTimeindicator",
        device: Platform.OS,
      });
      this.getFAvList();
      this.getLatLong();
      this.homeScreenDataCall();
    }, 1000);

    AppState.addEventListener("change", this.handleAppStateChange);
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.setState({ searchText: "" });
      setTimeout(() => {
        if (this.state.userId) {
          let list = DataManager.getFavList();
          list.then((res) => {
            let listParse = JSON.parse(res);
            this.setState({ regionList: listParse });

              this.props.favouriteTerminalAction(
                listParse,
                this.props.navigation,
                this.state.userId
              );
          });
        }
      }, 2000);
    });
    // PushNotification.init(this.props);
  }
  componentWillReceiveProps(nextProps) {
    PushNotification.updateProps(this.props);
  }

  componentDidUpdate(prevProps) {
    console.log("::::::::::::::;prev", prevProps);
    PushNotification.updateProps(this.props);

    if (prevProps.homeState !== this.props.homeState) {
      if (prevProps.homeState.geofences !== this.props.homeState.geofences) {
        if (this.props.homeState.geofencesGet == true) {
          this.props.homeState.geofencesGet = false;
          if (Platform.OS == "ios") {
            this.callAddAndRemoveFences(this.props.homeState.geofences);
          }
        }
      }

      if (prevProps.homeState.dataStatus !== this.props.homeState.dataStatus) {
        if (this.props.homeState.dataStatus == 1) {
          this.props.homeState.dataStatus = 0;
          if (this.props.homeState.favTerminals.length == 0) {
            let route = NavigationService.getFullRoute();
            if (route?.getCurrentRoute()?.name == "FavouriteTerminal2") {
              console.log("fdsfddfsffds", route?.getCurrentRoute().name);
              this.setState({ dataEmpty: true });
            }
          }
        }
      }
    }
  }

  isLogin = async () => {
    let data = await getUSerDetail();
    if (data) {
      return true;
    } else {
      let dummyData = await DataManager.getDummyUserDetails();
      if (dummyData) {
        this.setState({ userId: dummyData.data.userId });
      } else {
        this.props.createDummyUSer();
      }
      console.log("kkkkkkk", getPopRef());
      return false;
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={async () => {
          this.props.navigation.navigate("TerminalDetails", {
            terminaldata: item,
            onNavigationBack: () => {},
          });
        }}
        style={{
          borderBottomWidth: 0.5,
          borderBottomColor: "#29a2e1",
          flexDirection: "row",
          paddingHorizontal: 20,
          backgroundColor: "#fff",
        }}
      >
        <View style={{ marginTop: 20 }}>
          <ImageBackground
            source={
              item.terminal_category == "Port Terminal" ||
              item.terminal_category == "Empty Depot"
                ? // ? item.avg_total_stopage_time_in_minutes <=
                  parseInt(getTerminalWaitingTime(item)) <= 45
                  ? require("../../Images/fav/location.png")
                  : parseInt(getTerminalWaitingTime(item)) > 45 &&
                    parseInt(getTerminalWaitingTime(item)) <= 60
                  ? require("../../Images/fav/location1.png")
                  : parseInt(getTerminalWaitingTime(item)) > 60 &&
                    parseInt(getTerminalWaitingTime(item)) <= 90
                  ? require("../../Images/fav/location2.png")
                  : parseInt(getTerminalWaitingTime(item)) > 90 &&
                    parseInt(getTerminalWaitingTime(item)) <= 120
                  ? require("../../Images/fav/location3.png")
                  : parseInt(getTerminalWaitingTime(item)) > 120 &&
                    parseInt(getTerminalWaitingTime(item)) <= 240
                  ? require("../../Images/fav/location4.png")
                  : require("../../Images/fav/location5.png")
                : parseInt(getTerminalWaitingTime(item)) <= 30
                ? require("../../Images/fav/location.png")
                : parseInt(getTerminalWaitingTime(item)) > 30 &&
                  parseInt(getTerminalWaitingTime(item)) <= 60
                ? require("../../Images/fav/location1.png")
                : parseInt(getTerminalWaitingTime(item)) > 60 &&
                  parseInt(getTerminalWaitingTime(item)) <= 90
                ? require("../../Images/fav/location2.png")
                : parseInt(getTerminalWaitingTime(item)) > 90 &&
                  parseInt(getTerminalWaitingTime(item)) <= 120
                ? require("../../Images/fav/location3.png")
                : parseInt(getTerminalWaitingTime(item)) > 120 &&
                  parseInt(getTerminalWaitingTime(item)) <= 240
                ? require("../../Images/fav/location4.png")
                : require("../../Images/fav/location5.png")
            }
            resizeMode="contain"
            style={styles.outerImage}
          >
            {/* <View style={{ backgroundColor: 'white', height: 54, width: 54, borderRadius: 27, position: 'absolute', top: '7%' }}> */}
            <Image
              style={{
                height: "56%",
                width: "85%",
                // top: '23%',
                position: "absolute",
                // zIndex: 1,
                borderRadius: 2,
              }}
              // style={{backgroundColor:'white', height: 54, width: 54, borderRadius: 27, position: 'absolute', top: '7%' }}
              resizeMode="stretch"
              // borderRadius={27}
              // style={{ height: 54, width: 40, alignSelf: 'center' }}
              // resizeMode="contain"
              source={
                item.map_logo == "" || item.map_logo == null
                  ? item.terminal_category == "Port Terminal"
                    ? AppImages.images.port1
                    : item.terminal_category == "Empty Depot"
                    ? AppImages.images.Empty1
                    : item.terminal_category == "Warehouse"
                    ? AppImages.images.warehouse1
                    : item.terminal_category == "Rail Terminal"
                    ? AppImages.images.rail1
                    : AppImages.images.chassis
                  : { uri: imageBaseUrl + item.map_logo }
              }
            />
            {/* </View> */}
          </ImageBackground>
        </View>
        <View style={[{ flex: 1, paddingHorizontal: 10, paddingVertical: 20 }]}>
          <Text numberOfLines={1} style={[styles.tittleText]}>
            {item.terminal_name}
          </Text>
          <View>
            <Text style={[styles.descText]}>
              {item?.regionDetail?.region_name}
            </Text>
            <View style={{ flexDirection: "row", width: "80%" }}>
              <Text numberOfLines={2} style={[styles.tittleText]}>
                {getTerminalWaitingTimeShowWithFormat(item)}
              </Text>
              <Text
                numberOfLines={2}
                style={[
                  {
                    paddingLeft: 4,
                    marginBottom: 1,
                    fontSize: 13,
                    alignSelf: "flex-end",
                    fontFamily: AppFontFamily.fontFamily.black,
                  },
                ]}
              >
                {I18n.t("currentWaitTime")}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  deleteTerminalClick() {
    this.props.DeleteFavTerminal(
      this.state.terminalID,
      this.state.userId,
      this.props.navigation
    );
    this.setState({ IsDeleteClick: !this.state.IsDeleteClick, swipe: false });
    setTimeout(() => {
      this.setState({ swipe: true });
    }, 100);
  }
  cancelTerminalClick() {
    this.setState({ IsDeleteClick: !this.state.IsDeleteClick, swipe: false });
    setTimeout(() => {
      this.setState({ swipe: true });
    }, 100);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {Platform.OS == "android" && <StatusBar translucent={false} />}
        <Modal
          statusBarTranslucent={this.state.dataEmpty ? false : true}
          visible={this.state.dataEmpty}
          transparent
        >
          <View
            style={{ backgroundColor: "rgba(58,58,58,0.93)", height: "100%" }}
          >
            <ImageBackground
              resizeMode="cover"
              style={[{ height: Dimensions.get("screen").height * 0.11 }]}
              source={AppImages.images.header}
            >
              <View
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgb(0,35,46)",
                }}
              />
              <Image
                style={{
                  width: Dimensions.get("screen").width,
                  height:
                    Platform.OS == "android"
                      ? Dimensions.get("screen").height * 0.29
                      : deviceInfoModule.hasNotch()
                      ? Dimensions.get("screen").height * 0.29
                      : Dimensions.get("screen").height * 0.33,
                  marginTop: Platform.OS == "android" ? "0%" : "8%",
                }}
                source={require("../../Images/coatchMArk.png")}
              />
              <View style={{ height: Dimensions.get("screen").height * 0.67 }}>
                <TouchableOpacity
                  onPress={() => this.setState({ dataEmpty: false })}
                  style={{
                    backgroundColor: "#29a2e1",
                    zIndex: 99999,
                    width: "30%",
                    marginHorizontal: "3%",
                    marginVertical: 5,
                    alignItems: "center",
                    justifyContent: "center",
                    paddingVertical: 14,
                    borderRadius: 4,
                  }}
                >
                  <Text
                    style={{
                      color: "white",
                      fontSize: 20,
                      fontFamily: fontFamily.bold,
                    }}
                  >
                    OK
                  </Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
            {/* <Text style={{color:'black',fontSize:40,fontFamily:fontFamily.regular,textAlign:'center',position: 'absolute',top:'50%',alignSelf:'center'}}>NO DATA</Text> */}
          </View>
        </Modal>
        <DeleteTerminal
          visible={this.state.IsDeleteClick}
          DeleteButton={() => this.deleteTerminalClick()}
          cancelButton={() => this.cancelTerminalClick()}
        />
        <Loader loading={this.props.homeState.onLoad} />
        <View style={{ flex: Platform.OS == "ios" ? 0.13 : 0.109 }}>
          <Header
            rightImageSource1Width={25}
            rightImageSource1Height={25}
            headerTitle={I18n.t("waitTimeIndicator")}
            rightImageSource={
              this.props.homeState.favTerminals.length > 0
                ? AppImages.images.editPen
                : AppImages.images.add
            }
            customStyles={{
              leftBtnView: { marginRight: 7 },
            }}
            rightBackBtnPress={() =>
              this.props.navigation.navigate("Regions", {
                id: this.state.userId,
                token: this.state.token,
              })
            }
          />
        </View>
        <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
          <SwipeableList
            data={this.props.homeState.favTerminals}
            keyExtractor={(item, index) => index.toString()}
            renderItem={this._renderItem}
            maxSwipeDistance={60}
            extraData={[this.state, this.props]}
            renderQuickActions={({ item }) => {
              return (
                <View style={styles.qaContainer}>
                  <View style={[styles.button]}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          IsDeleteClick: !this.state.IsDeleteClick,
                          terminalID: item._id,
                        })
                      }
                    >
                      <View style={{ height: 28, width: 28 }}>
                        <Image
                          source={require("../../Images/DeleteFavTerminal.png")}
                          resizeMode={"contain"}
                          style={{
                            height: "100%",
                            width: "100%",
                            paddingLeft: 40,
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            }}
            onRefresh={() => {
              this.state.userId &&
                this.props.favouriteTerminalAction(
                  this.state.regionList,
                  this.props.navigation,
                  this.state.userId
                );
            }}
            refreshing={this.state.refreshing}
            shouldBounceOnMount={true}
            enableSwipe={this.state.swipe}
            ListEmptyComponent={
              <View
                style={{
                  height: Dimensions.get("screen").height * 0.7,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.noValueText}>
                  {this.props.homeState.isLoad
                    ? I18n.t("loading")
                    : I18n.t("regionlNotFound")}
                </Text>
              </View>
            }
          />
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
    chatHistoryState: state.ChatHistoryState,
    chatUserHistoryState: state.ChatUserHistoryState,
    homeState: state.HomeState,
    stat: state,
    terminalDetailState: state.TerminalDetailState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      chatHistoryAction,
      updateFriendID,
      favouriteTerminalAction,
      homeDetailAction,
      getGeoFences,
      ProfileDataInitate,
      userInTerminal,
      friendRequest,
      homeAction,
      selectedTerminalAction,
      addNotificationMessage,
      clearNotifyArray,
      onReachEndTerminal,
      nearTerminalNotifcationInitiate,
      searchTerminalInitiate,
      PushChatNotification,
      notifyBadgeIncrerase,
      notificationGetInitiate,
      createDummyUSer,
      DeleteFavTerminal,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withInAppNotification(FavouriteTerminal));
