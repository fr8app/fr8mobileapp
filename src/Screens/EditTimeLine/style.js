import { StyleSheet } from "react-native";
import DeviceInfo from "react-native-device-info";

export default StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  phoneNumberView: {
    width: "80%",
    height: "100%",
    alignSelf: "center",
  },
  phoneNumberInputView: {
    flex: 0.4,
    marginTop:40
  },
  phoneSubmitView: {
    flex: 0.2,
    justifyContent: "center"
  },
  updateButton: {
    justifyContent: 'center',
    marginTop: 20
  }
});
