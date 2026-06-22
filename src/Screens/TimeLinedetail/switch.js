import React, { Component } from 'react';
import { Switch } from 'react-native'

export default class SwitchView extends Component {
    render() {
        return (
            <Switch
                tintColor='silver'
                trackColor={{ true: '#29a2e1' }}
                ios_backgroundColor={'gray'}
                style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                value={this.props.value}
                disabled={false}
                onValueChange={() => this.props.onValueChange()}
            />)
    }
}