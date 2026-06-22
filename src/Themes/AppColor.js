const { Platform } = require("react-native")

const colors = {
    "white": "#fff",
    "black": "#000",
    "placeHolder": "#999999",
    "imageBackground": "#dcdcdc",
    "darkBlue": "#115682",
    // "lightBlue":Platform.OS=='android'?'#289edd': "#29a2e1",
    "lightBlue": Platform.OS == 'android' ? '#29a2e1' : "#29a2e1",
    "sixThree": "#636363",
    "twoTwo": "#222222",
    "fourSeven": "#474747",
    "threeOne": "#313131",
    "opacitiveBlack": "rgba(0,0,0,0.5)",
    "inputColor": "#3c3b3b",
    "matalicBlue": "#32527b"
}
module.exports = {
    colors
}