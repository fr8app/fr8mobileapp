import React, { Component } from 'react';
import {
    Animated,
} from 'react-native';

export default class AnimationMaps extends Component {
    
    constructor(props){
        super(props);
        this.state={
            fadeAnim: new Animated.Value(1),
        }
    }
    componentDidMount() {
         this.fadeOut()             
      }
    
      fadeIn(){
        Animated.timing(                 
            this.state.fadeAnim,            
            {
              toValue: 0,                   
              duration: 2000,             
            }
          ).start(()=>{
              this.fadeOut()
          });         
      }

      fadeOut(){
        Animated.timing(                 
            this.state.fadeAnim,            
            {
              toValue: 1,                   
              duration: 2000,             
            }
          ).start(()=>{
            this.fadeIn()
          });      
      }

    render() {
        return (
            <Animated.View style={{
                opacity:this.state.fadeAnim, 
                height:30,
                width:30,
                borderRadius:30/2,
                overflow:'hidden'  
              }}>
            </Animated.View>
        )
    }
}