const { Platform } = require("react-native");

const fontFamily = {
  regular: Platform.OS=='ios'?"OpenSans":"OpenSans-Regular",
  bold: "OpenSans-Bold",
  semiBold: "OpenSans-Semibold",
  light: "OpenSans-Light",
  museo_500: Platform.OS=='ios'?"Museo":'museo-500-webfont'
};

module.exports = {
  fontFamily
};
