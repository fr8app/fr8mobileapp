import React, {Component} from 'react';
import {Animated, BackHandler, PanResponder, Text,Image, View, TouchableOpacity, Dimensions, TouchableHighlight, Platform} from 'react-native';
import styles from './Animation.Style';
import images from '../Themes/Images';
import FastImage from '../../../../Components/react-native-cached-image-master';
import {AppFontFamily}from '../../../../Themes'
import { connect } from 'react-redux';
import I18n from 'react-native-i18n'
class AnimationScreen extends Component {
  constructor(props) {
    super(props);

   this.state={
    isLongTouch2:false
   }
   
   this.moveAnimation = new Animated.ValueXY({ x: 0, y: 0 })

    // Slow down speed animation here (1 = default)
    this.timeDilation =0.1;

    // If duration touch longer than it, mean long touch
    this.durationLongPress = this.props.delay?1000:300;

    // Variables to check
    // 0 = nothing, 1 = like, 2 = love, 3 = haha, 4 = wow, 5 = sad, 6 = angry
    this.isTouchBtn = false;

    this.isLongTouch = false;
    this.isLiked = this.props.isLiked;
    this.whichIconUserChoose = this.getReactionType(this.props.isDetail?this.props.timeLine?.detail?.reactionType?.type: this.props.reactionType);
    this.currentIconFocus = 0;
    this.previousIconFocus = 0;
    this.isDragging = false;
    this.isDraggingOutside = false;
    this.isJustDragInside = true;

    // Duration animation
    this.durationAnimationBox = 500;
    this.durationAnimationQuickTouch = 500;
    this.durationAnimationLongTouch = 150;
    this.durationAnimationIconWhenDrag = 150;
    this.durationAnimationIconWhenRelease = 1000;

    // ------------------------------------------------------------------------------
    // Animation button when quick touch button
    this.tiltIconAnim = new Animated.Value(0);
    this.zoomIconAnim = new Animated.Value(0);
    this.zoomTextAnim = new Animated.Value(0);

    // ------------------------------------------------------------------------------
    // Animation when button long touch button
    this.tiltIconAnim2 = new Animated.Value(0);
    this.zoomIconAnim2 = new Animated.Value(0);
    this.zoomTextAnim2 = new Animated.Value(0);
    // Animation of the box
    this.fadeBoxAnim = new Animated.Value(0);

    // Animation for emoticons
    this.moveRightGroupIcon = new Animated.Value(10);
    // Like
    this.pushIconLikeUp = new Animated.Value(0);
    // I don't know why, but when I set to 0.0, it seem blink,
    // so temp solution is set to 0.01
    this.zoomIconLike = new Animated.Value(0.01);
    // Love
    this.pushIconLoveUp = new Animated.Value(0);
    this.zoomIconLove = new Animated.Value(0.01);
    // Haha
    this.pushIconHahaUp = new Animated.Value(0);
    this.zoomIconHaha = new Animated.Value(0.01);
    // Wow
    this.pushIconWowUp = new Animated.Value(0);
    this.zoomIconWow = new Animated.Value(0.01);
    // Sad
    this.pushIconSadUp = new Animated.Value(0);
    this.zoomIconSad = new Animated.Value(0.01);
    // Angry
    this.pushIconAngryUp = new Animated.Value(0);
    this.zoomIconAngry = new Animated.Value(0.01);

    // ------------------------------------------------------------------------------
    // Animation for zoom emoticons when drag
    this.zoomIconChosen = new Animated.Value(1);
    this.zoomIconNotChosen = new Animated.Value(1);
    this.zoomIconWhenDragOutside = new Animated.Value(1);
    this.zoomIconWhenDragInside = new Animated.Value(1);
    this.zoomBoxWhenDragInside = new Animated.Value(1);
    this.zoomBoxWhenDragOutside = new Animated.Value(0.95);

    // Animation for text description at top icon
    this.pushTextDescriptionUp = new Animated.Value(60);
    this.zoomTextDescription = new Animated.Value(1);

    // ------------------------------------------------------------------------------
    // Animation for jump emoticon when release finger
    this.zoomIconWhenRelease = new Animated.Value(1);
    this.moveUpDownIconWhenRelease = new Animated.Value(0);
    this.moveLeftIconLikeWhenRelease = new Animated.Value(20);
    this.moveLeftIconLoveWhenRelease = new Animated.Value(72);
    this.moveLeftIconHahaWhenRelease = new Animated.Value(124);
    this.moveLeftIconWowWhenRelease = new Animated.Value(173);
    this.moveLeftIconSadWhenRelease = new Animated.Value(226);
    this.moveLeftIconAngryWhenRelease = new Animated.Value(278);
    this.setupPanResponder();
  }


