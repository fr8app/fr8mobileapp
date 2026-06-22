import I18n from 'react-native-i18n';
import React, { Component } from 'react';
import { View, Image, Text, ImageBackground, NativeModules, PermissionsAndroid, Platform, Dimensions, ScrollView, StatusBar } from 'react-native';
import { check, PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { Button, DataManager, FetchApi } from '../../Components'
import styles from './style'
class UseLocation extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };
  constructor(props) {
    super(props);
    this.state = {
      videoLoad: false,
      modalVisible: false
    }
  }
  dummy = async () => {
    try {
      const checkResult = await check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION);
      switch (checkResult) {
        case RESULTS.UNAVAILABLE:
          requestMultiple([
            PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
            PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
          ])
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
            PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION // or PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION
          ])
          // The permission is denied and not requestable anymore -> App settings
          // setTimeout(showGoToSettingsAlert, 1000);
          break;
      }
    } catch (error) {
      console.warn(error);
    }
  };


  render() {
    return (
      <View style={[styles.mainContainer, { alignItems: 'center' }]}>
        <StatusBar backgroundColor='#fff' />
        <Image source={require('../../Images/pin.png')} style={{ height: 40, width: 40, marginBottom: 10 }} />
        <Text style={[styles.textStyle, { fontSize: 24, fontWeight: 'bold' }]}>
          {I18n.t('useLocation')}
        </Text>
        <Text style={[styles.textStyle, { textAlign: 'center', paddingHorizontal: 20, fontSize: 16, paddingVertical: 20 }]}>
          {I18n.t('firstPermissionTitle')}
        </Text>
        <Text style={[styles.textStyle, { textAlign: 'center', paddingHorizontal: 20, fontSize: 16 }]}>
          {I18n.t('firstPermissionDesc')}
        </Text>
        <ImageBackground source={require('../../Images/map.png')} borderRadius={10} style={{ alignItems: 'center', justifyContent: 'center', height: Dimensions.get('screen').height * 0.25, width: Dimensions.get('screen').height * 0.25, marginVertical: 20 }} >
          <Image source={require('../../Images/pin.png')} style={{ height: 40, width: 40 }} />
        </ImageBackground>
        <View style={styles.bottom}>
          <View
            style={[{
              textAlign: 'center', justifyContent: 'center', alignItems: 'center', height: 50,
              width: '40%'
            }]}
          >
            <Text
              onPress={() => {
                this.props.navigation.replace('OnBoarding')
              }
              }
              style={[styles.textStyle, { color: '#29a2e1', fontSize: 16 }]}>
              {I18n.t('noThanks')}
            </Text>
          </View>
          <Button
            Text={I18n.t('turnOn')}
            onPress={() => {
              this.dummy()
              setTimeout(() => {
                this.props.navigation.replace('OnBoarding')
              }, 200);
            }}
            customStyles={{ container: styles.button }}
          />
        </View>
      </View>
    )
  }

}
export default UseLocation

