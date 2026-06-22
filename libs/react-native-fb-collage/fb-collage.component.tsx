import * as React from "react";
import {
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  Image,
  ActivityIndicator
} from "react-native";
import { Props, ImageSource, FuncStyle, StaticStyle } from "./fb-collage.type";
import staticStyles from "./fb-collage.style";
import { AppImages } from "../../src/Themes";
import { CachedImage } from "../../src/Components/react-native-cached-image-master";
import { imageBaseUrl } from "../../src/Config";
import Images from "./Images";

export default class FBCollage extends React.Component<Props> {
  private styles: StaticStyle;
  private delayTime: any;
  private firstPress: Boolean;
  private timer: any;
  private lastTime:any
  static defaultProps = new Props();

  constructor(props: Props) {
    super(props);
    this.styles = staticStyles(
      props.width,
      props.height,
      props.borderRadius,
      props.spacing
    );
    this.delayTime = 500;
    // bool to check whether user tapped once
    this.firstPress = true;
    // the last time user tapped
    this.lastTime = new Date();
    // a timer is used to run the single tap event
    this.timer = false;
  }

  __renderImage = (
    image: ImageSource,
    index: number,
    style?: ViewStyle,
    text?: string,
    blurRadius?: number
  ) => {
    const {
      images,
      imageOnPress,
      resizeMode,
      arrayLength,
      doublePress,
      textStyle: textStyleOverride,
      overlayStyle: overlayStyleOverride
    } = this.props;

    let imageData =
      image.type == "video"
        ? imageBaseUrl + image.thumbnail + "type=image"
        : imageBaseUrl + image.media + "type=image";

   

    const source =
      typeof imageData === "string"
        ? { uri: imageData.split("type=")[0], cache: "reload",imageThumbnail:image?.imageThumbnail?image?.imageThumbnail:imageData.split("type=")[0] }
        : imageData;

  
    const _onTap = (index, images) => {
  
      let now = new Date().getTime();
      if (this.firstPress) {
        this.firstPress = false;
  
        this.timer = setTimeout(() => {
         
          this.firstPress = true;
          imageOnPress && imageOnPress(index, images)
          this.timer = false;
        }, this.delayTime);
        // mark the last time of the press
        this.lastTime = now;
      } else {
        if (now - this.lastTime < this.delayTime) {
          this.timer && clearTimeout(this.timer);
            doublePress &&doublePress()
          this.firstPress = true;
        }
      }
    }
    
    return (
      <TouchableOpacity
        style={{
          ...(this.styles.BUTTON as ViewStyle),
          ...style,
          borderRadius: arrayLength == 1 ? 0 : 10
        }}
        onPress={() =>_onTap(index, images) }
        activeOpacity={0.8}
        key={`image${index}`}
      >
        <View
          style={[
            this.styles.FLEX as ViewStyle,
            images?.length == 1
              ? {
                  justifyContent: "center"
                }
              : {
                  justifyContent: "center",
                  alignItems: image.type == "video" ? "center" : "stretch"
                }
          ]}
        >
          {image.type == "video" ? (
            <ImageBackground
              source={source}
              resizeMode={images?.length == 1 ? "contain" : "cover"}
              // borderRadius={images.length == 1 ? 0 : 10}
              style={[
                images?.length == 1
                  ? {
                      alignItems: "center",
                      aspectRatio: !isNaN(image.width / image.height)?image.width / image.height:1.87,
                      justifyContent: "center"
                    
                    }
                  : {
                      alignItems: "center",
                      justifyContent: "center",
                      height: 500,
                      width: 300
                    }
              ]}
            >
              <CachedImage
                source={AppImages.images.play}
                style={{ height: 30, width: 30 }}
              />
            </ImageBackground>
          ) : (
            <Images
              onLoad={() => this.setState({ loading: false })}
            
              resizeMode={images?.length == 1 ? "stretch" : "cover"}
              source={source}
              style={[
            
                {
                  height: "100%",
                  width: "100%"
                }
              ]}
            />
          )}

    
          {text && (
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.4)",
                position: "absolute",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
                
              }}
            >
              <Text
                style={{
                  ...(this.styles.TEXT as TextStyle),
                  ...textStyleOverride
                }}
              >
                {"+" + text}
              </Text>
            </View>
          )}
        </View>
       
      </TouchableOpacity>
    );
  };

  __renderImages = (images: ImageSource[]) => {
    const length = images.length,
      check = length > 4,
      childs = check ? images.slice(0, 4) : images,
      text = check ? (length - 4).toString() : undefined;

    return (
      <View style={(this.styles.CONTAINER as FuncStyle)(length)}>
        {childs.map((image, index) => {
          if (index === 3)
            return this.__renderImage(
              images[3],
              4,
              (this.styles.IMAGE as FuncStyle)(length),
              text,
              text ? 4 : 0
            );
          else
            return this.__renderImage(
              image,
              index + 1,
              (this.styles.IMAGE as FuncStyle)(length)
            );
        })}
      </View>
    );
  };

  __renderContent = (images: ImageSource[]) => {
    return (
      <>
        <View style={this.styles.FLEX as ViewStyle}>
          {this.__renderImage(images[0], 0, this.styles.FLEX as ViewStyle)}
        </View>
        {images.length > 1 && this.__renderImages(images.slice(1))}
      </>
    );
  };

  render() {
    const { images, style: styleOverride } = this.props;

    return (
      <View
        style={{
          ...(this.styles.VIEW as ViewStyle),
          ...styleOverride
        }}
      >
        {this.__renderContent(images)}
      </View>
    );
  }
}
