import { StyleSheet } from 'react-native'
import { AppFontFamily, AppColor, Dimensions } from './../../Themes';


export default StyleSheet.create({
    container: {
        height: '100%',
        width: '100%'
    },
    button: {
        marginLeft:10,
        width:100,
        borderRadius: 14,
        height: 50
    },
    mainContainer: {
        width: "100%",
        backgroundColor: '#0d131c',
        borderTopColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c'
    },
    userView: {
        flexDirection: 'row',
        width: "100%",
        borderBottomColor: '#3b3b3c',
        borderLeftColor: '#3b3b3c',
        borderRightColor: '#3b3b3c',
        margin: 10
    },
    userImage: {
        width: 45,
        height: 45,
        borderRadius: 45 / 2
    },
    userPostsText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        textAlign: 'center',
        marginLeft: 15,
    },
    descriptionText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 16,
        marginLeft: 15,
        textAlign: "left",
        marginBottom: 20,
        marginHorizontal: 20
    },
    sharedByText: {
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.regular,
        marginLeft: 15,
        fontSize: 14,
        fontWeight: '500',
        textAlign: "left",
        marginHorizontal: 20
    },
    dateTimeText: {
        fontFamily: AppFontFamily.fontFamily.regular,
        marginLeft: 15,
        textAlign: "left",
        flex: 1,
        fontSize: 12,
        color: 'gray'
    },
    userName: {
        textAlign: "left",
        flex: 1,
        width: '95%',
        marginLeft: 15,
        fontWeight: 'bold'
    },
    postImage: {
        width: Dimensions.deviceWidth,
        height: (Dimensions.deviceWidth) / 2,
    },
    lineView: {
        width: "100%",
        height: 0.5,
        backgroundColor: AppColor.colors.placeHolder,
        marginTop: 20
    },
    postImageView: {
        overflow: 'hidden',
    },
    textInput: {
        paddingRight:10,
        paddingVertical: 10,
        fontFamily: AppFontFamily.fontFamily.regular,
        color: AppColor.colors.placeHolder,
        fontSize: 16,
        width: "80%",
        // minHeight: Dimensions.deviceHeight * 0.06,
        // maxHeight: Dimensions.deviceHeight * 0.06,
    },
    imageView: {
        width: 55,
        height: 55,
        backgroundColor: AppColor.colors.darkBlue,
        justifyContent: "center",
        alignItems: "center",
    },
    sendImage: {
        width: 22, height: 22
    },
    bottomView: {
        width: Dimensions.deviceWidth,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: Dimensions.deviceHeight * 0.068,
        // position: 'absolute',
        bottom: 0,
        borderTopWidth: 0.5,
        borderTopColor: 'silver'
    },
    flatListComment: {
        marginBottom: '5%',
        marginTop: 5
    },
    inputToolbar:
    {
        alignSelf:'center',
        borderRadius:10,
        borderWidth:1,
        borderColor:AppColor.colors.placeHolder,
        marginTop:20,
        justifyContent: 'center',
        maxHeight: Dimensions.deviceHeight * 0.086,
        width: Dimensions.deviceWidth * 0.85,
        paddingVertical:4
    },
    buttonView:{
        flexDirection:'row',
        justifyContent:'flex-end',
        // marginTop:10,
        alignItems:'center',
        alignSelf:'center',
        marginTop:'8%',
        // height:'10%',
        // backgroundColor:'red',
        width: Dimensions.deviceWidth * 0.85,
        // alignItems:'flex-end',
    },
    image: {
        borderRadius: 45 / 2,
        height: 45,
        width: 45,
    },
    nameView: {
        justifyContent: 'center',
        width: '85%'
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    cacheImage: {
        width: 50,
        overflow: 'hidden',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 25,
        alignSelf: 'center'
    },
    imageUpperView: {
        position: 'absolute',
        width: '100%'
    },
    imageUpperTimeView: {
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    endTimeView: {
        flexDirection: 'row',
        marginRight: 15
    },
    dotView:{
            position: 'absolute',
            alignItems: 'center',
            alignSelf: 'center',
            bottom: 10,
    },
    readMore: {
        color: '#29a2e1',
        marginTop: 5
    },
    with: {
            textAlign: "left",
            flex: 1,
            fontWeight: 'normal',
            lineHeight: 18,
            
    },
    noComment: {
        height:Dimensions.deviceHeight * 0.7,
        width: Dimensions.deviceWidth,
        justifyContent: 'center'
    },
    commentCreator: {
        
        width: '15%',
        alignItems: 'center',
        marginTop: 20
    },
    viewPager: {
        flex: 1,
        width: Dimensions.deviceWidth,
        flexGrow: 1
    }

})