import { StyleSheet } from 'react-native';
import DeviceInfo from 'react-native-device-info';
export default StyleSheet.create({
    headUser: {
        width: '100%',
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    userImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    editStyle: {
        backgroundColor: '#29a2e1',
        width: '95%',
        height: 40,
        alignItems: 'center',
        marginLeft: 10,
        justifyContent: 'center',
        marginBottom: 40,
        marginTop: 10
    },
    box: {
        height: 100,
        marginHorizontal: 10,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        flexDirection: 'row',
    },
    line: {
        width: '100%',
        height: 50,
        alignItems: 'center'
    },
    social: {
        marginHorizontal: 60,
        marginTop: DeviceInfo.hasNotch() ? 50 : 10,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }
})