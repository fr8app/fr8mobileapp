import React, { Component } from "react";
import {
  SafeAreaView,
  View,
  AppState,
  FlatList,
  Text,
  Platform,
  NativeModules,
  Dimensions,
  Image,
  TouchableOpacity,
  Keyboard,
  ImageBackground,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { notificationGetInitiate } from "../../Redux/actions/Notification";
import { PushChatNotification } from "../../Redux/actions/Chat";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import MapInput from "../../Components/MapSearchInput/index";
import Animated from "react-native-reanimated";
import styles, { darkMap } from "./styles";
import {
  LiveStreamRender,
  Header,
  MenuModal,
  Loader,
  FetchApi,
} from "../../Components";
import { withInAppNotification } from "react-native-in-app-notification";
import { AppStyles, AppImages } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
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
} from "../../Redux/actions/Home";
import MapView, { Callout, PROVIDER_GOOGLE } from "react-native-maps";
import { Marker } from "react-native-maps";
import PushNotification from "../../PushManager";
import {
  addNotificationMessage,
  clearNotifyArray,
} from "../../Redux/actions/Chat";
import I18n from "react-native-i18n";
import geolocation from "@react-native-community/geolocation";
import { Notifications } from "react-native-notifications";
import AppConstants from "../../Themes/AppConstants";
import DataManager from "../../Components/DataManager";
import GeoLocationService from "react-native-geolocation-service";
import { chatHistoryAction } from "../../Redux/actions/Chat";
import { imageBaseUrl, getUSerDetail, getPopRef } from "../../Config";
import { getPreciseDistance } from "geolib";
import _BackgroundTimer from "react-native-background-timer";
import { connectSocket, intervalRef, socket } from "../../Config/socket";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";
import { fontFamily } from "../../Themes/AppFontFamily";
import MatIcon from "react-native-vector-icons/MaterialCommunityIcons";
import { userInTerminal } from "../../Redux/actions/MyFrightingNetwork";
import {
  getCurrentUser,
  getTerminalWaitingTime,
  getTerminalWaitingTimeShowWithFormat,
} from "../../Components/getTerminalWaitingTime";
import { NativeEventEmitter } from "react-native";
import {
  check,
  PERMISSIONS,
  request,
  requestMultiple,
  RESULTS,
} from "react-native-permissions";
import { ProfileDataInitate } from "../../Redux/actions/profileAction";
import { AFLogEvent } from "../../Config/aws";
var _this;
var socketFeildArray = [];
var socketGlobalData = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};

Notifications?.events()?.registerNotificationReceivedForeground(async (
  notification
  // completion: (response: NotificationCompletion) => void
) => {
  let data;
  console.log("datadatadata", notification);
  if (notification?.payload?.data) {
    data = await JSON.parse(notification.payload.data);
    if (data?.Notifykey == "location") {
      _this?.props?.userInTerminal(data.type);
      _this?.getLatLong();
    } else {
      _this?.props?.friendRequest(data);
    }
  } else if (notification?.payload?.sendDetail) {
    data = await JSON.parse(notification.payload.sendDetail);
    if (data?.Notifykey == "location") {
      _this?.props?.userInTerminal(data.type);
      _this?.getLatLong(false);
    }  else {
      _this?.props?.friendRequest(data);
    }
  }
});
const myEmitter = new NativeEventEmitter(NativeModules?.ViewController);

