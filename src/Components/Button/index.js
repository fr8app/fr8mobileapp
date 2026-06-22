import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
} from 'react-native';
import styles from './styles'
import { AppImages } from './../../Themes';

export default class CustomButton extends Component {
    constructor(props){
        super(props)
        this.state={
            disabled:false
        }
    }
    render() {
        const {
            isCanceled,
            customStyles
        } = this.props;
        return (
            isCanceled?
            <View style={[styles.container, customStyles.container]}>
            <TouchableOpacity 
            disabled={this.props.disabled||this.state.disabled} 
            style={[styles.buttonContainer, customStyles.buttonContainer,{backgroundColor:'lightgray'}]} 
            onPress={()=>{
                this.setState({disabled:true})
                setTimeout(() => {
                    this.setState({disabled:false})
                }, 200);
                this.props.onPress()
            }} >
                <Text numberOfLines={1} style={[styles.text,{color:'black'}]}>{this.props.Text}</Text>
            </TouchableOpacity>
            </View>
            :
            <ImageBackground style={[styles.container, customStyles.container]} source={AppImages.images.buttonBackground}>
                <TouchableOpacity 
                disabled={this.props.disabled||this.state.disabled} 
                style={[styles.buttonContainer, customStyles.buttonContainer]} 
                onPress={()=>{
                    this.setState({disabled:true})
                    setTimeout(() => {
                        this.setState({disabled:false})
                    }, 200);
                    this.props.onPress()
                }} >
                    <Text numberOfLines={1} style={styles.text}>{this.props.Text}</Text>
                </TouchableOpacity>
            </ImageBackground>
        )
    }
}
CustomButton.defaultProps = { customStyles: {} }