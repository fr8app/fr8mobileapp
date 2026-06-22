import React, { Component } from 'react';
import { Clipboard, Keyboard } from 'react-native';
import {
    Text,
    View,
    TouchableOpacity
} from 'react-native';
import styles from './styles'
import I18n from 'react-native-i18n'

export default class SenderChat extends Component {

    copyMessage = () => {
        Clipboard.setString(this.props.message)
        alert(I18n.t("messageCopy"));
    }

    render() {
        return (
            <View key={this.props.key} style={styles.mainContainer}>

                <TouchableOpacity activeOpacity={0.8} onPress={() => Keyboard.dismiss()} onLongPress={() => this.copyMessage()} style={styles.chatView}>

                    <View style={styles.messageView} >
                        <Text style={styles.messageText}>{this.props.message}</Text>
                    </View>
                    <View
                        style={styles.chatTrinagle}
                    >
                    </View>
                </TouchableOpacity>
                <View style={[styles.userView, { flexDirection: 'row', width: "74%", alignItems: 'center', justifyContent: 'space-between', marginTop: 2, }]}>
                    <Text style={[styles.dateTimeText, { flex: 1.5 }]} numberOfLines={1}>{this.props.dateTime}</Text>
                    <Text style={[styles.nameText, { marginRight: 5, flex: 1, textAlign: 'right' }]} numberOfLines={1}>{this.props.name}</Text>
                </View>
            </View>
        )
    }
}