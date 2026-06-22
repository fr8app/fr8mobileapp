import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Animated,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';

import BaseInput from './BaseInput';
import {AppFontFamily,AppColor}from '../../Themes'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import GooglePlacesInput from '../../Screens/GooglePLaces';
import I18n from 'react-native-i18n'
import Picker from "react-native-picker";
import Geolocation from '@react-native-community/geolocation';

const apiKey = 'AIzaSyAId9HPoVrtc6rDn9O-tAWERRJEelhkARc'

export default class AnimatedTextInput extends BaseInput {
  static propTypes = {
    borderColor: PropTypes.string,
    /*
     * this is used to set backgroundColor of label mask.
     * this should be replaced if we can find a better way to mask label animation.
     */
    maskColor: PropTypes.string,
    inputPadding: PropTypes.number,
    height: PropTypes.number,
  };

  static defaultProps = {
    borderColor: 'gray',
    inputPadding: 16,
    height: 48,
    borderHeight: 3,
  };

 


  render() {
    const {
      label,
      style: containerStyle,
      inputStyle,
      labelStyle,
      maskColor,
      borderColor,
      borderHeight,
      inputPadding,
      height: inputHeight,
    } = this.props;
    const { width, focusedAnim, value } = this.state;
    const flatStyles = StyleSheet.flatten(containerStyle) || {};
    const containerWidth = flatStyles.width || width;

    return (
      <>
      <View
        style={[
          styles.container,
          containerStyle,
          {
            height: inputHeight + inputPadding,
            width: '100%',
            marginTop:'5%'
          },
        ]}
        onLayout={this._onLayout}
      >
        <>
        {
        
  //       this.props.isLocation?
  //       value?
  //      <GooglePlacesAutocomplete
       
  //      predefinedPlacesAlwaysVisible={false}
  //     //  listEmptyComponent={() => this.emptyData()}
  //      currentLocation={true}
  //      currentLocationLabel='Current Location'
  //     //  predefinedPlaces={this.props.userInTerminal ?
  //     //      [
  //     //          {
  //     //              description: this?.props?.userInTerminal?.terminal?.terminal_location+', '+this?.props?.userInTerminal?.terminal?.city
  //     //              +', '+this?.props?.userInTerminal?.terminal?.state_province+', '+this?.props?.userInTerminal?.terminal?.country,
  //     //              geometry: {
  //     //                  location:
  //     //                  {
  //     //                      lat: this?.props?.userInTerminal?.terminal?.latitude,
  //     //                      lng: this?.props?.userInTerminal?.terminal?.longitude
  //     //                  }
  //     //              }
  //     //          }
  //     //      ]
  //     //      : []
  //     //  }
  //      enableHighAccuracyLocation={true}
  //      textInputProps={{ 
  //       selectionColor:'#29a2e1',
  //       ref:this.input ,
  //       onChange:  this._onChange,
  //       onBlur:this._onBlur,
        
  //       onFocus:this._onFocus,
  //       value:{value},
  //       style:[
  //         styles.textInput,
  //         inputStyle,
  //         {
  //           // backgroundColor:'red',
  //           width,
  //           height: inputHeight,
  //           bottom:0,
  //           // position:'relative',
  //           // marginTop:'5%'
  //         //   left: inputPadding,
  //         },
  //       ]
  //     }}
  //     //  renderLeftButton={() => this.renderLeft()}
  //     //  styles={{ textInput: styles.inputColor, container: { marginHorizontal: 20 }, textInputContainer: styles.containerInputImage }}
  //     //  placeholder='Search'
      
  //      onPress={(data, details = null) => {
  //          this.setState({ selectedLocation: data.description })

  //      }}
  //      query={{
  //          key: apiKey,
  //          language: 'en',
  //      }}
  //  /> 
  //  :
  //  <TextInput
  //       // keyboardType={'phone-pad'}
  //       selectionColor={'#29a2e1'}
  //         ref={this.input}
  //         {...this.props}
  //         style={[
  //           styles.textInput,
  //           inputStyle,
  //           {
  //             width,
  //             height: inputHeight,
  //           //   left: inputPadding,
  //           },
  //         ]}
  //         value={value}
  //         onBlur={this._onBlur}
  //         onChange={this.props.isPhoneNumber?this._onChangeText : this._onChange}
  //         onFocus={this._onFocus}
  //         underlineColorAndroid={'transparent'}
  //       />
  //     :
        <TextInput
        editable={this.props.isLocation?false:true}
        // keyboardType={'phone-pad'}
        selectionColor={'#29a2e1'}
          ref={this.input}
          {...this.props}
          style={[
            styles.textInput,
            inputStyle,
            {
              width,
              height: inputHeight,
            //   left: inputPadding,
            },
          ]}
          value={value}
          onBlur={this._onBlur}
          onChange={this.props.isPhoneNumber?this._onChangeText : this._onChange}
          onFocus={this._onFocus}
          underlineColorAndroid={'transparent'}
        />}
          { this.props.isLocation&&
            
            <TouchableOpacity onPress={() => {
                    Picker.hide();
                    this._onFocus()
                    
                }} style={[{ flexDirection: 'row',position:'absolute',height:"100%",width:'100%',bottom:0, alignItems: 'center', alignSelf: 'flex-end' }]}>
                    
                </TouchableOpacity>
               }
        </>
        <TouchableWithoutFeedback onPress={this.focus}>
          <Animated.View
            style={[
              styles.labelContainer,
              {
                opacity: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 1],
                  outputRange: [1, 0, 1],
                }),
                top: focusedAnim.interpolate({
                  inputRange: [0, 0.5, 0.51, 1],
                  outputRange: [35, 24, 0, 0],
                }),
                // left: focusedAnim.interpolate({
                //   inputRange: [0, 0.5, 0.51, 1],
                //   outputRange: [inputPadding, 2 * inputPadding, 0, inputPadding],
                // }),
              },
            ]}
          >
            <Text style={[styles.label, labelStyle,{color:this.state.isActive==true||value?'#29a2e1':'silver'}]}>
              {label}
            </Text>
          </Animated.View>
        </TouchableWithoutFeedback>
        <View
          style={[styles.labelMask, {
            backgroundColor: maskColor,
            width: inputPadding,
          }]}
        />
        <Animated.View
          style={[
            styles.border,
            {
              width: focusedAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width],
              }),
              backgroundColor: borderColor,
              height: borderHeight,
            },
          ]}
        />
        {this.props.sourceRight&&
             <View style={[styles.inputContainerImage, {position:'absolute',right:0, width: 40,alignItems:'flex-end', backgroundColor: 'transparent' }]}>
             <Image source={this.props.sourceRight} resizeMode="contain" style={[styles.imageLogo, {tintColor:'#29a2e1', width: 15, height: 15 }]} />
         </View>
        }

