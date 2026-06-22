import { StyleSheet, Dimensions } from 'react-native'
import { AppFontFamily } from './../../Themes';
const height = Dimensions.get('screen').height
const width = Dimensions.get('screen').width
export default StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    textStyle: {
        fontFamily: AppFontFamily.fontFamily.regular,
        fontSize: 20
    },
    map: {
        flex: 1,
        width: "100%",
    },
    marginTop40: {
        position: 'absolute',
        bottom: 0
    },
    image: {
        height: '100%',
        width: Dimensions.deviceWidth,

    },
    button: {
        borderRadius: 14,
        height: 50
    },
    text: {
        color: '#000',
        fontSize: 16,
        fontFamily: AppFontFamily.fontFamily.regular,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    detailStyle: {
        paddingHorizontal: 2,
        justifyContent: 'center',
        backgroundColor: '#29a2e1',
        flex: 1,
    },
    cammeraContainer: {
        width: '90%',
        height: 80,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    dataTextStyle: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30,
        fontFamily: AppFontFamily.fontFamily.regular,
    },
    textHeading: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
        fontFamily: AppFontFamily.fontFamily.regular,
        marginTop: 10,
        textAlign: 'center'
    },
    buttonContainer: {
        marginHorizontal: 10,
        paddingBottom: 30,
        marginTop: '20%',
    },
    cammeraStyle: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        marginLeft: 15
    },
    imagesStyle: {
        height: width * 0.33,
        width: width * 0.33,
        borderRadius: 10
    },
    imagesStyle2: {
        height: width * 0.22,
        width: width * 0.22,
        borderRadius: 10
    },
    imagesTouchable: {
        width: width * 0.33,
        marginLeft: 10,
        borderRadius: 10,
        paddingTop: 10,
    },
    imagesTouchable2: {
        width: width * 0.25,
        borderRadius: 10,
        paddingTop: 10,
    },
    crossButton: {
        position: 'absolute',
        right: -10,
        top: -1,
        zIndex: 1,
        backgroundColor: '#29a2e1',
        height: 25,
        width: 25,
        borderRadius: 12.5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    interEqueImages: {
        width: 80,
        position: "absolute",
        alignSelf: 'center',
        height: 80,
        borderRadius: 5
    },
    buttonInterEquep:
    {
        marginTop: 10,
        alignSelf: 'center',
        borderRadius: 10,
        shadowColor: 'black',
        shadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        shadowRadius: 3,
        shadowOpacity: 0.4,
        backgroundColor: '#fff',
        elevation: 5,
    }
})


