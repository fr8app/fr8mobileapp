import React, { Component } from "react";
import { View, FlatList, SafeAreaView, Image, TextInput, Dimensions, Text, TouchableOpacity, Platform, Alert, ImageBackground } from "react-native";
import styles from "./styles";
import { Header, UserRender, EmptyComponentList, Loader, DataManager, FetchApi } from "../../Components";
import { AppStyles, AppImages, DateFormat, AppColor, AppFontFamily } from "../../Themes";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { chatHistoryAction, updateFriendID } from "../../Redux/actions/Chat";
import { favouriteTerminalAction } from "../../Redux/actions/Home";
import I18n from "react-native-i18n";
import { imageBaseUrl } from "../../Config";
import PushNotification from "../../PushManager";
import NetInfo from '@react-native-community/netinfo'
import { CachedImage } from '../../Components/react-native-cached-image-master'
import { getTerminalWaitingTime, getTerminalWaitingTimeShowWithFormat } from "../../Components/getTerminalWaitingTime";
import {
  homeDetailAction,
  getGeoFences,
  homeAction,
  selectedTerminalAction,
  onReachEndTerminal,
  nearTerminalNotifcationInitiate,
  searchTerminalInitiate,
  notifyBadgeIncrerase,
  friendRequest
} from "../../Redux/actions/Home";
import { ProfileDataInitate } from '../../Redux/actions/profileAction';
import GeoLocationService from "react-native-geolocation-service";
import { Notifications } from "react-native-notifications";
import { userInTerminal } from "../../Redux/actions/MyFrightingNetwork";
import moment from "moment";
import { connectSocket, intervalRef, socket } from "../../Config/socket";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation"
// import BackgroundGeolocation from "react-native-background-geolocation";
import { NativeEventEmitter, NativeModules } from "react-native";
import { check, PERMISSIONS, request, requestMultiple, RESULTS } from "react-native-permissions";
import { getPreciseDistance } from "geolib";
import _BackgroundTimer from "react-native-background-timer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import geolocation from "@react-native-community/geolocation";

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
    notification: Notification,
    completion: (response: NotificationCompletion) => void
  ) => {

    let data;
    if (notification?.payload?.data) {
      data = await JSON.parse(notification.payload.data);
      if (data?.Notifykey == "location") {
        _this?.props?.userInTerminal(data.type)
      }
      else {
        _this?.props?.friendRequest(data)

      }
    } else if (notification?.payload?.sendDetail) {
      data = await JSON.parse(notification.payload.sendDetail);
      if (data?.Notifykey == "location") {
        _this?.props?.userInTerminal(data.type)
      }
      else {
        _this?.props?.friendRequest(data)

      }
    }
  }
);
const myEmitter = new NativeEventEmitter(NativeModules?.ViewController);

myEmitter?.addListener('calleventDelegates', (data) => {
  console.log('data.BBfenceCoordinate', data)
})

