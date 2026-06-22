// import { AsyncStorage } from 'react-native'
import AsyncStorage from "@react-native-async-storage/async-storage";
import _BackgroundTimer from "react-native-background-timer";
// import Radar from "react-native-radar";
import { io } from "socket.io-client";
import { socketBaseUrl, socketId } from "../../Config";
import { disconnectSocket, intervalRef, socket } from "../../Config/socket";


const DataManager = {
  setAccessToken(token) {
    AsyncStorage.setItem("Token", JSON.stringify(token));
  },
  getAccessToken() {
    try {
      return AsyncStorage.getItem("Token").then((token) => {
        return token;
      });
    } catch (error) {
    }
  },
  setUserDetails(userDetails) {
    AsyncStorage.setItem("userDetails", JSON.stringify(userDetails));
  },
  getUserDetails() {
    try {
      return AsyncStorage.getItem("userDetails").then((userDetails) => {
        return userDetails;
      });
    } catch (error) {
    }
  },
  setDummyUserDetails(userDetails) {
    AsyncStorage.setItem("dummyUserDetails", JSON.stringify(userDetails));
  },
  getDummyUserDetails() {
    try {
      return AsyncStorage.getItem("dummyUserDetails").then((userDetails) => {
        return JSON.parse(userDetails);
      });
    } catch (error) {
    }
  },
  setDeviceToken(value) {
    AsyncStorage.setItem("deviceToken", JSON.stringify(value));
  },
  getDevicetoken() {
    try {
      return AsyncStorage.getItem("deviceToken").then((token) => {
        console.log('token device>>>>>',token)
        return token;
      });
    } catch (error) {
    }
  },

  setAppLanguage(value) {
    AsyncStorage.setItem("language", JSON.stringify(value));
  },
  getAppLanguage() {
    try {
      return AsyncStorage.getItem("language").then((value) => {
        return value;
      });
    } catch (error) {
    }
  },

  setOnBoardingValue(value) {
    AsyncStorage.setItem("onBoard", JSON.stringify(value));
  },
  getOnBoardingValue() {
    try {
      return AsyncStorage.getItem("onBoard").then((value) => {
        return value;
      });
    } catch (error) {
    }
  },

  setCallTime(time) {
    AsyncStorage.setItem("lastTime", JSON.stringify(time));
  },

  getCallTime() {
    try {
      return AsyncStorage.getItem("lastTime").then((time) => {
        return time;
      });
    } catch (error) {
    }
  },

  setStopTimeData(data) {
    AsyncStorage.setItem("StopTimeData", JSON.stringify(data));
  },

  getStopTimeData() {
    try {
      return AsyncStorage.getItem("StopTimeData").then((res) => {
        return res;
      });
    } catch (e) {
    }
  },
  setLocationData(data) {
    AsyncStorage.setItem("locationData", JSON.stringify(data));
  },

  getLocationData() {
    try {
      return AsyncStorage.getItem("locationData").then((res) => {
        return res;
      });
    } catch (e) {
    }
  },

  setFavLocations(list) {
    AsyncStorage.setItem("favList", JSON.stringify(list));
  },
  getFavList() {
    try {
      return AsyncStorage.getItem("favList").then((list) => {
        return list;
      });
    } catch (error) {
    }
  },
  setFavRegion(list) {
    AsyncStorage.setItem("FavRegion", JSON.stringify(list));
  },
  getFavRegion() {
    try {
      return AsyncStorage.getItem("FavRegion").then((list) => {
        return list;
      });
    } catch (error) {
    }
  },

  clearData() {
      disconnectSocket();
      _BackgroundTimer.clearInterval(intervalRef.current);

    try {
      
      _BackgroundTimer.stop()
      // Radar.off('events');
      this.getAppLanguage().then(response => {
        if (response !== null) {
          AsyncStorage.clear();
          this.setAppLanguage(JSON.parse(response))
          AsyncStorage.setItem('radarBackTask', JSON.stringify('added'))
          AsyncStorage.setItem('isStarted',JSON.stringify(true))


        } else {
          AsyncStorage.clear();
          this.setAppLanguage("en")
          AsyncStorage.setItem('radarBackTask', JSON.stringify('added'))
          AsyncStorage.setItem('isStarted',JSON.stringify(true))

        }
      });

    } catch (e) {
      console.log(e);
    }
  },
};
module.exports = DataManager;
