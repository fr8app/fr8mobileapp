import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily,AppImages } from '../../Themes';
import { TextInput } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n'
import { imageBaseUrl } from '../../Config';
const RemoveFriend = props => {
  const {
    loading,
    anyTap,
    caneclButton,
    submitButton,
    onChangeText,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => props.onClose()}
      >

      <View style={styles.modalBackground} >
        <View style={styles.container}>
          <Image
          style={styles.userImage}
          source={props.userDetail?.profile||props.userDetail?.image? {uri:imageBaseUrl+[props.userDetail?.profile?props.userDetail?.profile:props.userDetail?.image]}:AppImages.images.user01}
          />
          <Text style={[styles.languageText,{fontFamily: AppFontFamily.fontFamily.regular}]}>
            <Text style={[styles.languageText,{fontFamily: AppFontFamily.fontFamily.semiBold,}]}>
            {I18n.t('Remove_Friend')}
            </Text>
            <Text numberOfLines={1} style={[styles.languageText,{fontFamily: AppFontFamily.fontFamily.bold}]}>

            {" "+props?.userDetail?.userName+"?"}
            </Text>
            </Text>

          {/* <View style={styles.lineView} /> */}

          <View style={styles.bottomButtonView}>
          <TouchableOpacity style={styles.cancelButton} onPress={submitButton}>

<Text style={[styles.languageSeleceted,{color:'#29a2e1'}]}>
{I18n.t('Remove_Friend')}


</Text>
</TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={caneclButton}>

              <Text style={styles.languageSeleceted}>{I18n.t('Cancel')}</Text>
            </TouchableOpacity>

            
          </View>
        </View>


      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: "rgba(0,0,0,0.7)"
  },
  container: {
    width: Dimensions.deviceWidth - 40 ,
    backgroundColor: AppColor.colors.white,
    alignItems: 'center',
    borderRadius:20
  },
  lineView: {
    backgroundColor: AppColor.colors.black,
    height: 1,
    width: Dimensions.deviceWidth - 60,
    marginTop: 25
  },
  languageText: {
    marginTop: 12,
    color: AppColor.colors.black,
    fontSize: 18,
    // fontFamily: AppFontFamily.fontFamily.semiBold,
  },
  languageButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignSelf: "center",
    alignItems: 'center',
  },
  radioIcon: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  languageSeleceted: {
    paddingBottom:4,
    color: AppColor.colors.black,
    fontSize: 18,
    fontFamily: AppFontFamily.fontFamily.semiBold
  },
  bottomButtonView: {
    // flexDirection: "row",
    width: Dimensions.deviceWidth - 40,
    justifyContent: 'space-between',
    marginTop: 18,
    // marginBottom: 30
  },
  cancelButton: {
    alignItems:'center',
    borderRadius: 2,
    borderTopWidth: 0.7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 16,
    borderColor: "silver"
  },
  textInputContainer:{
    marginTop:20,
    paddingLeft: 5,
    paddingRight: 5,
    // paddingTop: 14,
    paddingBottom: 14,
    height: 120,
    fontFamily:AppFontFamily.fontFamily.regular,
    color: AppColor.colors.black,
    fontSize: 16,
    width: Dimensions.deviceWidth - 80,
    borderColor: AppColor.colors.black,
    borderRadius: 5,
    borderWidth: 0.6,
    textAlignVertical:"top"

  },
  userImage: {
    marginTop:25,
    width: 80,
    height: 80,
    borderRadius: 80 / 2
},
});

module.exports = RemoveFriend