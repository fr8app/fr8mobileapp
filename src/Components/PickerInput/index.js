import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from './styles'
import { AppColor } from './../../Themes';

export default class PickerInput extends Component {
    render() {
        const {
            customStyles
        } = this.props;
        return (
            <View style={[styles.mainView, customStyles.mainView]} >
                {
                    this.props.Text ?
                        <Text style={[styles.textStyle,this.props.titleStyle]}>{this.props.Text}</Text>
                        :
                        <View style={{ backgroundColor: 'red' }} />
                }
                <TouchableOpacity activeOpacity={1}
                    style={[styles.containerInputImage, { flex: this.props.Text ? 1 : 0, borderColor: this.props.changeBorder ? AppColor.colors.white : AppColor.colors.imageBackground, },
                    customStyles.containerInputImage]}
                    onPress={this.props.onPress}>
                    {this.props.source&&<View style={styles.inputContainerImage}>
                        <Image source={this.props.source} resizeMode="contain" style={styles.imageLogo} />
                    </View>}
                    <View style={[styles.inputView,this.props.valueView]}>
                        <Text numberOfLines={1} style={[styles.placeHolderTextStyle, { color: this.props.color },this.props.enteredText]}>{this.props.placeHolderText}</Text>
                    </View>
                    <View style={[styles.inputContainerImage, { width: 40, backgroundColor: 'transparent' }]}>
                        <Image source={this.props.sourceRight} resizeMode="contain" style={[styles.imageLogo, { width: 15, height: 15 }]} />
                    </View>
                </TouchableOpacity>

            </View>
        );
    }
}
PickerInput.defaultProps = { customStyles: {} }