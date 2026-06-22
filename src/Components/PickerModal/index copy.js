import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
 Dimensions,
 Image,
  Modal,
  Linking,
  Platform
} from "react-native";
import  Button  from "../Button";

import styles from './styles';
import { AppConstantsSpanish, AppConstants, AppPortuguse, AppColor ,AppFontFamily} from "../../Themes";
import { TouchableOpacity } from "react-native";
import I18n from "react-native-i18n";
import { DeviceEventEmitter } from "react-native";
import  DeviceInfo  from "react-native-device-info";

export const PickerModal = (props) => {

  const [DropDownVisible,setDropDownVisible]=useState(false)
  const [isCloseableM,setIsCloseable]=useState(false)
  const [newVersion,setNewVersion]=useState(DeviceInfo.getVersion())

  const onOpen=()=>{
    setDropDownVisible(true)
  }

  const onClosePress=()=>{
    setDropDownVisible(false)
  }

  // useEffect(()=>{
  //   DeviceEventEmitter.addListener('appVersion', (e) => {
  //     console.log(e.mendatory, 'listener of appVersion')
  //     setIsCloseable(!e.mendatory)
  //     setNewVersion(Platform.OS=='android'?e?.android:e.ios)
  //     let AppVersion = DeviceInfo.getVersion();
  //     console.log('AppVersion < e?.ios',e?.ios,AppVersion,AppVersion < e?.ios)
  //     if (Platform.OS == 'android') {
  //       if (AppVersion < e?.android) {
  //         onOpen()
  //         // this.createTwoButtonAlert()
  //       }
  //     }
  //     if (Platform.OS == 'ios') {
  //       if (AppVersion < e?.ios) {
  //         onOpen()
  //         // this.createTwoButtonAlert()
  //       }
  //     }



  //   },()=>{
  //     DeviceEventEmitter.removeAllListeners()
  //   })
  // },[])

  const {
    isDropdownVisible,
    onClose,
    title,
    body,
    isCloseable,
    button1Text,
    button1Press,
    button2Press,
    button2Text
  } = props;

  return (
    <Modal
    onRequestClose={()=>{
      if(isCloseableM){
        setDropDownVisible(false)
      }
    }}
      animated
      transparent
      visible={DropDownVisible}
      animationType="fade"
    >
      <View
      
       style={{ flex: 1,
        justifyContent: 'flex-end',
        backgroundColor:'rgba(0,0,0,0.5)'
        }}>
          <TouchableOpacity
          style={{height:Dimensions.get('screen').height*0.6}}
          activeOpacity={1}
          onPress={()=>{
            if(isCloseableM){
              setDropDownVisible(false)
            }
          
          }
          }
          ></TouchableOpacity>
          

      <View style={{ 
        borderTopEndRadius:20,
        borderTopStartRadius:20,
        flexDirection: 'row', justifyContent: 'space-between',
        paddingTop:Dimensions.get('screen').height *0.015,
      paddingBottom:Dimensions.get('screen').height *0.025,backgroundColor:'#d8f0fd'}}>

            {
              isCloseableM&&
              <TouchableOpacity 
              style={{alignItems:'center',justifyContent:'center',position:'absolute',right:20,top:20,backgroundColor:'black',zIndex:99999,height:24,width:24,borderRadius:12}}
              onPress={()=>setDropDownVisible(false)}
              >
                <Image
                style={{height:10,width:10}}
                source={require('../../Images/close.png')}
                />
                </TouchableOpacity>
            }
              <View style={{ alignItems: 'center', justifyContent: 'center', width: Dimensions.get('screen').width }}>
                <Image
                source={require('../../Images/Login_logo.png')}
                style={{width:60,height:60}}
                resizeMode='contain'
                />
                <Text style={{
                  // backgroundColor:AppColor
                  
                  color: AppColor.colors.black,
                  fontFamily: AppFontFamily.fontFamily.museo_500,
                  fontSize: 18,
                }}>{'New Version '+newVersion}</Text>
                <Text style={{
                  // backgroundColor:AppColor
                  width:'70%',
                  marginTop:10,
                  textAlign:'center',
                  color: AppColor.colors.black,
                  fontFamily: AppFontFamily.fontFamily.museo_500,
                  fontSize: 15,
                }}>{ I18n.t('versionDescription')}</Text>
<View style={{ marginVertical:30,
        width:'70%',
        // flex: 0.075,
        alignItems: 'center',}}>
            <Button Text={'Update'} onPress={()=>
              {
                Linking.openURL(Platform.OS == 'android' ? 'https://play.google.com/store/apps/details?id=com.fr8' : 'https://apps.apple.com/in/app/the-fr8-app/id1562162277')}} />
          </View>



              </View>
            </View>  
      </View>
    </Modal>
  );
};