  componentDidMount(){
    // alert(this.props.onListScroll)
    if(this.props.onListScroll){

      this.onListScroll()
    }
  }

  componentDidUpdate(prevProps){
      if(this.props!==prevProps){
        if(this.props?.isScrolling!==prevProps?.isScrolling){
         if(this.props.isScrolling==true){
           this.onListScroll()
         }
        }

        if(this.props.isDoubleTabLiked!==prevProps?.isDoubleTabLiked){
          if(this.props.isDoubleTabLiked==true){
            this.isLiked=true
          }
     
        }
      }
  }

  getReactionType=(res)=>{
    
      if(res){
        switch (res) {
          case 'like':
            return 1;
          case 'dislike':
            return 2;
          // case 'rollingEyes':
          //   return 3;
          case 'grinningSmile':
            return 3;
          case 'angry':
            return 4;
          case 'confuse':
            return 5;
          // case 'beamingSmile':
          //   return 6;
          case 'thinking':
            return 6;
          default:
            return 0;
        }
      }
      else{
        return 0
      }
  }
  // Handle the drag gesture
  setupPanResponder() {
    this.rootPanResponder = PanResponder.create({
      // prevent if user's dragging without long touch the button
      onMoveShouldSetPanResponder: (evt, gestureState) =>
        !this.isTouchBtn && this.isLongTouch,

      onPanResponderGrant: (evt, gestureState) => {
        this.handleEmoticonWhenDragging(evt, gestureState);
      },

      onPanResponderMove: (evt, gestureState) => {
        this.handleEmoticonWhenDragging(evt, gestureState);
      },

      onPanResponderRelease: (evt, gestureState) => {
        this.isDragging = false;
        this.isDraggingOutside = false;
        this.isJustDragInside = true;
        this.previousIconFocus = 0;
        this.currentIconFocus = 0;
        this.setState({});

        this.onDragRelease();
      },
      
  
    });
  }

