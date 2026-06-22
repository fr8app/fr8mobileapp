import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from './styles'

export default class WarnFriendRender extends Component {
    render() {
        return (
            <View style={styles.mainView} >
             {this.props.userImageSource?
                <View style={styles.userImageView}>
                    <Image source={this.props.userImageSource} resizeMode="cover" style={styles.userImage} />
                </View>
            : null }
                <View style={styles.textView}>
                    <Text numberOfLines={1} style={styles.tittleText}>{this.props.tittleText}</Text>
                    {this.props.descText ?
                        <Text numberOfLines={1} style={styles.descText}>{this.props.descText}</Text>
                        : null}
                </View>

                <View style={[styles.buttonView, { flex: this.props.rejectOnPress ? 0.55 : 0.3, marginRight: this.props.rejectOnPress ? 5 : 0 }]}>
                    <TouchableOpacity style={this.props.selected == true ? styles.selectedButton : styles.darkBlueButton} onPress={this.props.acceptOnPress}>
                        <Text numberOfLines={1} style={this.props.selected == true ? styles.selectedAcceptText : styles.acceptText}>{this.props.acceptText}</Text>
                    </TouchableOpacity>

                    {this.props.rejectOnPress ?
                        <TouchableOpacity style={styles.lightBlueButton} onPress={this.props.rejectOnPress}>
                            <Text numberOfLines={1} style={styles.acceptText}>{this.props.rejectText}</Text>
                        </TouchableOpacity>
                        :
                        null}
                </View>

            </View>
        );
    }
}