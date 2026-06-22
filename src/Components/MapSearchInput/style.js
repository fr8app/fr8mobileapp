import { StyleSheet, Dimensions } from 'react-native'

const {width, height} = Dimensions.get('screen')
export default StyleSheet.create({
    mainWrapper: {
        width: width-60,
        height: 50,
        marginLeft: 30,
        marginTop: 10,
        backgroundColor:'rgba(50,50,50,0.8)',
        flexDirection: 'row',
        borderRadius:10,
        
        
    }
})