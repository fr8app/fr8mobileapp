/**
 * @format
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import { AppRegistry, DeviceEventEmitter, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import KeyboardManager from 'react-native-keyboard-manager';
import _BackgroundTimer from 'react-native-background-timer';
import { intervalRef, socket } from './src/Config/socket';
import moment from 'moment';
import DataManager from './src/Components/DataManager';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';

console.disableYellowBox = true;

if (Platform.OS == "ios") {
  KeyboardManager.setEnable(true);
  KeyboardManager.setEnableDebugging(false);
  KeyboardManager.setKeyboardDistanceFromTextField(70);
  // KeyboardManager.setPreventShowingBottomBlankSpace(true);
  KeyboardManager.setEnableAutoToolbar(true);
  KeyboardManager.setToolbarDoneBarButtonItemText("Done");
  KeyboardManager.setToolbarManageBehaviourBy(0);
  KeyboardManager.setToolbarPreviousNextButtonEnable(false);
  KeyboardManager.setShouldToolbarUsesTextFieldTintColor(false);
}
var socketFeildArray = [];
var socketGlobalData = {
  latitude: 0,
  longitude: 0,
  latitudeDelta: 0,
  longitudeDelta: 0,
};
let timeOut = null;

//forground service in androd
let HeadlessTask = async (event) => {
  try {
    let userData = await DataManager.getUserDetails();
    let jsonData = await JSON.parse(userData);

    let dummyData = await DataManager.getDummyUserDetails()
    _BackgroundTimer.clearInterval(intervalRef.current);
    if (event.name == 'location' || event.name == 'stationary') {
      socketGlobalData = event?.params;
      socketFeildArray = [...socketFeildArray, {
        latitude: event?.params?.latitude,
        longitude: event?.params?.longitude
      }]
      if (socket.connected == false) {
        console.log('disconnected');
        socket.connect();
      } else {
        if (timeOut == null) {
          timeOut = _BackgroundTimer.setTimeout(() => {
            socket.emit("save_lat_long", {
              user_id: jsonData?.data?._id ? jsonData?.data?._id : dummyData?.data?.userId,
              longitude: socketGlobalData?.longitude,
              latitude: socketGlobalData?.latitude,
              date: moment().utc().toISOString(),
              fieldArray: socketFeildArray,
            });
            socketFeildArray = [
              {
                latitude:
                  socketFeildArray.length > 0
                    ? socketFeildArray[socketFeildArray.length - 1].latitude
                    : socketGlobalData?.latitude,
                longitude:
                  socketFeildArray.length > 0
                    ? socketFeildArray[socketFeildArray.length - 1].longitude
                    : socketGlobalData?.longitude,
              },
            ];
            _BackgroundTimer.clearTimeout(timeOut)
            timeOut = null
          }, 8000)
        }
      }
    }


  } catch (e) {
    console.log("error is", e);

  }
}
if (Platform.OS == 'android') {
  BackgroundGeolocation.headlessTask(HeadlessTask);
}

AppRegistry.registerComponent(appName, () => App);
