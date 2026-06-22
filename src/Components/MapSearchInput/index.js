import React, {useState} from 'react';
import {View, TextInput,Image, Keyboard, TouchableOpacity } from 'react-native';
import {  AppImages} from './../../Themes';
import styles from './style';
import I18n from 'react-native-i18n'

const MapInput  = ({onChangeText,value,onChangeText1,onFocus,clearInput}) => {
    const [changeText, setChangeText]= useState('')
    return (
        <View style={[styles.mainWrapper,{alignItems:'center'}]}>
            
            <Image style={{width:20,height:20,margin:15, marginRight:10}}source={AppImages.images.search}/>
            <TextInput
            style={{ width:'80%',  color:'white'}}
            keyboardType="ascii-capable"
            returnKeyType={"done"}
            multiline={false}
            value={value}
            onSubmitEditing={()=>{onChangeText1(value)}}
            onChangeText={(e)=>{
                if(e.length===0){
                    Keyboard.dismiss() 
                    onChangeText(e)
                }else{
                    onChangeText(e)
                }
                
            }} 
            onFocus={()=>onFocus()}
            placeholderTextColor="#848283" 
            placeholder={I18n.t('Search_Terminal')}/>
           {value.length>0&& <TouchableOpacity
           onPress={()=>clearInput()}
           style={{marginRight:20,height:20,width:20,justifyContent:'center'}}>
            <Image resizeMode='cover' style={{width:10,height:10,}}source={require('../../Images/close.png')}/>
            </TouchableOpacity>}
        </View>
    )
}
export default MapInput;
