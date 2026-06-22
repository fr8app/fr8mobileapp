import React, { Component } from "react";
import { StyleSheet, Platform } from "react-native";
// import { AppDimensions, AppConstantFontFamily } from './../../CustomComponent';
// import AppConstantColor from "../../CustomComponent/Constants/AppConstantColor";
import { AppColor, AppFontFamily } from "./../../Themes";

export default StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    // backgroundColor: '#fff',
    // paddingBottom: 15,
    // paddingTop: 15,
    justifyContent: "center",
    position: "absolute"
  },

  container: {
    flex: 1,
    alignSelf: "center",
    // width: AppDimensions.deviceWidth - 80,
    alignItems: "center"
  },
  input_View: {
    alignItems: "center",
    width: "100%",
    borderRadius: 5,
    flexDirection: "row",
    // backgroundColor: "red",
    justifyContent: "space-between",
    marginTop:60
  },
  input_style: {
    height: 40,
    width: 30,
    // color: AppConstantColor.COLORS.three_three,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 18,
    alignSelf: "center",
    textAlign: "center",
    borderRadius: 5,
    // padding:-10,
    // paddingLeft: 10,
    borderWidth: 0.5,
    backgroundColor: AppColor.colors.white,
    // marginTop:-100,
    // marginHorizontal: 10,
    color:"#000"
  },

  titleStyle: {
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    fontSize: 16,
    // textAlign: "center",
    paddingVertical: 10
    // backgroundColor: "red"
  },
  otpSubmitView: {
    width: "90%",
    flex: 0.1,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20
  },
  inputCompleteView: {
    alignItems: "center",
    flex: 0.6,
    justifyContent: "flex-end"
  }
});
