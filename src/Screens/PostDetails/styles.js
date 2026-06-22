import { StyleSheet } from 'react-native'
import { AppColor, AppFontFamily } from './../../Themes';
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: AppColor.colors.white
    },
    userView: {
        flexDirection: 'row',
        alignItems: "center",
        width: "100%",
        //  backgroundColor:'red'
    },
    userImage: {
        width: 65,
        height: 65,
        borderRadius: 65 / 2
    },
    userPostsText: {
        // marginTop:30,
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15
    },
    videoImage: {
        marginTop:10,
        width: "100%",
        height: 170
    },
    rowEndView: {
        flexDirection: 'row',
        alignSelf: "flex-end",
        marginTop:10,
        
    },
    countText:{
        color: AppColor.colors.sixThree,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 14,  
    },
    rowView:{
       flexDirection:"row"
    },
    postNameText:{
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 15,
    },
    likeButton:  { flexDirection: "row",alignItems:'center', justifyContent: 'space-around', flex: 1 }
})