  handleEmoticonWhenDragging = (evt, gestureState) => {
    // the margin top the box is 100
    // and plus the height of toolbar and the status bar

    gestureState.y0 + gestureState.dy >= this.props.yAxis-100 &&
    gestureState.y0 + gestureState.dy <= this.props.yAxis+100
    // so the range we check is about 150 -> 450
    if (
      gestureState.y0 + gestureState.dy >= this.props.yAxis?this.props.yAxis-100: 150 &&
      gestureState.y0 + gestureState.dy <= this.props.yAxis?this.props.yAxis+100: Dimensions.get('screen').height-100
    ) {
      this.isDragging = true;
      this.isDraggingOutside = false;

      if (this.isJustDragInside) {
        this.controlIconWhenDragInside();
      }
if(this.props.customDx){


  if (
    gestureState.x0 + gestureState.dx >= 35+100 &&
    gestureState.x0 + gestureState.dx < 74.99+100
  ) {
    if (this.currentIconFocus !== 1) {
      this.handleWhenDragBetweenIcon(1);
    }
  } else if (
    gestureState.x0 + gestureState.dx >= 74.99+100 &&
    gestureState.x0 + gestureState.dx < 114.98+100
  ) {
    if (this.currentIconFocus !== 2) {
      this.handleWhenDragBetweenIcon(2);
    }
  } else if (
    gestureState.x0 + gestureState.dx >= 114.98+100 &&
    gestureState.x0 + gestureState.dx < 140+100
  ) {

    if (this.currentIconFocus !== 3) {
      this.handleWhenDragBetweenIcon(3);
    }
  } else if (
    gestureState.x0 + gestureState.dx >= 154.97+100 &&
    gestureState.x0 + gestureState.dx < 194.96+100
  ) {
    if (this.currentIconFocus !== 4) {
      this.handleWhenDragBetweenIcon(4);
    }
  } else if (
    gestureState.x0 + gestureState.dx >= 194.96+100 &&
    gestureState.x0 + gestureState.dx < 234.95+100
  ) {
    if (this.currentIconFocus !== 5) {
      this.handleWhenDragBetweenIcon(5);
    }
  } 
  else if (
    gestureState.x0 + gestureState.dx >= 234.95+100 &&
    gestureState.x0 + gestureState.dx <= 274.94+100
  ) {
    if (this.currentIconFocus !== 6) {
      this.handleWhenDragBetweenIcon(6);
    }
  }
  else if (
    gestureState.x0 + gestureState.dx >= 274.94+100 &&
    gestureState.x0 + gestureState.dx <= 314.93+100
  ) {
    if (this.currentIconFocus !== 7) {
      this.handleWhenDragBetweenIcon(7);
    }
  }
  else if (
    gestureState.x0 + gestureState.dx >= 314.93+100 &&
    gestureState.x0 + gestureState.dx <= 354.98+100
  ) {
    if (this.currentIconFocus !== 8) {
      this.handleWhenDragBetweenIcon(8);
    }
  }


}
else{

      if (
        gestureState.x0 + gestureState.dx >= 35 &&
        gestureState.x0 + gestureState.dx < 74.99
      ) {
        if (this.currentIconFocus !== 1) {
          this.handleWhenDragBetweenIcon(1);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 74.99 &&
        gestureState.x0 + gestureState.dx < 114.98
      ) {
        if (this.currentIconFocus !== 2) {
          this.handleWhenDragBetweenIcon(2);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 114.98 &&
        gestureState.x0 + gestureState.dx < 154.97
      ) {

        if (this.currentIconFocus !== 3) {
          this.handleWhenDragBetweenIcon(3);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 154.97 &&
        gestureState.x0 + gestureState.dx < 194.96
      ) {
        if (this.currentIconFocus !== 4) {
          this.handleWhenDragBetweenIcon(4);
        }
      } else if (
        gestureState.x0 + gestureState.dx >= 194.96 &&
        gestureState.x0 + gestureState.dx < 234.95
      ) {
        if (this.currentIconFocus !== 5) {
          this.handleWhenDragBetweenIcon(5);
        }
      } 
      else if (
        gestureState.x0 + gestureState.dx >= 234.95 &&
        gestureState.x0 + gestureState.dx <= 274.94
      ) {
        if (this.currentIconFocus !== 6) {
          this.handleWhenDragBetweenIcon(6);
        }
      }
      else if (
        gestureState.x0 + gestureState.dx >= 274.94 &&
        gestureState.x0 + gestureState.dx <= 314.93
      ) {
        if (this.currentIconFocus !== 7) {
          this.handleWhenDragBetweenIcon(7);
        }
      }
      else if (
        gestureState.x0 + gestureState.dx >= 314.93 &&
        gestureState.x0 + gestureState.dx <= 354.98
      ) {
        if (this.currentIconFocus !== 8) {
          this.handleWhenDragBetweenIcon(8);
        }
      }
    }
    } 
    else {
      this.whichIconUserChoose = 0;
      this.previousIconFocus = 0;
      this.currentIconFocus = 0;
      this.isJustDragInside = true;

      if (this.isDragging && !this.isDraggingOutside) {
        this.isDragging = false;
        this.isDraggingOutside = true;
        this.setState({});

        this.controlBoxWhenDragOutside();
        this.controlIconWhenDragOutside();
      }
    }
    
  };

  // Handle the touch of button
  onTouchStart = () => {
    // this.isLongTouch=false
    this.isTouchBtn = true;
        this.props.isTouchStart()
    this.setState({});

    this.timerMeasureLongTouch = setTimeout(
      this.doAnimationLongTouch,
      this.durationLongPress,
    );
  };

onListScroll=()=>{
 
  this.isTouchBtn = false;
  this.isLongTouch=false
  this.setState({isLongTouch2:!this.state.isLongTouch2});
  
}



  onTouchEnd = () => {


    // this.isLongTouch=false
    this.isTouchBtn = false;
    this.props.isTouchEnd(this.whichIconUserChoose)
    this.setState({});

    if (!this.isLongTouch) {
      if (this.whichIconUserChoose !== 0) {
        this.whichIconUserChoose = 0;

        // assuming that another emoticon is the same like, so we can animate the reverse then
        this.isLiked = true;
      }
      clearTimeout(this.timerMeasureLongTouch);
      this.doAnimationQuickTouch();
    }
  };

  onDragRelease = () => {
    // Animated.spring(this.moveAnimation, {
    //   toValue: {x: 0, y: 100},
    //   speed:0.1,
    // }).start()
    // To lower the emoticons
    this.doAnimationLongTouchReverse();

    // To jump particular emoticon be chosen
    this.controlIconWhenRelease();
  };

  doubleTabLike=()=>{
    this.isLiked = true;
  }

  // ------------------------------------------------------------------------------
  // Animation button when quick touch button
  doAnimationQuickTouch = () => {
   
    if (this.props.isDetail?!this.props.timeLine?.detail?.is_like: !this.isLiked) {
      console.log('press item',"currentIcon");
      this.props.quickTouch(1)
      this.isLiked = true;
      this.setState({});

      this.tiltIconAnim.setValue(0);
      this.zoomIconAnim.setValue(0);
      this.zoomTextAnim.setValue(0);
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 1,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      console.log('press item',"currentIcon");
      this.props.quickTouch(0)
      this.isLiked = false;
      this.setState({});

      this.tiltIconAnim.setValue(1);
      this.zoomIconAnim.setValue(1);
      this.zoomTextAnim.setValue(1);
      Animated.parallel([
        Animated.timing(this.tiltIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
        Animated.timing(this.zoomIconAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
        Animated.timing(this.zoomTextAnim, {
          toValue: 0,
          duration: this.durationAnimationQuickTouch * this.timeDilation,
          useNativeDriver: false,
        }),
      ]).start();
    }
  };

  // ------------------------------------------------------------------------------
  // Animation when long touch button
  doAnimationLongTouch = () => {

    this.isLongTouch = true;
    this.setState({});

    this.tiltIconAnim2.setValue(0);
    this.zoomIconAnim2.setValue(1);
    this.zoomTextAnim2.setValue(1);

    this.fadeBoxAnim.setValue(0);

    this.moveRightGroupIcon.setValue(10);

    this.pushIconLikeUp.setValue(0);
    this.zoomIconLike.setValue(0.01);

    this.pushIconLoveUp.setValue(0);
    this.zoomIconLove.setValue(0.01);

    this.pushIconHahaUp.setValue(0);
    this.zoomIconHaha.setValue(0.01);

    this.pushIconWowUp.setValue(0);
    this.zoomIconWow.setValue(0.01);

    this.pushIconSadUp.setValue(0);
    this.zoomIconSad.setValue(0.01);

    this.pushIconAngryUp.setValue(0);
    this.zoomIconAngry.setValue(0.01);

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 1,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 0.8,
        duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 1,
        duration: this.durationAnimationBox * this.timeDilation,
        useNativeDriver: false,
        delay: 350,
      }),

      // Group emoticon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 20,
        duration: this.durationAnimationBox * this.timeDilation,
        useNativeDriver: false,
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 50,
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 50,
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 100,
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 100,
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 150,
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 150,
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 200,
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 200,
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 25,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 250,
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 1,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 250,
      }),
    ]).start();
  };

  doAnimationLongTouchReverse = () => {
    this.tiltIconAnim2.setValue(1);
    this.zoomIconAnim2.setValue(0.8);
    this.zoomTextAnim2.setValue(0.8);

    this.fadeBoxAnim.setValue(1);

    this.moveRightGroupIcon.setValue(20);

    this.pushIconLikeUp.setValue(25);
    this.zoomIconLike.setValue(1);

    this.pushIconLoveUp.setValue(25);
    this.zoomIconLove.setValue(1);

    this.pushIconHahaUp.setValue(25);
    this.zoomIconHaha.setValue(1);

    this.pushIconWowUp.setValue(25);
    this.zoomIconWow.setValue(1);

    this.pushIconSadUp.setValue(25);
    this.zoomIconSad.setValue(1);

    this.pushIconAngryUp.setValue(25);
    this.zoomIconAngry.setValue(1);

    Animated.parallel([
      // Button
      Animated.timing(this.tiltIconAnim2, {
        toValue: 0,
        // duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomIconAnim2, {
        toValue: 1,
        // duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomTextAnim2, {
        toValue: 1,
        // duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),

      // Box
      Animated.timing(this.fadeBoxAnim, {
        toValue: 0,
        // duration: this.durationAnimationLongTouch * this.timeDilation,
        useNativeDriver: false,
      }),

      // Group emoticon
      Animated.timing(this.moveRightGroupIcon, {
        toValue: 10,
        // duration: this.durationAnimationBox * this.timeDilation,
        useNativeDriver: false,
      }),

      Animated.timing(this.pushIconLikeUp, {
        toValue: 0,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.zoomIconLike, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
      }),

      Animated.timing(this.pushIconLoveUp, {
        toValue: 0,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 50,
      }),
      Animated.timing(this.zoomIconLove, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 50,
      }),

      Animated.timing(this.pushIconHahaUp, {
        toValue: 0,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 100,
      }),
      Animated.timing(this.zoomIconHaha, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 100,
      }),

      Animated.timing(this.pushIconWowUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 150,
      }),
      Animated.timing(this.zoomIconWow, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 150,
      }),

      Animated.timing(this.pushIconSadUp, {
        toValue: 0,
        duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 200,
      }),
      Animated.timing(this.zoomIconSad, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 200,
      }),

      Animated.timing(this.pushIconAngryUp, {
        toValue: 0,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 250,
      }),
      Animated.timing(this.zoomIconAngry, {
        toValue: 0.01,
        // duration: 250 * this.timeDilation,
        useNativeDriver: false,
        // delay: 250,
      }),
    ]).start(this.onAnimationLongTouchComplete);
  };

  onAnimationLongTouchComplete = () => {
    this.isLongTouch = false;
    this.setState({});
  };

  // ------------------------------------------------------------------------------
  // Animation for zoom emoticons when drag
  handleWhenDragBetweenIcon = (currentIcon,onlyTouch=false) => {
    
    this.whichIconUserChoose = currentIcon;
    this.previousIconFocus = this.currentIconFocus;
    this.currentIconFocus = currentIcon;
    if(onlyTouch==true){
      console.log('press item',currentIcon);
      this.props.quickTouch(currentIcon)

    }
    this.controlIconWhenDrag();
  };

