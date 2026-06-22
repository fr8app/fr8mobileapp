import React, { Component } from 'react';
import { View, Image, ActivityIndicator, ImageBackground, Animated, Platform } from 'react-native'
import { imageBaseUrl } from '../../src/Config';

export default class Images extends Component {
  constructor(props) {
    super(props)
    this.state = {
      imageLoad: false
    }
    this.thumbnailAnimated = new Animated.Value(0);
    this.imageAnimated = new Animated.Value(0);
  }
  handleThumbnailLoad = () => {
    this.setState({ imageLoad: false })
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  }
  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  }
  render() {
    return (
      <View style={{ height: '100%', width: "100%", }}>
        {
          Platform.OS == 'ios' ?

            <Animated.Image
              key={Platform.OS == 'ios' ? this.props.source?.imageThumbnail ? this.props.source?.imageThumbnail : this.props.source?.uri : 'thumb'}
              onLoadEnd={() => this.setState({ imageLoad: false })}
              onLoadStart={() => this.setState({ imageLoad: true })}
              resizeMode={this.props.resizeMode}

              {...this.props}
              source={{ uri: imageBaseUrl + this.props.source?.imageThumbnail }}
              style={[this.props.style, { opacity: 1 }]}
              // onLoad={this.handleThumbnailLoad}
              blurRadius={1}
            />
            :

            <Animated.Image
              // onLoadEnd={() => this.setState({ imageLoad: false })}
              // onLoadStart={() => this.setState({ imageLoad: true })}
              resizeMode={this.props.resizeMode}

              {...this.props}
              source={{ uri: imageBaseUrl + this.props.source?.imageThumbnail }}
              style={[this.props.style, { opacity: this.thumbnailAnimated }]}
              onLoad={this.handleThumbnailLoad}
              blurRadius={1}
            />
        }
        {Platform.OS == 'ios' ?
          <Animated.Image
            key={Platform.OS == 'ios' ? this.props.source?.uri : 'image'}
            resizeMode={this.props.resizeMode}
            {...this.props}
            source={{ uri: Platform.OS == 'ios' ? this.props.source?.uri + "?" + this.props.source?.uri?.split('.')[0] : this.props.source?.uri }}
            style={[this.props.style, {

              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,

            }, { opacity: this.imageAnimated }]}
            onLoad={this.onImageLoad}
          />
          :
          <Animated.Image
            resizeMode={this.props.resizeMode}
            {...this.props}
            source={{ uri: Platform.OS == 'ios' ? this.props.source?.uri + "?" + this.props.source?.uri?.split('.')[0] : this.props.source?.uri }}
            style={[this.props.style, {

              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              top: 0,

            }, { opacity: this.imageAnimated }]}
            onLoad={this.onImageLoad}
          />
        }
        {this.state.imageLoad &&
          <View style={{ backgroundColor: 'rgb(240,240,240)', alignSelf: 'center', height: "100%", position: 'absolute', width: "100%", justifyContent: 'center' }}>
            <ActivityIndicator size={25} />
          </View>
        }
        {/* <ImageBackground
                onLoadEnd={()=>this.setState({imageLoad:false})}
                onLoad={()=>this.setState({imageLoad:false})}
                onLoadStart={()=>this.setState({imageLoad:true})}
                    resizeMode={this.props.resizeMode}
                    style={this.props.style}
                    source={{uri:this.props.source?.uri}}
                />
                {this.state.imageLoad && 
                
                <View style={{backgroundColor:'rgb(240,240,240)', alignSelf: 'center',height:"100%",position:'absolute',width:"100%",justifyContent:'center' }}>
                    <ActivityIndicator size={25} />
                </View>
                } */}
      </View>
    );
  }
};