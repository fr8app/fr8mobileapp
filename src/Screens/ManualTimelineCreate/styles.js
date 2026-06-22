import { StyleSheet,Dimensions, Platform } from 'react-native'
import { colors } from '../../Themes/AppColor';
import { AppColor, AppFontFamily, } from './../../Themes';

const {height,width}=Dimensions.get('screen')
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    customMainView:{
        height:50,
        marginTop:'5%',
        // backgroundColor:'red',
        marginBottom:0,
        marginVertical:0
    },
    customContainerInputImage:{
        // backgroundColor:'green',
        marginTop:0,
        marginBottom:0,
        borderBottomWidth:1,
        borderColor:'gray',
        borderWidth:0,
        borderRadius:0
    },
    icon: {
        height: 30,
        width: 30,
        // alignSelf: 'center',
        // tintColor: colors.lightBlue
    },
    iconText: {
        marginLeft:10,
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    checkIn:{
        // zIndex:99999,
        marginHorizontal:20,
        // marginVertical:20,
        // backgroundColor:'lightgray',
        // padding:10,
        marginTop:10,
        alignItems:'center',
        borderRadius:5,
        flexDirection:'row'
    },
    imagesStyle: {
        height: Platform.OS=='ios'?width*0.33: width * 0.3,
        width: Platform.OS=='ios'?width*0.33:width * 0.3,
        borderRadius: 10
    },
    imagesTouchable: {
        width: width * 0.33,
        marginLeft: 20,
        borderRadius: 10,
        paddingTop: 10,
    },
    crossButton: {
        position: 'absolute',
        right: Platform.OS=='android'?1:-10,
        top: Platform.OS=='android'?1: -1,
        backgroundColor: '#29a2e1',
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonContainer: {
        bottom:0,
        marginHorizontal: 20,
        //  justifyContent: 'flex-end',
        paddingBottom: 30,
        marginTop: '20%',
        //    backgroundColor:'red'
    },
    button: {
        borderRadius: 14,
        height: 50
    },

})