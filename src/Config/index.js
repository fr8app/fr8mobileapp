import AsyncStorage from '@react-native-async-storage/async-storage'
// const imageBaseUrl = "https://d2d4ia5b61zo7b.cloudfront.net/" //new Aws devv

//LIVE

// const socketBaseUrl = 'https://dev-api.fr8.ai'// dev

const bucketUrl = 'https://s3.us-east-2.amazonaws.com/fr8.ai-website-dev-content/'
const imageBaseUrl = "https://s3.us-east-2.amazonaws.com/fr8.ai-website-dev-content/" //new Aws devv



// public
// const socketBaseUrl = 'http://1.6.98.139:4003'// dev
// const showImageUrl = "http://1.6.98.139:4003/"  //harry changed local url
// const branchBaseUrl = "http://1.6.98.139:4003/sharing/"


// Dell


const socketBaseUrl = 'http://1.6.98.141:2033'// dev
const showImageUrl = "http://1.6.98.141:2033/"  //harry changed local url
const branchBaseUrl = "http://1.6.98.141:2033/sharing/"


//local urls

// const socketBaseUrl='http://192.168.3.174:6002'// parteek
// const showImageUrl = "http://192.168.3.174:6002/"  // local url
// const branchBaseUrl = "http://192.168.3.174:6002/sharing/"  //harry changed local url

const openTokApiKey = "46440032"
const version = 'v8'




// const imageBaseUrl = "http://1.6.98.142:4000/"
// const imageBaseUrl = "http://BAckend-ASG-771965392.us-east-2.elb.amazonaws.com/"
// const imageBaseUrl ="http://18.205.207.176:3000/" //new live
// const imageBaseUrl="http://192.168.3.174:7000/"//harry changed local url
// const imageBaseUrl ="http://192.168.3.173:7000/" //new live
// const imageBaseUrl ="http://192.168.3.176:8000/" //new live
// const imageBaseUrl ="http://backend-asg-771965392.us-east-2.elb.amazonaws.com/" //new live
// const imageBaseUrl ="http://192.168.3.120:7000/" //new live
// const imageBaseUrl ="https://api.fr8.ai/" //new live
// const imageBaseUrl = "" //new Aws devv

//Link used for sharing to other devices
// const showImageUrl = 'https://api.fr8.ai/'// live

// const showImageUrl ='http://1.6.98.142:4002/'

// const socketBaseUrl='https://api.fr8.ai'
// const socketBaseUrl='http://192.168.3.174:7000' //harry changed socket url

// const socketBaseUrl='http://BAckend-ASG-771965392.us-east-2.elb.amazonaws.com'
// const socketBaseUrl='http://1.6.98.142:4002'//  dell
// const socketBaseUrl='http://192.168.3.173:3011'
// const socketBaseUrl = 'http://192.168.3.176:4000'
// const socketBaseUrl = 'http://192.168.3.173:4000' //rajvir

// const socketBaseUrl='http://backend-asg-771965392.us-east-2.elb.amazonaws.com'
// const socketBaseUrl='https://api.fr8.ai'// live
// const openTokApiKey = "46410992"

// const openTokApiKey =  "46410992"




// const bucketUrl = 'https://d2d4ia5b61zo7b.cloudfront.net/'



//website    
// const branchBaseUrl = "https://www.fr8.ai/sharing/"

// const branchBaseUrl = "http://fr8.ai-website-prod.s3-website.us-east-2.amazonaws.com/sharing/"
// const branchBaseUrl="http://192.168.3.167:5000/sharing/"
// const branchBaseUrl="https://dev-web.fr8.ai/sharing/"
// const branchBaseUrl="http://1.6.98.139:5000/sharing/"


const getReactionType = (res) => {
  if (res) {
    switch (res) {
      case 'like':
        return require('../Images/emojiStatic/thumbs_up.png');
      case 'dislike':
        return require('../Images/emojiStatic/thumbs_down.png');
      // case 'rollingEyes':
      //   return 3;
      case 'grinningSmile':
        return require('../Images/emojiStatic/grinning_face_with_smiling_eyes.png');
      case 'angry':
        return require('../Images/emojiStatic/face_with_steam_from_nose.png');
      case 'confuse':
        return require('../Images/emojiStatic/face_with_rolling_eyes.png');
      // case 'beamingSmile':
      //   return 6;
      case 'thinking':
        return require('../Images/emojiStatic/thinking_face.png');
      default:
        return require('../Images/emojiStatic/thumbs_up.png');
    }
  }
  else {
    return 0
  }
}

let popUpRef

function setpopUpRef(ref) {
  popUpRef = ref;
}

function getPopRef() {
  return popUpRef
}
let popUpRef2

function setpopUpRef2(ref) {
  popUpRef2 = ref;
}
function getPopRef2() {
  return popUpRef2
}

let emailPopRed

//email popup reference set
function setEmailpopUpRef(ref) {
  emailPopRed = ref;
}


//email popup reference get
function getEmailpopUpRef() {
  return emailPopRed
}

const getUSerDetail = () => {
  try {
    return AsyncStorage.getItem("userDetails").then((userDetails) => {
      return userDetails;
    });
  } catch (error) {
  }
}
module.exports = {
  imageBaseUrl,
  openTokApiKey,
  branchBaseUrl,
  socketBaseUrl,
  version,
  showImageUrl,
  bucketUrl,
  getReactionType,
  getPopRef,
  setpopUpRef,
  getPopRef2,
  setpopUpRef2,
  getUSerDetail,
  setEmailpopUpRef,
  getEmailpopUpRef
};
