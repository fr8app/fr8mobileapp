import React from 'react';
import { Animated } from 'react-native';

export default class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),
    fadeAnim2: new Animated.Value(0),
    display: false
  }

  componentDidMount() {
  }

  Discard() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 0,
        duration: 100,              // Make it take a while
      }
    ).start();
    Animated.timing(                  // Animate over time
      this.state.fadeAnim2,            // The animated value to drive
      {
        toValue: 0,
        duration: 100,              // Make it take a while
      }
    ).start();
    this.setState({ display: false })
  }

  animatebutton() {
    this.setState({ display: true })
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: 120,
        duration: 5000,              // Make it take a while
      }
    ).start();
    Animated.timing(                  // Animate over time
      this.state.fadeAnim2,            // The animated value to drive
      {
        toValue: 120,
        duration: 5000,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim, fadeAnim2 } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          height: fadeAnim,
          width: fadeAnim2,
          display: this.state.display ? 'flex' : 'none'
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}
