import React, { Component, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  Text,
  TouchableOpacity,
  StatusBar,
  Image,
  Keyboard,
  Platform,
} from 'react-native';
import { Dimensions, AppColor, AppFontFamily } from '../../Themes';
import { TextInput } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n'
import Button from '../Button'
import { AirbnbRating } from 'react-native-ratings'
export const ReviewModal = props => {
  const {
    loading,
    anyTap,
    caneclButton,
    submitButton,
    onChangeText,
    selectedStar,
    value,
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

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => Keyboard.dismiss()}
        style={styles.modalBackground} >

        <TouchableOpacity
          onPress={() => Keyboard.dismiss()}
          activeOpacity={1} style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              props.caneclButton()
              setSelectedStar(selectedStar)
            }}
            activeOpacity={0.7}
            style={{ position: 'absolute', right: "-5%", top: '-5%' }}>
            <Image resizeMode='contain' style={{ height: 50, width: 50 }} source={require('../../Images/cross.png')} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={[styles.languageText, { textAlign: 'center', paddingHorizontal: 30, fontFamily: AppFontFamily.fontFamily.regular, }]}>
            <Text numberOfLines={1} style={[styles.languageText, { fontFamily: AppFontFamily.fontFamily.semiBold }]}>
              {I18n.t("Rate & Review")}
            </Text>

          </Text>
          <View style={{ flexDirection: 'row', alignSelf: 'center', marginVertical: 30 }}>
            {/* {starts.map((x, index) => {
              return (
                <View style={{ color: "white" }}>
                <TouchableOpacity
                  onPress={() => { setSelectedStar(x) }}
                  activeOpacity={1}
                >
                  <Image 
                  resizeMode='cover'
                   source={
                    Platform.OS=='ios'?
                    selectedStars ? selectedStars >= x ? require('../../Images/star.png') : require('../../Images/starWhite.png') : require('../../Images/starWhite.png')
                    :
                    selectedStars ? selectedStars >= x ? require('../../Images/circleImages/VectorAF.png') : require('../../Images/circleImages/VectorAW.png') : require('../../Images/circleImages/VectorAW.png')
                    } style={{height:40,width:40, marginHorizontal: 5 }} />
                </TouchableOpacity>
                </View>
              )
            })} */}
            <AirbnbRating
              count={5}
              showRating={false}
              defaultRating={5}
              size={40}
              starContainerStyle={{ width: Dimensions.deviceWidth - 160, justifyContent: 'space-around' }}
              onFinishRating={(n)=>setSelectedStar(n)}
            />
            {/*             
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/star.png')} style={{ marginHorizontal: 5 }} />
            <Image source={require('../../Images/starWhite.png')} style={{ marginHorizontal: 5 }} /> */}
          </View>
          {/* <View style={styles.lineView} /> */}

          <TextInput

            value={value?.trimLeft()}
            style={[styles.textInputContainer]}
            placeholder={I18n.t("Write Your Review")}
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
                  submitButton(selectedStars ? selectedStars : selectedStar)

                  setTimeout(() => {
                    setSelectedStar(5)
                  }, 200);
                }}
                Text={I18n.t('Submit')}
                customStyles={{ container: [styles.button, { borderRadius: 10 }] }}
              />
            </View>
          </View>
        </TouchableOpacity>


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
