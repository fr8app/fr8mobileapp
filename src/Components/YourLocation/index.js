import React from 'react';
import {View, PixelRatio,} from 'react-native';

const YourLocation = (props) => {
    return (
        <View style={{
            // position:'absolute',
        
            // width:160, 
            // height:160,
            // padding:40,
            }}> 
        
            <View style={{width:30,height:30, backgroundColor:'#29a2e1', borderRadius:15, borderColor:'white', borderWidth:4,shadowColor:props.boundary===1?'#29a2e1':null,
        shadowOpacity:props.boundary===1? 40:null,
        shadowRadius:props.boundary===1? 25:null,}}>
            </View>
            
        </View>
    )
}
export default YourLocation;
// #32527b
// #29a2e1