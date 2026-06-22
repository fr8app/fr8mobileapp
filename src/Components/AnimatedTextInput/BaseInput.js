import { Component, createRef } from "react";
import PropTypes from "prop-types";

import { Animated, Text, View, ViewPropTypes } from "react-native";

export default class BaseInput extends Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    defaultValue: PropTypes.string,
    style: ViewPropTypes ? ViewPropTypes.style : View.propTypes?.style,
    inputStyle: Text.propTypes?.style,
    labelStyle: Text.propTypes?.style,
    easing: PropTypes.func,
    animationDuration: PropTypes.number,
    useNativeDriver: PropTypes.bool,

    editable: PropTypes.bool,

    /* those are TextInput props which are overridden
     * so, i'm calling them manually
     */
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
  };

  constructor(props, context) {
    super(props, context);

    this.input = createRef();
    this._onLayout = this._onLayout.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onBlur = this._onBlur.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this.focus = this.focus.bind(this);

    const value = props.value || props.defaultValue;

    this.state = {
      isActive:false,
      value,
      focusedAnim: new Animated.Value(value ? 1 : 0),
      width: null,
      visible:false
    };
  }

  componentDidMount(){
   if(this.props.focusCall){
    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(true);
    }
    this._toggle(true);
   }
    
  }

  componentDidUpdate() {
    const newValue = this.props.value;
    if (this.props.hasOwnProperty("value") && newValue !== this.state.value) {
      this.setState({
        value: newValue,
      });

      // animate input if it's active state has changed with the new value
      // and input is not focused currently.
      const isFocused = this.inputRef().isFocused();
      if (!isFocused) {
        const isActive = Boolean(newValue);
        if (isActive !== this.state.isActive) {
          this._toggle(isActive);
        }
      }
    }
  }

  _onLayout(event) {
    this.setState({
      width: event.nativeEvent.layout.width,
    });
  }

  _onChange(event) {
    this.setState({
      value: event.nativeEvent.text,
    });

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(event);
    }
  }
  

  _onBlur(event) {
    if (!this.state.value) {
      this._toggle(false);
    }

    const onBlur = this.props.onBlur;
    if (onBlur) {
      onBlur(event);
    }
  }

  _onFocus(event) {
    this._toggle(true);

    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(event);
    }
    if(this.props.isLocation){
      this.setState({visible:true})
    }
  }

  _toggle(isActive) {
    const { animationDuration, easing, useNativeDriver } = this.props;
    // this.isActive = isActive;
    this.setState({isActive})
    Animated.timing(this.state.focusedAnim, {
      toValue: isActive ? 1 : 0,
      duration: animationDuration,
      easing,
      useNativeDriver: useNativeDriver || false,
    }).start();
  }

  // public methods

  inputRef() {
    return this.input.current;
  }

  focus() {
    if (this.props.editable !== false) {
      this.inputRef().focus();
    }
  }

  blur() {
    this.inputRef().blur();
  }

  isFocused() {
    return this.inputRef().isFocused();
  }

  clear() {
    this.inputRef().clear();
  }


  //newly added

  _onChangeText = (event) => {
    let formatedNo = this.formatMobileNumber(event.nativeEvent.text);
    this.setState({
      value: formatedNo,
    });

    const onChange = this.props.onChange;
    if (onChange) {
      onChange(event);
    }
    // this.setState({ phone: formatedNo });
  };
  
  // formatMobileNumber=(text)=> {
  //   var cleaned = ("" + text).replace(/\D/g, "");
  //   var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  //   if (match) {
  //     var intlCode = match[1] ? "+1 " : "",
  //       number = [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join(
  //         ""
  //       );
  //     return number;
  //   }
  //   return text;
  // }

  formatMobileNumber=(value) =>{
    // if input value is falsy eg if the user deletes the input, then just return
    if (!value) return value;
  
    // clean the input for any non-digit values.
    const phoneNumber = value.replace(/[^\d]/g, "");
  
    // phoneNumberLength is used to know when to apply our formatting for the phone number
    const phoneNumberLength = phoneNumber.length;
  
    // we need to return the value with no formatting if its less then four digits
    // this is to avoid weird behavior that occurs if you  format the area code to early
    if (phoneNumberLength < 4) return phoneNumber;
  
    // if phoneNumberLength is greater than 4 and less the 7 we start to return
    // the formatted number
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
      // return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
    }
  
    // finally, if the phoneNumberLength is greater then seven, we add the last
    // bit of formatting and return it.
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    // return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 15)}`;
  }
  setData=(location)=>{
    this.input?.current?.blur()
    const onFocus = this.props.onFocus;
    if (onFocus) {
      onFocus(true);
    }
    this._toggle(true);
    this.setState({
      value: location,
      visible: false 
    });
    this.blur()
    // this.setState({ location, })
  }
}