class FavouriteTerminal extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        // <Header
        //   rightImageSource1Width={25}
        //   rightImageSource1Height={25}
        //   // headerTitle={I18n.t("FavouriteTerminals")}
        //   headerTitle={"Wait Time Indicator"}
        //   // leftImageSource={AppImages.images.back}
        //   // leftbackbtnPress={() => _this.navBack()}
        //   rightImageSource={AppImages.images.add}
        //   customStyles={{
        //     leftBtnView: { marginRight: 7 },
        //   }}
        //   rightBackBtnPress={() => navigation.navigate("Regions")}
        // />
        null
      ),
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      refreshing: false,
      searchText: "",
      lastProvidedTime: moment().utc().toISOString(),
      userId: "",
    };
    _this = this;
    // this.props.chatHistoryAction(this.props.navigation);
  }

  socketCall = () => {
    _BackgroundTimer.clearInterval(intervalRef.current);
    intervalRef.current = _BackgroundTimer.setInterval(() => {
      if (socket.connected == false) {
        if (Platform.OS == 'ios') {
          socket.disconnect()
        }
        socket.connect();
      } else {
        if (
          moment(this.state.lastProvidedTime).isBefore(
            moment().utc().toISOString()
          )
        ) {
          socket.emit("save_lat_long", {
            user_id: this.state.userId,
            longitude: socketGlobalData.longitude,
            latitude: socketGlobalData.latitude,
            date: moment().utc().toISOString(),
            fieldArray: socketFeildArray,
          });
          this.setState({ lastProvidedTime: moment().utc().toISOString() });
          socketFeildArray = []
        }
      }
    }, 8000);
  };

  fetchData = (lat, long) => {
    if (Platform.OS == 'ios') {
      AsyncStorage.getItem('geoFenceCalled').then((res) => {
        console.log('res', res);
        let parseData = JSON.parse(res)
        if (parseData) {
          let newTime = moment(new Date())
          let totalTime = moment.duration(
            moment(newTime).diff(parseData)
          );
          console.log(totalTime.minutes(), 'diff,duration');
          if (totalTime.minutes() >= 10) {
            this.props.getGeoFences(lat, long);
          }
        }
        else {
          this.props.getGeoFences(lat, long);
        }
      })

    }
  }

  getFAvList = async () => {
    let list = await DataManager.getFavList();
    let listData = await JSON.parse(list);
    console.log('hhhjkk', listData)
    if (listData?.length == 0) {
      if (this.props.homeState.fromLanguage == false) {
        // this.props.navigation.navigate('Regions')
      }
      else {
        this.props.homeState.fromLanguage = false
      }
    }
  }

  callAddAndRemoveFences = (data) => {
    NativeModules.ViewController.removeAllGeofence()
    console.log('this.props?.homeState geodata', data);
    data?.list.map((x, index) => {
      NativeModules.ViewController.methodgetContiniousLocation()
      NativeModules.ViewController.addFenceGeoatCurrentLocation(x.name, x.latitude.toString(), x.longitude.toString(), x.radius.toString(), x._id)
    })
    NativeModules.ViewController.showAllGeoFences()
  }

  dummy = async () => {
    if (Platform.OS == 'android') {
      try {
        const checkResult = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
        console.log(RESULTS, checkResult, 'status');
        switch (checkResult) {
          case RESULTS.UNAVAILABLE:
            console.log(RESULTS, 'status');
            requestMultiple([
              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
            ])

            // Alert.alert(i18n.geolocation.notAvailableOnThisDevice);
            return;
          case RESULTS.DENIED:
            requestMultiple([

              PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
            ])

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
            ])

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
    console.log('user detail', jsonData?.data?._id);
    AsyncStorage.getItem('startTimer').then((res) => {
      let jsonParser = JSON.parse(res)
      if (jsonParser?.start) {
        this.props.navigation.navigate('TimeLineMap')
      }
    })

    // socket.emit('manual_socket',
    //             {
    //                 start: false,
    //                 time: moment().utc(),
    //                 user_id: jsonData?.data?._id
    //             }
    //         )
    //         AsyncStorage.removeItem('manualLatLng')
    //         AsyncStorage.removeItem('startTimer')

  };

  homeScreenDataCall = () => {
    setTimeout(() => {
      this.props.homeDetailAction(this.props.navigation)
      this.props.ProfileDataInitate({ navigation: this.props.navigation })
    }, 2000);
    if (Platform.OS == 'ios') {
      BackgroundGeolocation.checkStatus(res => {
        console.log('back Status', res);
        if (res.authorization == 0) {
          Alert.alert(
            'Location services are off',
            'FR8 would like to access your location to time stamp your terminal in and out time.',
            [
              {
                text: 'Open settings', onPress: () => {
                  BackgroundGeolocation.showAppSettings()
                }
              },
            ],
            { cancelable: false }
          )

        }
      })

    }


    this.socketCall()
    this.getDetail();
    this.dummy()
    // console.log('socket connected', socket.connected)
    if (!socket.connected) {
      let resp = connectSocket();
      console.log('respo', resp)
    }

    BackgroundGeolocation.checkStatus(status => {
      if (status.hasPermissions && !status.authorization == 0) {
        BackgroundGeolocation.configure({
          notificationsEnabled: false,
          activityType: 'AutomotiveNavigation',
          desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
          distanceFilter: 0,
          debug: false,
          startOnBoot: true,
          stopOnTerminate: false,
          interval: 10,
          fastestInterval: 10,
          activitiesInterval: 10,
          locationProvider: Platform.OS == 'ios' ? BackgroundGeolocation.DISTANCE_FILTER_PROVIDER : BackgroundGeolocation.ACTIVITY_PROVIDER,
          stopOnStillActivity: false,
          notificationTitle: "FR8",
          notificationText: I18n.t("ForegroundServiceTitle"),
          startForeground: true,

        }, (state) => {
          console.log(state, 'statestatestate');
        });
        BackgroundGeolocation.start();
        BackgroundGeolocation.on('background', () => {
          console.log('[INFO] App is in background');
        });

        BackgroundGeolocation.on('foreground', () => {
          console.log('[INFO] App is in foreground');
        });

        BackgroundGeolocation.on('location', (location) => {
          socketGlobalData = location;
          if (location.latitude !== 0 && location.longitude !== 0) {
            socketFeildArray = [...socketFeildArray, {
              latitude: location?.latitude,
              longitude: location?.longitude
            }]
          }

          AsyncStorage.getItem('startTimer').then((res) => {
            if (res) {
              let startParse = JSON.parse(res)
              if (startParse.start == true) {
                AsyncStorage.getItem('manualLatLng').then((res2) => {
                  let parseRes = JSON.parse(res2)
                  if (parseRes) {
                    let coord = [...parseRes.manualCoordinates, location]
                    AsyncStorage.setItem('manualLatLng', JSON.stringify({ manualCoordinates: coord }))
                  }
                  else {
                    AsyncStorage.setItem('manualLatLng', JSON.stringify({ manualCoordinates: [location] }))

                  }

                })

              }
              else {

              }
            }
          })

        });

        BackgroundGeolocation.on('stationary', (stationaryLocation) => {
          console.log("stationaryLocation", stationaryLocation);
          socketGlobalData = stationaryLocation;
          if (stationaryLocation.latitude !== 0 && stationaryLocation.longitude !== 0) {
            socketFeildArray = [...socketFeildArray, {
              latitude: stationaryLocation?.latitude,
              longitude: stationaryLocation?.longitude
            }]
          }

        });

        BackgroundGeolocation.on('error', (error) => {
          console.log('[ERROR] BackgroundGeolocation error:', error);
        });

        BackgroundGeolocation.on('start', () => {
          console.log('[INFO] BackgroundGeolocation service has been started');
        });

        BackgroundGeolocation.on('stop', () => {
          console.log('[INFO] BackgroundGeolocation service has been stopped');
        });
      }
    })


    socket.on('got-connection', function (e) {
      console.log('a user connected');
      console.log(e.socketId);

    });

    socket.on('disconnect', function (e) {
      console.log('socket disconnected', e);
    });
    Notifications?.events()?.registerRemoteNotificationsRegistered((event) => {
      FetchApi.setDeviceToken(event.deviceToken);
    });
    PushNotification?.init(this.props);

  }

  getLatLong() {
    if (Platform.OS == "android") {

      GeoLocationService.getCurrentPosition(
        (position) => {
          socketGlobalData = position?.coords;
          if (position.coords.longitude !== 0 && position.coords.latitude !== 0) {
            socketFeildArray = [...socketFeildArray, {
              latitude: position?.coords?.latitude,
              longitude: position?.coords?.longitude
            }]
          }
          this.fetchData(position?.coords?.latitude, position?.coords?.longitude);

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

  componentDidMount() {
    setTimeout(() => {
      this.getFAvList()
    }, 2000);
    this.getLatLong()
    this.homeScreenDataCall()
    this.focusListener = this.props.navigation.addListener("focus", () => {
      this.setState({ searchText: "" });
      setTimeout(() => {
        this.props.favouriteTerminalAction(this.props.navigation);
      }, 2000);
    });
    PushNotification.init(this.props);
  }

  componentDidUpdate(prevProps) {

    PushNotification.updateProps(this.props);

    if (prevProps.homeState !== this.props.homeState) {

      if (prevProps.homeState.geofences !== this.props.homeState.geofences) {
        if (this.props.homeState.geofencesGet == true) {
          this.props.homeState.geofencesGet = false;
          if (Platform.OS == 'ios') {
            this.callAddAndRemoveFences(this.props.homeState.geofences)
          }
        }
      }
    }
  }


  navBack = () => {
    this.props.homeState.unreadCount = this.props.chatHistoryState.chatCounterget;
    this.props.route.params.onNavigationBack();
    this.props.navigation.goBack();
  };
  _renderItem = ({ item, index }) => {
    console.log('itemitem',item);
    return (
      <TouchableOpacity
        activeOpacity={1}

        style={{ borderBottomWidth: 0.5, borderBottomColor: '#29a2e1', flexDirection: 'row', paddingHorizontal: 20 }}>
        <View style={{ marginTop: 20 }}>
          {/* <CachedImage resizeMode='cover' source={{ uri: imageBaseUrl + item.terminal_logo }} style={{
             height: 50,
              width: 50,
              borderRadius: 25,
              backgroundColor: '#e8e8e8',
              
              }} /> */}

          <ImageBackground
            source={
              item.terminal_category == "Port Terminal" ||
                item.terminal_category == "Empty Depot"
                // ? item.avg_total_stopage_time_in_minutes <=
                ? parseInt(getTerminalWaitingTime(item)) <=
                  45
                  ? require("../../Images/mapLogo/locationR1.png")
                  : parseInt(getTerminalWaitingTime(item)) >
                    45 &&
                    parseInt(getTerminalWaitingTime(item)) <=
                    60
                    ? require("../../Images/mapLogo/locationR2.png")
                    : parseInt(getTerminalWaitingTime(item)) >
                      60 &&
                      parseInt(getTerminalWaitingTime(item)) <=
                      90
                      ? require("../../Images/mapLogo/locationR3.png")
                      : parseInt(getTerminalWaitingTime(item)) >
                        90 &&
                        parseInt(getTerminalWaitingTime(item)) <=
                        120
                        ? require("../../Images/mapLogo/locationR4.png")
                        : parseInt(getTerminalWaitingTime(item)) >
                          120 &&
                          parseInt(getTerminalWaitingTime(item)) <=
                          240
                          ? require("../../Images/mapLogo/locationR5.png")
                          : require("../../Images/mapLogo/locationR6.png")
                : parseInt(getTerminalWaitingTime(item)) <=
                  30
                  ? require("../../Images/mapLogo/locationR1.png")
                  : parseInt(getTerminalWaitingTime(item)) >
                    30 &&
                    parseInt(getTerminalWaitingTime(item)) <=
                    60
                    ? require("../../Images/mapLogo/locationR2.png")
                    : parseInt(getTerminalWaitingTime(item)) >
                      60 &&
                      parseInt(getTerminalWaitingTime(item)) <=
                      90
                      ? require("../../Images/mapLogo/locationR3.png")
                      : parseInt(getTerminalWaitingTime(item)) >
                        90 &&
                        parseInt(getTerminalWaitingTime(item)) <=
                        120
                        ? require("../../Images/mapLogo/locationR4.png")
                        : parseInt(getTerminalWaitingTime(item)) >
                          120 &&
                          parseInt(getTerminalWaitingTime(item)) <=
                          240
                          ? require("../../Images/mapLogo/locationR5.png")
                          : require("../../Images/mapLogo/locationR6.png")
            }
            resizeMode='contain'
            style={styles.outerImage}
          >
            <Image
              style={{height:48,width:48,borderRadius:24,position:'absolute',top:'11.5%'}}
              resizeMode="cover"
              source={
                item.map_logo == "" ||
                  item.map_logo == null
                  ? item.terminal_category ==
                    "Port Terminal"
                    ? AppImages.images.port1
                    : item.terminal_category ==
                      "Empty Depot"
                      ? AppImages.images.Empty1
                      : item.terminal_category ==
                        "Warehouse"
                        ? AppImages.images.warehouse1
                        : item.terminal_category ==
                          "Rail Terminal"
                          ? AppImages.images.rail1
                          : AppImages.images.chassis
                  : { uri: imageBaseUrl + item.map_logo }
              }
            />
          </ImageBackground>

        </View>
        <View style={[{ flex: 1, paddingHorizontal: 10, paddingVertical: 20 }]}>
          <Text numberOfLines={1} style={[styles.tittleText]}>
            {item.terminal_name}
          </Text>
          <View >
            <Text numberOfLines={2} style={[styles.descText]}>
              {item.terminal_location}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text numberOfLines={2} style={[styles.tittleText]}>
                {Math.ceil(item.avg_total_stopage_time_in_minutes)}
              </Text>
              <Text numberOfLines={2} style={[{ paddingLeft: 4, marginBottom: 1, fontSize: 12, alignSelf: 'flex-end', fontFamily: AppFontFamily.fontFamily.black }]}>
                {"Minute Current Average Wait Time"}
              </Text>
            </View>

          </View>

        </View>
      </TouchableOpacity>

    );
  };

  onNavigationBack = () => {
    // this.props.chatHistoryAction(this.props.navigation,"");
  };

  searchView = () => {
    return (
      <View style={styles.mainSearchView}>
        <Image
          resizeMode="contain"
          style={styles.searchImage}
          source={AppImages.images.search}
        />
        <TextInput
          style={styles.searchText}
          placeholder={I18n.t("friendSearch")}
          keyboardType={"ascii-capable"}
          returnKeyType={"done"}
          multiline={false}
          value={this.state.searchText}
          onChangeText={(searchText) => this.searchUser(searchText)}
        />
      </View>
    );
  };

  // searchUser = (text) => {
  //   this.setState({ searchText: text });
  //   this.props.chatHistoryAction(this.props.navigation, text);
  //   // this.props.searchUserAction(text, 0, this.props.navigation);
  // };

  render() {
    let { chatHistoryState } = this.props;

    return (
      <View style={styles.mainContainer}>
          <Loader loading={this.props.homeState.onLoad} />
        <View style={{flex: Platform.OS == 'ios' ? 0.13 : 0.109}}>
        <Header
          rightImageSource1Width={25}
          rightImageSource1Height={25}
          // headerTitle={I18n.t("FavouriteTerminals")}
          headerTitle={"Wait Time Indicator"}
          // leftImageSource={AppImages.images.back}
          // leftbackbtnPress={() => _this.navBack()}
          rightImageSource={AppImages.images.add}
          customStyles={{
            leftBtnView: { marginRight: 7 },
          }}
          rightBackBtnPress={() => this.props.navigation.navigate("Regions")}
        />
        </View>
        
        <View style={[AppStyles.container, { paddingHorizontal: 0 }]}>
          {/* {this.searchView()} */}
          {
            // chatHistoryState.result.length > 0 ?
            (
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                bounces={true}
                refreshing={this.state.refreshing}
                contentContainerStyle={{}}
                data={this.props.homeState.favTerminals}
                extraData={[this.state, this.props]}
                renderItem={this._renderItem}
                onRefresh={() => {
                  this.props.favouriteTerminalAction(this.props.navigation)
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ height: Dimensions.get('screen').height * 0.7, alignItems: 'center', justifyContent: 'center' }}>
                    {/* <EmptyComponentList height="80%" title={I18n.t("terminalNotFound")} /> */}
                    <Text style={{
                      fontSize: 20, textAlign: 'center', width: '80%',
                      fontFamily: AppFontFamily.fontFamily.regular,
                    }}>Please add the favourite region to get update of favourite regions.</Text>
                  </View>
                }
              />
            )
            // : (
            //   <EmptyComponentList height="80%" title={I18n.t("terminalNotFound")} />
            // )
          }
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
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    chatHistoryAction, updateFriendID, favouriteTerminalAction, homeDetailAction, getGeoFences, ProfileDataInitate,
    userInTerminal, friendRequest
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteTerminal);
