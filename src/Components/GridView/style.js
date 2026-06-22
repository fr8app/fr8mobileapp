import { Dimensions, StyleSheet } from "react-native";
import { AppColor, AppFontFamily } from './../../Themes';

const styles = StyleSheet.create({
    gridView: {
    //   marginTop: 10,
      flex: 1,
      // backgroundColor:'red'
    },
    itemContainer: {
      justifyContent: 'flex-end',
      borderRadius: 1,
    //   padding: 10,
      height: Dimensions.get('screen').width/3.4,
    },
    itemName: {
      fontSize: 16,
      color: '#fff',
      fontWeight: '600',
    },
    itemCode: {
      fontWeight: '600',
      fontSize: 12,
      color: '#fff', 
    },
    userPostsText:{
        
        color: AppColor.colors.twoTwo,
        fontFamily: AppFontFamily.fontFamily.semiBold,
        fontSize: 18,
    },
  });

  export default styles