closePopUp=()=>{
  
  this.isLongTouch=false
  this.isTouchBtn=false
}

  controlIconWhenDrag = () => {
    this.zoomIconChosen.setValue(0.8);
    this.zoomIconNotChosen.setValue(1);
    this.zoomBoxWhenDragInside.setValue(1.0);

    this.pushTextDescriptionUp.setValue(60);
    this.zoomTextDescription.setValue(1.0);

    // For update logic at render function
    this.setState({});

    // Need timeout so logic check at render function can update
    setTimeout(
      () =>
        Animated.parallel([
          Animated.timing(this.zoomIconChosen, {
            toValue: 1.8,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: false,
          }),
          Animated.timing(this.zoomIconNotChosen, {
            toValue: 1,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: false,
          }),
          Animated.timing(this.zoomBoxWhenDragInside, {
            toValue: 0.95,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: false,
          }),

          Animated.timing(this.pushTextDescriptionUp, {
            toValue: 90,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: false,
          }),
          Animated.timing(this.zoomTextDescription, {
            toValue: 1.7,
            duration: this.durationAnimationIconWhenDrag * this.timeDilation,
            useNativeDriver: false,
          }),
        ]).start(),
      50,
    );
  };

  controlIconWhenDragInside = () => {
    this.setState({});

    this.zoomIconWhenDragInside.setValue(1.0);
    Animated.timing(this.zoomIconWhenDragInside, {
      toValue: 0.8,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: false,
    }).start(this.onAnimationIconWhenDragInsideComplete);
  };

  onAnimationIconWhenDragInsideComplete = () => {
    // alert('ff')
    this.isJustDragInside = false;
    this.setState({});
  };

  controlIconWhenDragOutside = () => {
    this.zoomIconWhenDragOutside.setValue(0.8);

    Animated.timing(this.zoomIconWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: false,
    }).start();
  };

  controlBoxWhenDragOutside = () => {
    this.zoomBoxWhenDragOutside.setValue(0.95);

    Animated.timing(this.zoomBoxWhenDragOutside, {
      toValue: 1.0,
      duration: this.durationAnimationIconWhenDrag * this.timeDilation,
      useNativeDriver: false,
    }).start();
  };

  // ------------------------------------------------------------------------------
  // Animation for jump emoticon when release finger0.01
  controlIconWhenRelease = () => {
    this.props.emojiSelected(this.whichIconUserChoose)
    this.zoomIconWhenRelease.setValue(1);
    this.moveUpDownIconWhenRelease.setValue(0);
    this.moveLeftIconLikeWhenRelease.setValue(20);
    this.moveLeftIconLoveWhenRelease.setValue(72);
    this.moveLeftIconHahaWhenRelease.setValue(154);
    this.moveLeftIconWowWhenRelease.setValue(173);
    this.moveLeftIconSadWhenRelease.setValue(226);
    this.moveLeftIconAngryWhenRelease.setValue(278);

    Animated.parallel([
      Animated.timing(this.zoomIconWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveUpDownIconWhenRelease, {
        toValue: 1,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconLikeWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconLoveWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconHahaWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconWowWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconSadWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
      Animated.timing(this.moveLeftIconAngryWhenRelease, {
        toValue: 0,
        duration: this.durationAnimationIconWhenRelease * this.timeDilation,
        useNativeDriver: false,
      }),
    ]).start();

    if (this.whichIconUserChoose === 0) {
    } else {
    }
  };

  render() {
    return (
      
      <View
      
       style={[styles.viewContainer,]}>
        {/* Body */}
        <View style={[styles.viewBody]} {...this.rootPanResponder.panHandlers}>
          {/* Top space */}
          {/* <View style={styles.viewTopSpace} /> */}

          {/* Content */}
          <View style={[styles.viewContent]}>
            {/* Box */}
            <Animated.View
              style={[
                styles.viewBox,
                {
                  opacity: this.fadeBoxAnim,
                  transform: [
                    {
                      scale: this.isDragging
                        ? this.previousIconFocus === 0
                          ? this.zoomBoxWhenDragInside
                          : 0.95
                        : this.isDraggingOutside
                        ? this.zoomBoxWhenDragOutside
                        : 1.0,
                    },
                  ],
                },
              ]}
            />

            {/* Group emoticon */}
            {this.renderGroupIcon()}

            {/*Group emoticon for jump*/}
            {/* {this.renderGroupJumpIcon()} */}

            {/* Button */}
            {this.renderButton()}
          </View>
        </View>
      </View>
   
    );
  }

  renderButton() {
    let tiltBounceIconAnim = this.tiltIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: ['0deg', '20deg', '-15deg', '0deg'],
    });
    let zoomBounceIconAnim = this.zoomIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 0.8, 1.15, 1],
    });
    let zoomBounceTextAnim = this.zoomIconAnim.interpolate({
      inputRange: [0, 0.2, 0.8, 1],
      outputRange: [1, 0.8, 1.15, 1],
    });

    let tiltBounceIconAnim2 = this.tiltIconAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '20deg'],
    });

    return (
      <TouchableOpacity
        style={[styles.viewBtn, {marginTop:'2%',zIndex:99999999,borderColor: this.getBorderColorBtn()}]}
        onPressIn={this.onTouchStart}
        onPressOut={this.onTouchEnd}>
        <Animated.Image
          source={this.getIconBtn()}
          style={[
            styles.imgLikeInBtn,
            {
              marginBottom:this.props.marginBottom?this.props.marginBottom:0,
              transform: [
                {
                  rotate: this.isLongTouch
                    ? tiltBounceIconAnim2
                    : tiltBounceIconAnim,
                },
                {
                  scale: this.isLongTouch
                    ? this.zoomIconAnim2
                    : zoomBounceIconAnim,
                },
              ],
            },
          ]}
        />
        <Animated.Text
        numberOfLines={1}
          style={[
            // styles.textBtn,
            {fontSize: 14,  color: 'gray',marginLeft:5,paddingRight:this.props.paddingRight,marginBottom:this.props.marginBottom?this.props.marginBottom:0,
            fontFamily: AppFontFamily.fontFamily.regular,

          },
            {
              transform: [
                {
                  scale: this.isLongTouch
                    ? this.zoomTextAnim2
                    : zoomBounceTextAnim,
                },
              ],
            },
          ]}>
          {this.getTextBtn()}
        </Animated.Text>
      </TouchableOpacity>
    );
  }

  getBorderColorBtn() {
    if (!this.isLongTouch && this.isLiked) {
      return '#3b5998';
    } else if (!this.isDragging) {
      switch (this.whichIconUserChoose) {
        case 1:
          return '#3b5998';
        case 2:
          return '#ED5167';
        case 3:
        case 4:
        case 5:
          return '#FFD96A';
        case 6:
          return '#F6876B';
        default:
          return 'grey';
      }
    } else {
      return 'grey';
    }
  }

  getColorTextBtn() {
    if (!this.isLongTouch && this.isLiked) {
      return '#3b5998';
    } else if (!this.isDragging) {
      switch (this.whichIconUserChoose) {
        case 1:
          return '#3b5998';
        case 2:
          return '#ED5167';
        case 3:
        case 4:
        case 5:
          return '#FFD96A';
        case 6:
          return '#F6876B';
        default:
          return 'grey';
      }
    } else {
      return 'grey';
    }
  }

  getIconBtn() {
    if (!this.isLongTouch && this.props.isLiked) {
      return images.like_static;
    } 
     else if (!this.isDragging) {
      // switch (  this.props.isDetail?this.props.timeLine?.detail?.reactionType? this.getReactionType(this.props.timeLine?.detail?.reactionType?.type):0: this.whichIconUserChoose) {
      switch (  this.props.isDetail?this.props.timeLine?.detail?.reactionType? this.getReactionType(this.props.timeLine?.detail?.reactionType?.type):0: this.getReactionType(this.props.reactionType)) {
        case 0:
          return images.like_static;
        case 1:
          return images.like_static_fill;
        case 2:
          return images.love_static;
        case 3:
          return images.wow_static;
        case 4:
          return images.sad_static;
        case 5:
          return images.angry_static;
        case 6:
          return images.thinking_static;
        default:
          return images.like_static;
      }
    }
     else {
      switch (  this.props.isDetail?this.props.timeLine?.detail?.reactionType? this.getReactionType(this.props.timeLine?.detail?.reactionType?.type):0: this.getReactionType(this.props.reactionType)) {
        case 0:
          return images.like_static;
        case 1:
          return images.like_static_fill;
        case 2:
          return images.love_static;
        // case 3:
        //   return images.haha_static;
        case 3:
          return images.wow_static;
        case 4:
          return images.sad_static;
        case 5:
          return images.angry_static;
        // case 6:
        //   return images.smilyEyes_static;
        case 6:
          return images.thinking;
        default:
          return images.like_static;
      }
    }
  }

  getTextBtn() {
    
    if (this.isDragging) {
      // return '';
      switch (this.props.isDetail?this.props.timeLine?.detail?.reactionType? this.getReactionType(this.props.timeLine?.detail?.reactionType?.type):0: this.getReactionType(this.props.reactionType)) {
        case 1:
          return I18n.t('Like');
        case 2:
          return I18n.t('Dislike');
        // case 3:
        //   return 'Rolling Eyes';
        case 3:
          return I18n.t('Smile');
        case 4:
          return I18n.t('Angry');
        case 5:
          return I18n.t('Rolling Eyes');
        // case 6:
        //   return 'Beaming Smile';
        case 6:
          return I18n.t('Thinking');
        default:
          return I18n.t('Like');
      }
    }
    // switch (this.props.isDetail?this.getReactionType(this.props.timeLine?.detail?.reactionType?.type): this.whichIconUserChoose) {
    switch (this.props.isDetail?this.props.timeLine?.detail?.reactionType? this.getReactionType(this.props.timeLine?.detail?.reactionType?.type):0: this.getReactionType(this.props.reactionType)) {
      case 1:
        return I18n.t('Like');
      case 2:
        return I18n.t('Dislike');
      // case 3:
      //   return 'Rolling Eyes';
      case 3:
        return I18n.t('Smile');
      case 4:
        return I18n.t('Angry');
      case 5:
        return I18n.t('Rolling Eyes');
      // case 6:
      //   return 'Beaming Smile';
      case 6:
        return I18n.t('Thinking');
      default:
        return I18n.t('Like');
    }
  }

  renderGroupIcon() {
    
    return (
      Platform.OS=='ios'?
      <Animated.View
      ref={this.props.ref}
        style={[
          styles.viewWrapGroupIcon,Platform.OS=='android'&&{alignItems:'flex-end',},
          {display:this.isLongTouch?'flex':'none', marginLeft: this.moveRightGroupIcon},
        ]}>{this.isLongTouch&&
          <View
           style={{
             elevation:4,
            borderRadius:20,
            height:"40%",
             shadowOpacity:5,
             shadowOffset:{height:5,width:5},
             backgroundColor:'#fff',
             shadowColor:'gray',
             padding:10,
             flexDirection:'row'
          }}>
        {/* Icon like */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(1,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 1 ? 
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Like</Text>
            </Animated.View>
           : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconLikeUp,
              transform: [
                {
                  // scale: this.isDragging
                  //   ? this.currentIconFocus === 1
                  //     ? this.zoomIconChosen
                  //     : this.previousIconFocus === 1
                  //     ? this.zoomIconNotChosen
                  //     : this.isJustDragInside
                  //     ? this.zoomIconWhenDragInside
                  //     : 0
                  //   : this.isDraggingOutside
                  //   ? this.zoomIconWhenDragOutside
                  //   : this.zoomIconLike,
                  scale: this.isDragging
                    ? this.currentIconFocus === 1
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 1
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLike,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.like_gif}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(2,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 1 ? 
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Like</Text>
            </Animated.View>
           : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconLikeUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 2
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 2
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLike,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.love_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon love */}
        {/* <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(3)}
        style={styles.viewWrapIcon}>
          
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 3
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 3
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLove,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.haha_gif}
            />
          </Animated.View>
        </TouchableOpacity> */}

        {/* Icon haha */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(3,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 3 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Haha</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconHahaUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 3
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 3
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconHaha,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.wow_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon wow */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(4,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 4 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Wow</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconWowUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 4
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 4
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconWow,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.sad_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon sad */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(5,true)} style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 5 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Sad</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconSadUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 5
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 5
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconSad,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.angry_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon angry */}
        {/* <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(7)}style={styles.viewWrapIcon}>
          
          <Animated.View
            style={{
              // marginBottom: this.pushIconAngryUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 7
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 7
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconAngry,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.smilyEyes}
            />
          </Animated.View>
        </TouchableOpacity> */}
    
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(6,true)}
        style={styles.viewWrapIcon}>
         
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 6
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 6
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconAngry,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.thinking}
            />
          </Animated.View>
        </TouchableOpacity>
    </View>
  }
      </Animated.View>
      :

      this.isLongTouch&&   <Animated.View
      ref={this.props.ref}
        style={[
          styles.viewWrapGroupIcon,Platform.OS=='android'&&{alignItems:'flex-end',},
          {display:this.isLongTouch?'flex':'none', marginLeft: this.moveRightGroupIcon},
        ]}>{this.isLongTouch&&
          <View
           style={{
             elevation:4,
            borderRadius:20,
            height:"40%",
             shadowOpacity:5,
             shadowOffset:{height:5,width:5},
             backgroundColor:'#fff',
             shadowColor:'gray',
             padding:10,
             flexDirection:'row'
          }}>
        {/* Icon like */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(1,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 1 ? 
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Like</Text>
            </Animated.View>
           : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconLikeUp,
              transform: [
                {
                  // scale: this.isDragging
                  //   ? this.currentIconFocus === 1
                  //     ? this.zoomIconChosen
                  //     : this.previousIconFocus === 1
                  //     ? this.zoomIconNotChosen
                  //     : this.isJustDragInside
                  //     ? this.zoomIconWhenDragInside
                  //     : 0
                  //   : this.isDraggingOutside
                  //   ? this.zoomIconWhenDragOutside
                  //   : this.zoomIconLike,
                  scale: this.isDragging
                    ? this.currentIconFocus === 1
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 1
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLike,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.like_gif}
            />
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(2,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 1 ? 
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Like</Text>
            </Animated.View>
           : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconLikeUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 2
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 2
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLike,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.love_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon love */}
        {/* <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(3)}
        style={styles.viewWrapIcon}>
          
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 3
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 3
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconLove,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.haha_gif}
            />
          </Animated.View>
        </TouchableOpacity> */}

        {/* Icon haha */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(3,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 3 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Haha</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconHahaUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 3
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 3
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconHaha,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.wow_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon wow */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(4,true)}
        style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 4 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Wow</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconWowUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 4
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 4
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconWow,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.sad_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon sad */}
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(5,true)} style={styles.viewWrapIcon}>
          {/* {this.currentIconFocus === 5 ? (
            <Animated.View
              style={[
                styles.viewWrapTextDescription,
                {
                  bottom: this.pushTextDescriptionUp,
                  transform: [{scale: this.zoomTextDescription}],
                },
              ]}>
              <Text style={styles.textDescription}>Sad</Text>
            </Animated.View>
          ) : null} */}
          <Animated.View
            style={{
              // marginBottom: this.pushIconSadUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 5
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 5
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconSad,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.angry_gif}
            />
          </Animated.View>
        </TouchableOpacity>

        {/* Icon angry */}
        {/* <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(7)}style={styles.viewWrapIcon}>
          
          <Animated.View
            style={{
              // marginBottom: this.pushIconAngryUp,
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 7
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 7
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconAngry,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.smilyEyes}
            />
          </Animated.View>
        </TouchableOpacity> */}
    
        <TouchableOpacity
        onPress={()=>this.handleWhenDragBetweenIcon(6,true)}
        style={styles.viewWrapIcon}>
         
          <Animated.View
            style={{
              transform: [
                {
                  scale: this.isDragging
                    ? this.currentIconFocus === 6
                      ? this.zoomIconChosen
                      : this.previousIconFocus !== 6
                      ? this.zoomIconNotChosen
                      : this.isJustDragInside
                      ? this.zoomIconWhenDragInside
                      : 0.8
                    : this.isDraggingOutside
                    ? this.zoomIconWhenDragOutside
                    : this.zoomIconAngry,
                },
              ],
            }}>
            <Image
              style={styles.imgIcon}
              source={images.thinking}
            />
          </Animated.View>
        </TouchableOpacity>
    </View>
  }
      </Animated.View>
    );
  }

  renderGroupJumpIcon() {
    let moveUpDownIcon = this.moveUpDownIconWhenRelease.interpolate({
      inputRange: [0, 0.4, 1],
      outputRange: [40, 100, 0],
    });

    return (
      <View
      style={[styles.viewWrapGroupJumpIcon,]}>
        {/*Icon like*/}
        {/* {this.whichIconUserChoose === 1 && !this.isDragging ?  */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconLikeWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
               source={images.like_gif}

            />
          </Animated.View>
         {/* : null} */}

        {/*Icon love*/}
        {/* {this.whichIconUserChoose === 2 && !this.isDragging ? ( */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconLoveWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.love_gif}
            />
          </Animated.View>
        {/* // ) : null} */}

        {/*Icon haha*/}
        {/* {this.whichIconUserChoose === 3 && !this.isDragging ? ( */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconHahaWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.haha_gif}

            />
          </Animated.View>
        {/* // ) : null} */}

        {/*Icon wow*/}
        {/* {this.whichIconUserChoose === 4 && !this.isDragging ? ( */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconWowWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.wow_gif}
            />
          </Animated.View>
        {/* // ) : null} */}

        {/*Icon sad*/}
        {/* {this.whichIconUserChoose === 5 && !this.isDragging ? ( */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconSadWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.sad_gif}
            />
          </Animated.View>
        {/* ) : null} */}

        {/*Icon angry*/}
        {/* {this.whichIconUserChoose === 6 && !this.isDragging ? ( */}
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconAngryWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.angry_gif}
            />
          </Animated.View>
          <Animated.View
            style={{
              width: 40,
              height: 40,
              left: this.moveLeftIconAngryWhenRelease,
              bottom: moveUpDownIcon,
              transform: [{scale: this.zoomIconWhenRelease}],
              position: 'absolute',
            }}>
            <Image
              style={styles.imgIcon}
              source={images.smilyEyes}
            />
          </Animated.View>
        {/* ) : null} */}
      </View>
    );
  }
}

function mapStateToProps(state) {
  return {
      timeLine: state.timeLine,

  };
}

export default connect(
  mapStateToProps
)(AnimationScreen);




