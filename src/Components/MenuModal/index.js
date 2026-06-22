import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Modal,
} from 'react-native';
import styles from './styles'
import I18n from 'react-native-i18n'

export default class ModalView extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render() {
        return (

            <Modal
                transparent={true}
                animationType={'none'}
                visible={this.props.modalVisible}
            >
                <TouchableOpacity onPress={this.props.anyTap} activeOpacity={1}>
                    <View style={styles.container}>
                        <View overflow="hidden" style={styles.modalBackground}>
                            <View overflow="hidden" style={styles.innerView}>
                                <TouchableOpacity onPress={this.props.myPostsClick} style={styles.buttons}>
                                    <Text style={styles.menutxt}>{I18n.t('My_Posts')}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.props.friendRequestClick} style={styles.buttons}>
                                    <Text style={styles.menutxt}>{I18n.t('Friend_Requests')}</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

        )
    }
}