import React,{Component}from 'react';
import {TouchableOpacity,Image}from 'react-native';
import style from './style';

export default class StartStop extends Component{
    render(){
        const{
            onPress,
            costomStyle,
            imageSrc
        }=this.props
        return(
 <TouchableOpacity onPress={onPress} style={[styles.startPauseButton,costomStyle.startPauseButton]}>
              <Image style={[style.image,costomStyle.image]} resizeMode='contain' source={imageSrc} />
            </TouchableOpacity>
        )
    }
}