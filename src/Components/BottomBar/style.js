// import { StyleSheet, Dimensions } from 'react-native';
// import DeviceInfo from 'react-native-device-info';
// import { AppColor, AppFontFamily } from './../../Themes';
// const { width, height } = Dimensions.get('screen');

// const style = StyleSheet.create({
//     mainContainer: {
//         width,
//         height: DeviceInfo.hasNotch() ? 80 : 60,
        
        
//         flexDirection: 'row',
//         backgroundColor: '#29a2e1'
//     },
//     smallBox: {
//         width: width / 4,
//         // height:'100%',
//         alignItems: "center",
//         justifyContent: 'center',

//         // backgroundColor:'red'
//     },
//     smallBox1: {
//         width: '25%',
//         height: '100%',
//         // backgroundColor:'red',
//         alignItems: "center",
//         justifyContent: 'center',
//         borderTopColor: '#ffff',
//         borderTopWidth: 2,
//         // backgroundColor:'red'
//     },
//     text: { color: "white", fontSize: 11, fontFamily: AppFontFamily.fontFamily.regular, fontWeight: 'bold' }
// })
// export default style
import {StyleSheet,Dimensions} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { AppColor, AppFontFamily } from './../../Themes';
const {width,height} = Dimensions.get('screen');

const style = StyleSheet.create({
    text: { color: "white", fontSize: 11, fontFamily: AppFontFamily.fontFamily.regular, fontWeight: 'bold' },
    mainContainer: {
        width,
        height: DeviceInfo.hasNotch()? 80:60,


        flexDirection:'row',
        backgroundColor: '#29a2e1'
    },
    smallBox:{
        width:width/5,
        // height:'100%',
        alignItems:"center",
        justifyContent:'center',

        // backgroundColor:'red'
    },
    smallBox1:{
        width:'20%',
        height:'100%',
        // backgroundColor:'red',
        alignItems:"center",
        justifyContent:'center',
        borderTopColor:'#ffff',
        borderTopWidth:2,
        // backgroundColor:'red'
    }
})
export default style