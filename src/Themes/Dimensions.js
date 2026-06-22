import { Dimensions } from 'react-native';


const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;



module.exports = {
    deviceWidth,
    deviceHeight,
}