
import React from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import {  AppColor } from './../../Themes';

const { height, width } = Dimensions.get('window');
// var MaxSize = 420
// var MaxSize3 = 280

export default class PulseAnimation extends React.Component {

    constructor(props) {
        super(props);

        this.anim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.loop(
            Animated.timing(this.anim, {
                toValue: 1,
                duration: this.props.interval,
                easing: Easing.in,
            })
        ).start()
    }

    render() {
        const { size, pulseMaxSize, borderColor, backgroundColor, getStyle } = this.props;
        const MaxSize = this.props.circle2
        const MaxSize3 = this.props.circle3
        return (

            <View style={[styles.circleWrapper, {
                width: pulseMaxSize,
                height: pulseMaxSize,
                // marginLeft: -pulseMaxSize / 2,
                // marginTop: -pulseMaxSize / 2,
                
               
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        borderColor,
                        backgroundColor,
                        width: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize],
                        }),
                        height: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
                        }),
                        borderRadius: pulseMaxSize / 2,
                        opacity: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [1, 0]
                        })
                    }, getStyle && getStyle(this.anim)]}
                >

                    <Animated.View
                        style={[styles.circle, {
                            borderColor: 'transparent',
                            backgroundColor: '#C6E2FF',
                            width: this.anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [size, MaxSize]
                            }),
                            height: this.anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [size, MaxSize]
                            }),
                            borderRadius: MaxSize / 1.5,
                            opacity: this.anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [1, 0.6]
                            })
                        }, getStyle && getStyle(this.anim)]}
                    >
                        <Animated.View
                            style={[styles.circle, {
                                borderColor: 'transparent',
                                borderWidth: 3,
                                backgroundColor: AppColor.colors.lightBlue,
                                width: this.anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [size, MaxSize3]
                                }),
                                height: this.anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [size, MaxSize3]
                                }),
                                borderRadius: MaxSize3 / 2,
                                opacity: this.anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0.8]
                                })
                            }, getStyle && getStyle(this.anim)]}
                        >
                        </Animated.View>
                    </Animated.View>


                </Animated.View>
            </View>
        );
    }
}


const styles = StyleSheet.create({

    circleWrapper: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    circle: {
        borderWidth:5,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
