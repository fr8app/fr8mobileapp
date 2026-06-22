import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Modal,
  StatusBar,
  ActivityIndicator,
  Platform,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { AppColor } from "./../../Themes";

const Loader = (props) => {
  const { whiteColor, loading, ...attributes } = props;

  return (
    // <Modal

    //   transparent={true}
    //   animationType={'none'}
    //   statusBarTranslucent={Platform.OS=='android'?false:false}
    //   visible={loading}
    //   onRequestClose={() => { console.log('close modal') }}>
    loading ? (
      <View
        style={[
          styles.modalBackground,
          { height: "100%", width: "100%", position: "absolute", zIndex: 999 },
        ]}
      >
        <View>
          {Platform.OS == "ios" ? (
            <StatusBar
              translucent
              barStyle="light-content"
              backgroundColor={AppColor.colors.lightBlue}
            />
          ) : null}

          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              color={whiteColor ? "#fff" : "#fff"}
              size={Platform.OS === "ios" ? 0 : 40}
              animating={loading}
            />
          </View>
        </View>
      </View>
    ) : null
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  activityIndicatorWrapper: {
    height: 100,
    width: 100,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

module.exports = Loader;
