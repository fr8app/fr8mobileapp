
import React from 'react';
import {
    View, 
    StyleSheet, 
    Animated, 
    Easing, 
    Dimensions, 
    Platform 
} from 'react-native';
import PlatformStyleSheet from 'component/PlatformStyleSheet'

const { height, width } = Dimensions.get('window');
// var MaxSize = 420
// var MaxSize3 = 280

export default class NonActivePulseAnimation extends React.Component {

    constructor(props) {
        super(props);

        this.anim = new Animated.Value(0);
    }

    componentDidMount() {
        Animated.loop(
            Animated.timing(this.anim, {
                toValue: 2,
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
                marginLeft: -pulseMaxSize / 2,
                marginTop: -pulseMaxSize / 2,
            }]}>
                <Animated.View
                    style={[styles.circle, {
                        borderColor,
                        backgroundColor,
                        width: this.anim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [size, pulseMaxSize]
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
                            borderRadius: MaxSize / 2,
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
                                backgroundColor: '#F0F8FF',
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


const styles = PlatformStyleSheet.create({

    circleWrapper: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        // alignSelf: 'center',
        // backgroundColor:'orange',
        position: 'absolute',
        // left: width / 2,
        // top:Platform.OS=="android"? height-224.5:height-182,
        // top: Platform.OS == "android" ? height == 683.4285714285714 ? height - 380 : height - 388 : height >= 687 ? height - 366 : height - 373,
        // bottom:Platform.OS=='ios'?height-635:null
        android: {
            bottom: -12
        },
        ios: {
            top: height >= 687 ? height - 366 : height - 373
        },
    },
    circle: {
        borderWidth: 4 * StyleSheet.hairlineWidth,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
