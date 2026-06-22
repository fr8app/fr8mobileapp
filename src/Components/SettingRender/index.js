import React, { Component } from 'react';
import {
    Text,
    Image,
    TouchableOpacity,
    View
} from 'react-native';
import styles from './styles'

export default class SettingRender extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity style={styles.mainContainer} onPress={this.props.onPress}>
                    <Text style={styles.tittleText} numberOfLines={1}>{this.props.Text}</Text>
                    <Image resizeMode="contain" style={styles.rightImage} source={this.props.source} />
                </TouchableOpacity>
              {this.props.visible == true?
                <View style={styles.lineView}/>
            : null  }
            </View>
        )
    }
}