myEmitter?.addListener("calleventDelegates", (data) => {
  console.log("data.BBfenceCoordinate", data);
});
const { width, height } = Dimensions.get("window");
class FR8 extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Header
          headerTitle={AppConstants.constants.FR8}
          leftImageSource={AppImages.images.profileClient}
          rightImageSource={AppImages.images.chat}
          rightImageSource1Width={42}
          rightImageSource1Height={42}
          leftWidthIcon={40}
          hieghtIcon={40}
          unread={true}
          customStyles={{
            leftBtnView: { marginRight: 12 },
          }}
          leftbackbtnPress={async () => {
            let isLogin = await _this.isLoginn();
            if (isLogin == true) {
              navigation.navigate("UserNamess", {
                onNavigationBack: () => _this.onNavigationBack(),
                isLogin: true,
              });
            } else {
              navigation.navigate("UserNamess", {
                onNavigationBack: () => _this.onNavigationBack(),
                isLogin: false,
              });
            }
          }}
          rightBackBtnPress={async () => {
            let isLogin = await _this.isLogin();
            if (isLogin == true) {
              navigation.navigate("ChatHistory", {
                onNavigationBack: () => _this.onNavigationBack(),
              });
            }
          }}
        />
      ),
    };
  };

  constructor(porps) {
    super(porps);
    this.state = {
      locationPermissionShown: false,
      isDropdownVisible: false,
      tooltipVisibleId: "",
      date: new Date(),
      userId: "",
      trackChange: true,
      accuracy: 10,
      inputZindex: 1,
      circleLatDelta: 0,
      circleLangDelta: 0,
      mapZoomin: 0,
      mapZoomout: 19,
      sideMenu: false,
      refresh: false,
      modal: true,
      indexing: 1,
      coordinates: [],
      makeRoute: false,
      alertPermission: false,
      region: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
        num: 0,
      },
      socketRegion: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
        num: 0,
      },
      lastProvidedTime: moment()
        .utc()
        .toISOString(),
      latitude: null,
      longitude: null,
      checkLocation: null,
      appState: AppState.currentState,
      zoom: "Out",
      search: "",
      random: new Date().getTime(),
    };
    this.timeLineRef = null;
    this.scrollY = new Animated.Value(0);
    (this.MapHeight = height), (_this = this);
    this.props.navigation.setParams({ sideMenu: this.sideMenu });
    this.diffClam = Animated.diffClamp(this.scrollY, 0, this.MapHeight);
    this.MapAnimationY = Animated.interpolateNode(this.diffClam, {
      inputRange: [0, this.MapHeight],
      outputRange: [0, -2 * this.MapHeight],
    });
  }

  socketCall = () => {
    _BackgroundTimer.clearInterval(intervalRef.current);
    intervalRef.current = _BackgroundTimer.setInterval(() => {
      if (this.state.userId) {
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

  getFAvList = async () => {
    let list = await DataManager.getFavList();
    let listData = await JSON.parse(list);
    console.log("hhhjkk", listData);
    if (listData?.length == 0) {
      if (this.props.homeState.fromLanguage == false) {
      } else {
        this.props.homeState.fromLanguage = false;
      }
    }
  };

  componentDidMount() {
    setTimeout(async () => {
      AFLogEvent("FR8", { screen: "socket", device: Platform.OS });
      this.getFAvList();
      let data = await getUSerDetail();
      console.log("data", data);
      if (data) {
        this.props.homeDetailAction(this.props.navigation);
        this.props.ProfileDataInitate({ navigation: this.props.navigation });
      }
    }, 2000);
    if (Platform.OS == "ios") {
      BackgroundGeolocation.checkStatus((res) => {
        console.log("back Status", res);
        if (res.authorization == 0) {
          if (this.state.locationPermissionShown == false) {
            this.setState({ locationPermissionShown: true });
            Alert.alert(
              "Location services are off",
              "FR8 would like to access your location to time stamp your terminal in and out time.",
              [
                {
                  text: "Open settings",
                  onPress: () => {
                    BackgroundGeolocation.showAppSettings();
                    this.setState({ locationPermissionShown: false });
                  },
                },
              ],
              { cancelable: false }
            );
          }
        }
      });
    }

    this.socketCall();
    this.getDetail();
    this.dummy();
    console.log("socket connected", socket.connected);
    if (!socket.connected) {
      let resp = connectSocket();
      console.log("respo", resp);
    }

    //backgroundgeolocation configure
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
    this.getLatLong(false);
    this.focusListener = this.props.navigation.addListener("focus", () => {
      setTimeout(() => {
        this.liveStreamRef?.renderMount();
      }, 5000);
      setTimeout(() => {
        if (this.state.search.length == 0) {
          this.getLatLong(false);
        }
      }, 500);
    });
    this.focusListener = this.props.navigation.addListener("blur", () => {
      this.liveStreamRef?.renderUnMount();
      this.setState({ tooltipVisibleId: "" });
    });
    PushNotification?.init(this.props);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  getDetail = async () => {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);
    this.setState({ userId: jsonData?.data?._id });
    console.log("user detail", jsonData?.data?._id);
    AsyncStorage.getItem("startTimer").then((res) => {
      let jsonParser = JSON.parse(res);
    });

    if (!jsonData) {
      let dummyData = await DataManager.getDummyUserDetails();
      console.log("dummyData", dummyData);
      if (dummyData) {
        this.setState({ userId: dummyData.data.userId });
      }
    }
  };

  componentWillReceiveProps(nextProps) {
    PushNotification.updateProps(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.props.homeState.unreadCount) {
      countUnread = this.props.homeState.unreadCount;
    }
    PushNotification.updateProps(this.props);

    if (prevProps.homeState !== this.props.homeState) {
      if (this.props.homeState.searchData == true) {
        this.props.homeState.searchData = false;
      }
      if (prevProps.homeState.geofences !== this.props.homeState.geofences) {
        if (this.props.homeState.geofencesGet == true) {
          this.props.homeState.geofencesGet = false;
          if (Platform.OS == "ios") {
            this.callAddAndRemoveFences(this.props.homeState.geofences);
          }
        }
      }
    }
  }
  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
    Notifications?.registerRemoteNotifications();
    if (Platform.OS == "ios") {
      PushNotificationIOS.removeEventListener("register", () => {});
      PushNotificationIOS.removeEventListener("registrationError", () => {});
      PushNotificationIOS.removeEventListener("notification", () => {});
    }
  }

  configurePermission = () => {
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
      }
    });
  };

  _handleAppStateChange = async (nextAppState) => {
    if (nextAppState === "active") {
      BackgroundGeolocation.checkStatus((res) => {
        console.log("back Status", res);
        if (res.authorization == 0) {
          if (this.state.locationPermissionShown == false) {
            this.setState({ locationPermissionShown: true });
            Alert.alert(
              "Location services are off",
              "FR8 would like to access your location to time stamp your terminal in and out time.",
              [
                {
                  text: "Open settings",
                  onPress: () => {
                    BackgroundGeolocation.showAppSettings(),
                      this.setState({ locationPermissionShown: false });
                  },
                },
              ],
              {
                cancelable: false,
              }
            );
          }
        }
      });
      this.setState({ search: "" });
      if (Platform.OS == "android") {
        Notifications?.removeAllDeliveredNotifications();
      } else {
        PushNotificationIOS.setApplicationIconBadgeNumber(0);
        PushNotificationIOS.removeAllDeliveredNotifications();
      }
      Notifications?.isRegisteredForRemoteNotifications().then((res) => {
        if (res == false) {
          if (this.state.alertPermission == false) {
            this.setState({ alertPermission: true });
            setTimeout(() => {
              Alert.alert(
                '"FR8" Would Like to Send You Notifications?',
                "Notifications may include alerts,sounds and icon badges.These can be configured in Settings.",
                [
                  {
                    text: "Don't Allow",
                    onPress: () => {
                      this.setState({ alertPermission: false });
                    },
                  },
                  {
                    text: "Ok",
                    onPress: () => {
                      Linking.openSettings();
                      this.setState({ alertPermission: false });
                    },
                  },
                ]
              );
            }, 200);
          }
        }
      });

      Keyboard.dismiss();

      AsyncStorage.getItem("terminalDetail", (err, result) => {
        if (result) {
          const ParsedData = JSON.parse(result);
          const changedData = ParsedData.map((data) => {
            if (data.type == "BBFenceEventEnterFence") {
              const parsedTime = data.time;
              const UTctime = data.time;
              return {
                ...data,
                terminal_id: data.id,
                type: "1",
                timestamp: UTctime,
              };
            } else {
              const parsedTime = data.time;
              const UTctime = moment.utc();
              return {
                ...data,
                timestamp: UTctime,
                terminal_id: data.id,
                type: "0",
              };
            }
          });
          console.log("this.props.navigation", this.props.navigation);
          if (this.props?.route?.name !== "OnBoarding") {
          }
        }
      });

      if (Platform.OS == "ios") {
        NativeModules.ViewController.viewDidLoad();
      }
      PushNotification.init(this.props);
      if (this.props.homeState.terminalSearch.length == 0) {
      }
    } else if (nextAppState == "background") {
      if (Platform.OS == "android") {
        Notifications?.removeAllDeliveredNotifications();
      }
    }
  };

  onError(error) {
    console.warn("[location] ERROR -", error);
  }

  getLatLong(loader = true, latt = null, longg = null) {
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
          let region = {
            latitude: latt ? latt : position.coords.latitude,
            longitude: longg ? longg : position.coords.longitude,

            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          if (this.mapRef) {
            this.mapRef.animateToRegion(region, 2000);
          }
          this.setState(
            {
              region,
              latitude: latt ? latt : region.latitude,
              longitude: longg ? longg : region.longitude,
              zoom: "in",
            },
            () => {}
          );
          if (latt == null && longg == null) {
            this.fetchData(region.latitude, region.longitude, loader);
          }
        },
        (error) => {
          let region = {
            latitude: 40.741231,
            longitude: -74.101984,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          this.setState(
            { region, latitude: region.latitude, longitude: region.longitude },
            () => {}
          );
          this.fetchData(region.latitude, region.longitude, loader);
          if (this.mapRef) {
            this.mapRef.animateToRegion(region, 2000);
          }
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
            latitude: latt ? latt : position.coords.latitude,
            longitude: longg ? longg : position.coords.longitude,

            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };

          if (this.mapRef) {
            this.mapRef.animateToRegion(region, 2000);
          }
          this.setState(
            {
              region,
              latitude: latt ? latt : region.latitude,
              longitude: longg ? longg : region.longitude,
              zoom: "in",
            },
            () => {}
          );
          if (latt == null && longg == null) {
            this.fetchData(region.latitude, region.longitude, loader);
          }
        },
        (error) => {
          let region = {
            latitude: 40.741231,
            longitude: -74.101984,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          };
          this.setState(
            { region, latitude: region.latitude, longitude: region.longitude },
            () => {}
          );
          this.fetchData(region.latitude, region.longitude, loader);
          if (this.mapRef) {
            this.mapRef.animateToRegion(region, 2000);
          }
        }
      );
    }
  }

  fetchData(lat, long, loader = true) {
    let { navigation } = this.props;
    if (Platform.OS == "ios") {
      AsyncStorage.getItem("geoFenceCalled").then((res) => {
        console.log("res", res);
        let parseData = JSON.parse(res);
        if (parseData) {
          let newTime = moment(new Date());
          let totalTime = moment.duration(moment(newTime).diff(parseData));
          console.log(totalTime.minutes(), "diff,duration");
          if (totalTime.minutes() >= 10) {
            this.props.getGeoFences(lat, long);
          }
        } else {
          this.props.getGeoFences(lat, long);
        }
      });
    }
    if (this.props?.route?.name != "TimeLineMap") {
      this.props.homeAction(lat, long, loader, navigation);
    }
  }

  sideMenu = () => {
    this.setState({ sideMenu: true });
  };

  _renderItem = ({ item, index }) => {
    return (
      <LiveStreamRender
        terminalImageType={item.terminal_image_type}
        ref={(ref) => {
          this.liveStreamRef = ref;
        }}
        imagePreload={true}
        startTime={
          item.open_time
            ? moment(
                moment(new Date()).format("YYYY-MM-DDT") +
                  item.open_time.split("T")[1]
              ).format("HH:mm")
            : null
        }
        endTime={
          item.close_time
            ? moment(
                moment(new Date()).format("YYYY-MM-DDT") +
                  item.close_time.split("T")[1]
              ).format("HH:mm")
            : null
        }
        terminal={item.terminal_name}
        EstimatedTime={getTerminalWaitingTimeShowWithFormat(item)}
        postSource={
          item.terminal_image_type == "url"
            ? item.terminal_url
            : [imageBaseUrl + item.terminal_logo]
        }
        onPress={this.terminalClcked.bind(this, item, index)}
        locationName={item.terminal_location}
        avaliable={I18n.t("avaliable24Hours")}
      />
    );
  };

  terminalClcked = async (item, index) => {
    this.setState({ modal: false });
    this.props.terminalDetailState.post = [];
    this.props.navigation.navigate("TerminalDetails", {
      terminaldata: item,
      onNavigationBack: () => this.onNavigationBack(),
    });
  };
  onNavigationBack = () => {};

  myPostsClick = () => {
    this.setState({ sideMenu: false });
    this.props.navigation.navigate("MyPosts");
  };

  friendRequestClick = () => {
    this.setState({ sideMenu: false });
    this.props.navigation.navigate("FriendRequests");
  };

  settingClick = async () => {
    this.setState({ sideMenu: false });
    let login = await this.isLoginn();
    this.props.navigation.navigate("Settings", { isLogin: login });
  };
  onReachEndfunc = () => {
    if (this.state.search.length > 0) {
    } else {
      if (
        this.props.homeState.paginationData.total >
        this.props.homeState.result.length
      ) {
        this.props.onReachEndTerminal({
          lat: this.state.region.latitude,
          long: this.state.region.longitude,
          url: this.props.homeState.paginationData.nextPageurl,
          offset: this.props.homeState.result.length,
        });
      }
    }
  };
  _handleRefresh = () => {
    this.setState({ refresh: true, search: "" }, () => {
      this.getLatLong();
      setTimeout(() => {
        this.setState({ refresh: false });
      }, 3000);
    });
  };

  changeLocation = (location) => {
    console.log("fdlkjfjfdsfds", location);
    this.setState({
      region: {
        latitude: location.nativeEvent.coordinate.latitude,
        longitude: location.nativeEvent.coordinate.longitude,
        latitudeDelta: this.state.region.latitudeDelta,
        longitudeDelta: this.state.region.longitudeDelta,
      },
    });
  };
  _setLocation = (e) => {
    if (this.state.search.length == 0) {
      if (
        getPreciseDistance(e.nativeEvent.coordinate, this.state.region) > 50
      ) {
        let region = {
          latitude: e.nativeEvent.coordinate.latitude,
          longitude: e.nativeEvent.coordinate.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        };

        if (this.mapRef) {
          this.mapRef.animateToRegion(region, 2000);
        }
        this.setState({
          region,
          latitude: region.latitude,
          longitude: region.longitude,
          zoom: "in",
          search: "",
        });
      }
    }
  };

  isLogin = async () => {
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      return true;
    } else {
      console.log("kkkkkkk", getPopRef());
      getPopRef().modalOpen(
        `It's time to Track current Wait Times!\nSetting up your profile allows you to post, see current wait times, share your detention time, and unlock other features that work for you`
      );
      return false;
    }
  };
  isLoginn = async () => {
    let data = await getUSerDetail();
    console.log("data", data);
    if (data) {
      return true;
    } else {
      console.log("kkkkkkk", getPopRef());
      return false;
    }
  };

  onSearchBack = (data) => {
    Keyboard.dismiss();
    if (data) {
      this.setState({ search: data.terminal_name });
      this.getLatLong(true, data.latitude, data.longitude);
      setTimeout(() => {
        this.props.searchTerminalInitiate(
          data.terminal_name,
          this.props.navigation,
          true
        );
      }, 200);
    } else {
      this.setState({ search: "" });
      this.getLatLong(false);
    }
    setTimeout(() => {
      this.setState({ trackChange: true });
    }, 2000);
  };

  navigationHeader = () => {
    const { navigation } = this.props;
    return (
      <View style={{ flex: Platform.OS == "android" ? 0.099 : 0.13 }}>
        <Header
          headerTitle={AppConstants.constants.FR8}
          leftImageSource={AppImages.images.profileClient}
          rightImageSource={AppImages.images.chat}
          rightImageSource1Width={42}
          rightImageSource1Height={42}
          leftWidthIcon={40}
          hieghtIcon={40}
          unread={true}
          customStyles={{
            leftBtnView: { marginRight: 12 },
          }}
          leftbackbtnPress={async () => {
            let isLogin = await _this.isLoginn();
            if (isLogin == true) {
              navigation.navigate("UserNamess", {
                onNavigationBack: () => _this.onNavigationBack(),
                isLogin: true,
              });
            } else {
              navigation.navigate("UserNamess", {
                onNavigationBack: () => _this.onNavigationBack(),
                isLogin: false,
              });
            }
          }}
          rightBackBtnPress={async () => {
            let isLogin = await _this.isLogin();
            if (isLogin == true) {
              navigation.navigate("ChatHistory", {
                onNavigationBack: () => _this.onNavigationBack(),
              });
            }
          }}
        />
      </View>
    );
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        {this.navigationHeader()}
        <View style={{ flex: 1 }}>
          {
            <View
              style={[
                AppStyles.container,
                { paddingHorizontal: 0, backgroundColor: "#212121" },
              ]}
            >
              <Loader loading={this.props.homeState.onLoad} />
              <Animated.View
                style={[
                  styles.animatedView,
                  {
                    zIndex: this.state.indexing,
                    height: this.MapHeight * 0.65,
                  },
                ]}
              >
                <FlatList
                  data={[1]}
                  bounce={true}
                  style={{ backgroundColor: "#212121" }}
                  contentContainerStyle={{ flex: 1 }}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        width: "100%",
                        height: this.MapHeight * 0.65,
                        backgroundColor: "black",
                      }}
                    >
                      <MapView
                        followsUserLocation={true}
                        onUserLocationChange={(e) => {
                          this._setLocation(e);
                        }}
                        mapType="standard"
                        showsBuildings={true}
                        showsUserLocation={true}
                        onPress={() => {
                          Keyboard.dismiss();
                          this.setState({ tooltipVisibleId: "" });
                        }}
                        minZoomLevel={this.state.mapZoomin}
                        maxZoomLevel={this.state.mapZoomout}
                        ref={(mapRef) => (this.mapRef = mapRef)}
                        style={styles.map}
                        customMapStyle={darkMap}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                          latitude: this.state.region.latitude,
                          longitude: this.state.region.longitude,
                          latitudeDelta: 31,
                          longitudeDelta: 1,
                        }}
                      >
                        {this.props.homeState.result.length > 0
                          ? this.props.homeState.result.map((marker, index) => (
                              <Marker
                                onPress={() => {
                                  if (
                                    this.state.tooltipVisibleId == marker.id
                                  ) {
                                    this.setState({ tooltipVisibleId: "" });
                                  } else {
                                    this.setState({
                                      tooltipVisibleId: marker.id,
                                    });
                                  }
                                }}
                                tracksViewChanges={
                                  Platform.OS == "ios"
                                    ? true
                                    : this.state.trackChange
                                }
                                coordinate={{
                                  latitude: JSON.parse(marker.latitude),
                                  longitude: JSON.parse(marker.longitude),
                                }}
                                icon={marker.map_logo}
                                key={marker.id}
                                style={{ alignItems: "center" }}
                              >
                                {Platform.OS == "ios" ? (
                                  <Callout tooltip style={{ marginBottom: 30 }}>
                                    <ImageBackground
                                      borderRadius={10}
                                      resizeMode="cover"
                                      style={{
                                        borderRadius: 5,
                                        justifyContent: "space-between",
                                      }}
                                      source={require("../../Images/box2.png")}
                                    >
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          marginBottom: 16,
                                          marginTop: 10,
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <View
                                          style={{
                                            width: width * 0.25,
                                            backgroundColor: "#0082b6",
                                            marginHorizontal: 5,
                                          }}
                                        >
                                          <Text
                                            numberOfLines={3}
                                            style={{
                                              textAlign: "center",
                                              fontSize: 16,
                                              fontFamily: fontFamily.bold,
                                              padding: 2,
                                              color: "#fff",
                                            }}
                                          >
                                            {[
                                              // getTerminalWaitingTime(marker)
                                              getTerminalWaitingTimeShowWithFormat(
                                                marker
                                              ),
                                            ] + " "}
                                          </Text>
                                          <Image
                                            resizeMode="contain"
                                            style={{
                                              height: 30,
                                              width: 30,
                                              alignSelf: "center",
                                              marginTop: 5,
                                            }}
                                            source={require("../../Images/waiting3.png")}
                                          />
                                        </View>
                                        <View
                                          style={{
                                            width: width * 0.25,
                                            backgroundColor: "#0082b6",
                                            marginRight: 5,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              textAlign: "center",
                                              padding: 2,
                                              color: "#fff",
                                              fontSize: 16,
                                              fontFamily: fontFamily.bold,
                                            }}
                                          >
                                            {getCurrentUser(
                                              marker,
                                              marker.total_users
                                            )}
                                          </Text>
                                          <MatIcon
                                            style={{ alignSelf: "center" }}
                                            color="#fff"
                                            name="account-group"
                                            size={40}
                                          />
                                        </View>
                                      </View>
                                    </ImageBackground>
                                  </Callout>
                                ) : (
                                  this.state.tooltipVisibleId == marker.id && (
                                    <ImageBackground
                                      borderRadius={10}
                                      resizeMode="cover"
                                      style={{
                                        borderRadius: 5,
                                        justifyContent: "space-between",
                                      }}
                                      source={require("../../Images/box2.png")}
                                    >
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          marginBottom: 16,
                                          marginTop: 10,
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <View
                                          style={{
                                            width: width * 0.25,
                                            backgroundColor: "#0082b6",
                                            marginHorizontal: 5,
                                          }}
                                        >
                                          <Text
                                            numberOfLines={3}
                                            style={{
                                              textAlign: "center",
                                              fontSize: 16,
                                              fontFamily: fontFamily.bold,
                                              padding: 2,
                                              color: "#fff",
                                            }}
                                          >
                                            {[
                                              getTerminalWaitingTimeShowWithFormat(
                                                marker
                                              ),
                                              //  Math.floor(
                                              //   marker.avg_total_stopage_time_in_minutes
                                              // ),
                                            ] + " "}
                                          </Text>
                                          <Text
                                            style={{
                                              alignSelf: "center",
                                              flex: 1,
                                            }}
                                          >
                                            <Image
                                              resizeMode="contain"
                                              style={{
                                                height: 28,
                                                width: 28,
                                                alignSelf: "center",
                                                marginBottom: 10,
                                              }}
                                              source={require("../../Images/waiting3.png")}
                                            />
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            width: width * 0.25,
                                            backgroundColor: "#0082b6",
                                            marginRight: 5,
                                          }}
                                        >
                                          <Text
                                            style={{
                                              textAlign: "center",
                                              padding: 2,
                                              color: "#fff",
                                              fontSize: 16,
                                              fontFamily: fontFamily.bold,
                                            }}
                                          >
                                            {getCurrentUser(
                                              marker,
                                              marker.total_users
                                            )}
                                          </Text>
                                          <MatIcon
                                            style={{ alignSelf: "center" }}
                                            color="#fff"
                                            name="account-group"
                                            size={40}
                                          />
                                        </View>
                                      </View>
                                    </ImageBackground>
                                  )
                                )}
                                <ImageBackground
                                  source={
                                    marker.terminal_category ==
                                      "Port Terminal" ||
                                    marker.terminal_category == "Empty Depot"
                                      ? parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 45
                                        ? require("../../Images/location1.png")
                                        : parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) > 45 &&
                                          parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) <= 60
                                        ? require("../../Images/location2.png")
                                        : parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) > 60 &&
                                          parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) <= 90
                                        ? require("../../Images/location3.png")
                                        : parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) > 90 &&
                                          parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) <= 120
                                        ? require("../../Images/location4.png")
                                        : parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) > 120 &&
                                          parseInt(
                                            getTerminalWaitingTime(marker)
                                          ) <= 240
                                        ? require("../../Images/location5.png")
                                        : require("../../Images/location6.png")
                                      : parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 30
                                      ? require("../../Images/location1.png")
                                      : parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) > 30 &&
                                        parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 60
                                      ? require("../../Images/location2.png")
                                      : parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) > 60 &&
                                        parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 90
                                      ? require("../../Images/location3.png")
                                      : parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) > 90 &&
                                        parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 120
                                      ? require("../../Images/location4.png")
                                      : parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) > 120 &&
                                        parseInt(
                                          getTerminalWaitingTime(marker)
                                        ) <= 240
                                      ? require("../../Images/location5.png")
                                      : require("../../Images/location6.png")
                                  }
                                  style={styles.outerImage}
                                >
                                  <Image
                                    style={styles.innerImage}
                                    resizeMode="stretch"
                                    source={
                                      marker.map_logo == "" ||
                                      marker.map_logo == null
                                        ? marker.terminal_category ==
                                          "Port Terminal"
                                          ? AppImages.images.port1
                                          : marker.terminal_category ==
                                            "Empty Depot"
                                          ? AppImages.images.Empty1
                                          : marker.terminal_category ==
                                            "Warehouse"
                                          ? AppImages.images.warehouse1
                                          : marker.terminal_category ==
                                            "Rail Terminal"
                                          ? AppImages.images.rail1
                                          : AppImages.images.chassis
                                        : {
                                            uri: imageBaseUrl + marker.map_logo,
                                          }
                                    }
                                  />
                                </ImageBackground>
                              </Marker>
                            ))
                          : null}
                      </MapView>
                    </View>
                  )}
                />
              </Animated.View>

              <View
                style={{
                  paddingHorizontal: 10,
                  flex: 1,
                }}
              >
                {this.props.homeState.result.length > 0 ? (
                  <FlatList
                    nestedScrollEnabled={true}
                    pointerEvents="auto"
                    ListFooterComponent={
                      this.props.homeState.onLoadEnd == true ? (
                        <ActivityIndicator
                          style={{ marginTop: 20 }}
                          color={"#fff"}
                        />
                      ) : null
                    }
                    showsHorizontalScrollIndicator={false}
                    scrollToOverflowEnabled={true}
                    onScroll={(e) => {
                      if (e.nativeEvent.contentOffset.y === 0) {
                        this.setState({ indexing: 1 });
                      } else {
                        if (
                          e.nativeEvent.contentOffset.y >
                          Dimensions.get("screen").height * 0.5
                        ) {
                          this.setState({ inputZindex: -1 });
                        } else {
                          this.setState({ inputZindex: 1 });
                        }
                        if (this.state.indexing !== -1) {
                          this.setState({ indexing: -1 });
                        }
                      }
                    }}
                    bounces={false}
                    contentContainerStyle={{
                      paddingTop: height * 0.66,
                      paddingBottom: 80,
                    }}
                    data={this.props.homeState.result}
                    extraData={this.props}
                    onEndReached={() => {
                      if (!this.onEndReachedCalledDuringMomentum) {
                        this.setState({
                          trackChange: false,
                        });
                        this.onReachEndfunc();
                        this.onEndReachedCalledDuringMomentum = true;
                      }
                    }}
                    onMomentumScrollBegin={() => {
                      this.onEndReachedCalledDuringMomentum = false;
                    }}
                    renderItem={this._renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    ListEmptyComponent={
                      <View style={styles.listEmptyComponentView}>
                        <Text style={styles.noValueText}>
                          {I18n.t("terminalNotFound")}
                        </Text>
                      </View>
                    }
                  />
                ) : null}
              </View>

              <MenuModal
                modalVisible={this.state.sideMenu}
                anyTap={() => this.setState({ sideMenu: false })}
                myPostsClick={this.myPostsClick}
                friendRequestClick={this.friendRequestClick}
                settingClick={this.settingClick}
              />
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  width: "100%",
                  zIndex: this.state.inputZindex,
                }}
              >
                <MapInput
                  clearInput={() => {
                    this.setState({ search: "" });
                    this.getLatLong();
                  }}
                  onFocus={() =>
                    this.props.navigation.navigate("SearchTerminal", {
                      search: this.state.search,
                      onSearchBack: (data) => this.onSearchBack(data),
                    })
                  }
                  backNormal={() => {}}
                  value={this.state.search}
                />
              </View>
              <View
                style={[
                  styles.zoomView,
                  {
                    zIndex: this.state.inputZindex,
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.zoom}
                  onPress={() => {
                    if (
                      this.state.region.latitudeDelta === 0.005 ||
                      this.state.region.latitudeDelta === "0.005"
                    ) {
                      Keyboard.dismiss();
                      if (this.mapRef) {
                        this.mapRef.animateToRegion(
                          {
                            ...this.state.region,
                            latitudeDelta: 3,
                            longitudeDelta: 1,
                          },
                          1000
                        );
                        this.setState({
                          region: {
                            ...this.state.region,
                            latitudeDelta: 31,
                            longitudeDelta: 1,
                          },
                          zoom: "Out",
                        });
                      }
                    } else {
                      Keyboard.dismiss();
                      if (this.mapRef) {
                        this.mapRef.animateToRegion(
                          {
                            ...this.state.region,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          },
                          1000
                        );
                        this.setState({
                          region: {
                            ...this.state.region,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                          },
                          zoom: "In",
                        });
                      }
                    }
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={
                      this.state.zoom === "Out"
                        ? AppImages.images.locationPoint
                        : AppImages.images.locationMove
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          }

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={async () => {
              // let isLogin = await this.isLogin()
              // if (isLogin == true) {
              this.props.navigation.navigate("TimeLinePostCreate", {
                screen: "global",
                item: null,
                interChange: [],
                equipment: [],
                video: [],
                receiptPrivate: 0,
                mediaImages: [],
              });
              // }
            }}
            style={styles.createPost}
          >
            <Image
              resizeMode="contain"
              style={{ height: 70, width: 70 }}
              source={require("../../Images/12.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
function mapStateToProps(state) {
  return {
    stat: state,
    homeState: state.HomeState,
    terminalDetailState: state.TerminalDetailState,
    chatUserHistoryState: state.ChatUserHistoryState,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      homeDetailAction,
      friendRequest,
      homeAction,
      userInTerminal,
      selectedTerminalAction,
      addNotificationMessage,
      clearNotifyArray,
      onReachEndTerminal,
      nearTerminalNotifcationInitiate,
      searchTerminalInitiate,
      PushChatNotification,
      chatHistoryAction,
      notifyBadgeIncrerase,
      notificationGetInitiate,
      getGeoFences,
      ProfileDataInitate,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withInAppNotification(FR8));
