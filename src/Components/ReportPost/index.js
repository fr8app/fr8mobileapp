import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily } from './../../Themes';
import { TextInput } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n'
const ReportPost = props => {
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
      onRequestClose={() => { console.log('close modal') }}>

      <TouchableOpacity style={styles.modalBackground} onPress={anyTap}>
        <View style={styles.container}>
          <Text style={styles.languageText}>{I18n.t('Report_Post')}</Text>

          <View style={styles.lineView} />

          <TextInput
          style={styles.textInputContainer}
            placeholder={I18n.t('reasonOfReport')}
            placeholderTextColor={AppColor.colors.white}
            multiline={true}
            keyboardType={'ascii-capable'}
            onChangeText={onChangeText}
          />

          <View style={styles.bottomButtonView}>
            <TouchableOpacity style={styles.cancelButton} onPress={caneclButton}>

              <Text style={styles.languageSeleceted}>{I18n.t('Cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={submitButton}>

              <Text style={styles.languageSeleceted}>{I18n.t('Submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>


      </TouchableOpacity>
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
    width: Dimensions.deviceWidth - 60 ,
    backgroundColor: AppColor.colors.darkBlue,
    alignItems: 'center',
    borderRadius:5
  },
  lineView: {
    backgroundColor: AppColor.colors.white,
    height: 1,
    width: Dimensions.deviceWidth - 60,
    marginTop: 25
  },
  languageText: {
    marginTop: 35,
    color: AppColor.colors.white,
    fontSize: 18,
    fontFamily: AppFontFamily.fontFamily.semiBold,
    // fontWeight:"400"
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
    color: AppColor.colors.white,
    fontSize: 15,
    fontFamily: AppFontFamily.fontFamily.regular
  },
  bottomButtonView: {
    flexDirection: "row",
    width: Dimensions.deviceWidth - 130,
    justifyContent: 'space-between',
    marginTop: 50,
    marginBottom: 30
  },
  cancelButton: {
    borderRadius: 2,
    borderWidth: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderColor: AppColor.colors.white
  },
  textInputContainer:{
    marginTop:40,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 14,
    paddingBottom: 14,
    height: 120,
    fontFamily:AppFontFamily.fontFamily.regular,
    color: AppColor.colors.white,
    fontSize: 16,
    width: Dimensions.deviceWidth - 100,
    borderColor: AppColor.colors.white,
    borderRadius: 5,
    borderWidth: 1,
    textAlignVertical:"top"

  }
});

module.exports = ReportPost