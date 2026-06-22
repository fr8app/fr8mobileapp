import React from 'react';
import {View,Image } from 'react-native';
import {  AppImages} from './../../Themes';


const FullscreenView  = ({inside}) => {
    return (
            <View style={{width:40,height:40,borderRadius:20,marginTop:30,marginLeft:'85%',right:10, backgroundColor:'lightgray', justifyContent:'center',alignItems:'center'}}>
                
                <Image style={{width:40,height:40}}source={inside?AppImages.images.bracketIn:AppImages.images.bracket}/>
                    
            </View>  
        
    )
}
export default FullscreenView;