<Modal
              style={{ flex: 1 }}
              animationType='slide'
              onRequestClose={() => {this.setState({ visible: false }),this.input.current.blur()}}
              visible={this.state.visible}
            >
              
              <GooglePlacesInput
              ref={(ref)=>this.googleRef=ref}
              selectedText={this.state.value}
              isCustomText={true}
                userInTerminal={null
                }
                rightBackPress={(location) => {
                  location.length == 0 ?
                    alert(I18n.t('locationSelect'))
                    :
                    this.setData(location)
                }}
                terminalDetail={this.itemParam ?.terminal}
                leftBackPress={() => {this.setState({ visible: false })
              this.blur()
              this.input.current?.blur()
              }}
              />

            </Modal>
      </View>
         
                    </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 0.8,
    borderBottomColor: '#b9c1ca',
  },
  labelContainer: {
    position: 'absolute',
  },
  label: {
    fontSize: 16,
    color: 'gray',
    fontFamily: AppFontFamily.fontFamily.regular,
  },
  textInput: {
    position: 'absolute',
    bottom: '-10%',
    padding: 0,
    color: '#000',
    fontSize: 18,
    fontFamily: AppFontFamily.fontFamily.museo_500,
    // fontWeight: 'bold',
  },
  labelMask: {
    height: 24,
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  inputContainerImage: {
    width: 50,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColor.colors.imageBackground
  },
  imageLogo: {
    width: 20,
    height: 20
  },
});