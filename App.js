/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component } from 'react';
import { TextInput, Text, Platform } from 'react-native';
import KeyboardManager from 'react-native-keyboard-manager';
import Setup from './src/Route/setup';
import { Provider } from 'react-redux'
import { store } from './configureStore'
import { InAppNotificationProvider } from 'react-native-in-app-notification'
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

export default class App extends Component {
  async componentDidMount() {
  }
  render() {
    if (Platform.OS === 'ios') {
      KeyboardManager?.setEnable(true);
      KeyboardManager?.setEnableDebugging(false);
      KeyboardManager?.setKeyboardDistanceFromTextField(30);
    }
    return (
      <InAppNotificationProvider>
        <Provider store={store} >
          <Setup />
        </Provider>
      </InAppNotificationProvider>
    );
  }
}

