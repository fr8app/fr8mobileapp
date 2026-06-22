import React, { Component } from "react";
import { StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from "./../../Themes";

export default StyleSheet.create({
  mainContainer: {
    height: "100%",
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    paddingTop:'20%'
    // justifyContent: "center"
  },

  container: {
    flex: 1,
    alignSelf: "center",
    alignItems: "center"
  },
  input_View: {
    alignContent: "flex-start",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  input_style: {
    height: 40,
    width: "100%",
    fontSize: 18,
    alignSelf: "flex-start",
    textAlign: "center",
    borderWidth: 0.5,
    borderRadius: 5,
    borderColor: AppColor.colors.black,
    backgroundColor: AppColor.colors.white
  },

  titleStyle: {
    color: AppColor.colors.white,
    fontFamily: AppFontFamily.fontFamily.semiBold,
    fontSize: 16,
    textAlign: "center",
    paddingVertical: 10
  },
  otpSubmitView: {
    width: "90%",
    flex: 0.4,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20
  },
  inputCompleteView: {
    alignItems: "center",
    marginTop:20
    // flex: 0.5,
    // justifyContent: "flex-end"
  }
});
