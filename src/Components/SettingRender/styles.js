import { StyleSheet } from 'react-native'
import {AppColor, AppFontFamily} from '../../Themes';

export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection:"row",
        paddingTop:10,
        paddingBottom:10,
        justifyContent:"space-between",
        alignItems:"center",
        // borderBottomWidth:0.8,
        // borderBottomColor:AppColor.colors.placeHolder
    },
    rightImage:{
        width:22,
        height:22
    },
    lineView:{
        width:"100%",
        height:0.55,
        backgroundColor:AppColor.colors.placeHolder
    },
    tittleText:{
        color: AppColor.colors.black,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
    }
})