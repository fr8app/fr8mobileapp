import I18n from 'react-native-i18n';
import React from 'react';
import {Dimensions, Text, View} from 'react-native';
import { FlatGrid } from 'react-native-super-grid';
import styles from './style'
import FriendImage from './friendImage';
export const GridView =(props)=>{
  

 const renderItem=({item,index})=>{
   console.log('itemdfsjfdhfdhdf',item);
   return(
   
    
     <FriendImage
     isTimeline={props.isTimeline}
     onPress={()=>props.onPostPress(item)}
     item={item}/>
   )
 }
      
return(
    <>
   
    <FlatGrid
    ListEmptyComponent={props?.ListEmptyComponent}
    contentContainerStyle={{paddingBottom:20}}
    ListHeaderComponent={props.headerComponent()}
    additionalRowStyle={{}}
    // style={{backgroundColor:'red'}}
    // bounces={false}
    showsVerticalScrollIndicator={false}
    refreshing={props.refreshing}
    
    onRefresh={()=>props.refreshControl()}
          nestedScrollEnabled={true}

    // numColumns={3}
    itemDimension={Dimensions.get('screen').width/3.8}
    data={props.data}
    // style={styles.gridView}
    // staticDimension={300}
    // fixed
    spacing={5}
    renderItem={renderItem}
    onEndReachedThreshold={0.1}
            onEndReached={() => {
              
                props.setPagination();
                
            }}
           
  />
  </>
)

}