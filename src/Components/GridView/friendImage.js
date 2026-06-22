import {CachedImage} from '../react-native-cached-image-master';
import React from 'react';
import { Dimensions, Text, TouchableOpacity, View,Image } from 'react-native';
import styles from './style';
import { imageBaseUrl } from '../../Config';
import  Icon  from 'react-native-vector-icons/Ionicons';

const FriendImage = ({
    params,
    item,
    isTimeline,
    onPress
}) => (
    <TouchableOpacity
    onPress={()=>onPress()}
    style={[styles.itemContainer]}>
      {isTimeline?
         <Image
         style={styles.itemContainer}
       source={{uri:imageBaseUrl+item.image}}
       />
      :


        item.media_type=='text'?
        <View>
    <CachedImage
    style={styles.itemContainer}
  source={require('../../Images/bg2.png')}
  />
  <Image
    resizeMode='contain'
    style={{height:20,width:20,position:'absolute',bottom:10,right: 5,}}
  source={require('../../Images/T.png')}
  />
    </View>
    
        :
          <CachedImage
          style={styles.itemContainer}
        source={{uri:item?.route_post?imageBaseUrl+item.route_post.image:item?.images?.length>0?imageBaseUrl+ item.images[0].url:item.thumbnail_image?imageBaseUrl+ item.thumbnail_image:""}}
        />
}
        {
            isTimeline?
            <Icon
            size={20}
            color='#fff'
            style={{position:'absolute',right:5,bottom:5}}
            name={'md-images'}/>
            :

            item.thumbnail_image&&item.images.length==0&&!item.route_post?
            <Icon
        size={20}
        color='#fff'
        style={{position:'absolute',right:5,bottom:5}}
        name={'play'}/>
            :
            
            item.route_post?
            item.route_post?.medias?.length>0 || item.route_post?.route_media?.length>0?
            <Icon
        size={20}
        color='#fff'
        style={{position:'absolute',right:5,bottom:5}}
        name={'md-images'}/>:null
        :
        item.images.length>0&&item.thumbnail_image?
        <Icon
        size={20}
        color='#fff'
        style={{position:'absolute',right:5,bottom:5}}
        name={'md-images'}/>
        :
        item.images.length>1?
        <Icon
        size={20}
        color='#fff'
        style={{position:'absolute',right:5,bottom:5}}
        name={'md-images'}/>:null
        }
        
    </TouchableOpacity>
);

export default FriendImage;
