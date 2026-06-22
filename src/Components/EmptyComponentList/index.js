import React, { Component } from 'react';
import {
    Text,
    View,
} from 'react-native';
import styles from './styles'

export default class EmptyComponentList extends Component {
    render() {
        return (
            <View style={[styles.mainView,{height:this.props.height?this.props.height:'100%'}]}>
                <Text style={styles.tittleText}>{this.props.title}</Text>
            </View>
        );
    }
}