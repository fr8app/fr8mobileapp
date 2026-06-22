import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily } from '../../Themes';
import { TextInput } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n'
import Button from '../Button'
export const ReviewModal = props => {
  const {
    loading,
    anyTap,
    caneclButton,
    submitButton,
    onChangeText,
    selectedStar,
    ...attributes
  } = props;
  const [selectedStars, setSelectedStar] = useState(null)


  useEffect(() => {
    setSelectedStar(selectedStar)
  }, [selectedStar])
  const starts = [1, 2, 3, 4, 5]
  return (
    <Modal
      statusBarTranslucent
      transparent={true}
      animationType={'none'}
      visible={loading}
      onRequestClose={() => {
        props.caneclButton()
        setSelectedStar(selectedStar)

      }}
    >

      <View style={styles.modalBackground} >

        <TouchableOpacity activeOpacity={1} style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              props.caneclButton()
              setSelectedStar(selectedStar)
            }}
            activeOpacity={0.7}
            style={{ position: 'absolute', right: "-5%", top: '-5%' }}>
            <Image source={require('../../Images/cross.png')} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={[styles.languageText, { textAlign: 'center', paddingHorizontal: 30, fontFamily: AppFontFamily.fontFamily.regular, }]}>
            <Text numberOfLines={1} style={[styles.languageText, { fontFamily: AppFontFamily.fontFamily.semiBold }]}>
              {I18n.t("Rate & Review")}
            </Text>

          </Text>
          <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 30 }}>
            {starts.map((x, index) => {
              return (
                <TouchableOpacity
                  onPress={() => { setSelectedStar(x) }}
                  activeOpacity={0.7}
                >
                  <Image source={selectedStars ? selectedStars >= x ? require('../../Images/star.png') : require('../../Images/starWhite.png') : require('../../Images/starWhite.png')} style={{ marginHorizontal: 5 }} />
                </TouchableOpacity>
              )
            })}
            {/*             
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/starWhite.png')} style={{ marginHorizontal: 5 }} /> */}
          </View>
          {/* <View style={styles.lineView} /> */}

          <TextInput
            style={[styles.textInputContainer]}
            placeholder={"Write your review"}
            placeholderTextColor={"silver"}
            multiline={true}
            keyboardType={'ascii-capable'}
            onChangeText={onChangeText}
            maxLength={500}
          />

          <View style={styles.bottomButtonView}>
            <View style={{ alignSelf: 'center', width: '50%', justifyContent: 'center', paddingBottom: 20 }}>
              <Button
                onPress={() => {
                  submitButton(selectedStars?selectedStars:selectedStar)
                }}
                Text={I18n.t('Submit')}
                customStyles={{ container: [styles.button, { borderRadius: 10 }] }}
              />
            </View>
          </View>
        </TouchableOpacity>


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
    width: Dimensions.deviceWidth - 80,
    backgroundColor: AppColor.colors.white,
    alignItems: 'center',
    borderRadius: 20
  },
  lineView: {
    backgroundColor: AppColor.colors.black,
    height: 1,
    width: Dimensions.deviceWidth - 60,
    marginTop: 25
  },
  languageText: {
    marginTop: 25,
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
    paddingBottom: 4,
    color: AppColor.colors.black,
    fontSize: 18,
    fontFamily: AppFontFamily.fontFamily.semiBold
  },
  bottomButtonView: {
    // flexDirection: "row",
    width: Dimensions.deviceWidth - 40,
    justifyContent: 'space-between',
    marginTop: 25,
    // marginBottom: 30
  },
  cancelButton: {
    alignItems: 'center',
    borderRadius: 0.4,
    borderTopWidth: 0.7,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 15,
    paddingBottom: 16,
    borderColor: 'silver',
  },
  textInputContainer: {
    paddingLeft: 10,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 14,
    height: 120,
    fontFamily: AppFontFamily.fontFamily.regular,
    color: AppColor.colors.black,
    fontSize: 16,
    width: Dimensions.deviceWidth - 110,
    borderColor: 'silver',
    borderRadius: 5,
    borderWidth: 1,
    textAlignVertical: "top"

  }
});
