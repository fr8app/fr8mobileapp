import { TerminalModal } from "./../../Components";
import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

var initialState = {
  onLoad: false,
  error: null,
  result: [],
  terminalRoutes: [],
  terminalRating: [],
  terminalCheckinPost:[],
  status: 0,
  navigation: null,
  post: [],
  index: null,
  currentPage: 1,
  nextPageUrl: null,
  total: 0,
  totalUser:0,
  averageRating:null,
  apiSuccess:false,
  latestArrayCheckinPost:[],
  latestArrayRoute:[],
  latestArrayRating:[],
};

function terminalDetail(state = initialState, action) {
  switch (action.type) {
    case "USER_FEACHED_FROM_SOCKET":
      console.log('socket user number data fetched to reducer',action.data);
    return{
      ...state,onLoad:false,totalUser:action.data
    }
    case ApiConstants.constants.API_TERMINAL_DETAIL_LOAD:
    
      return {
        
        ...initialState,
        onLoad: true
      };

    case ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS:
      console.log('action.feedaction.feed',action.feed,action.result);
      if (action.feed) {
        return {
          ...state,
          onLoad: false,
          // post: action.result.result.data.data,
          nextPageUrl: action.result.result.data.next_page_url
        }
      } else {
        console.log(' action.result.result.data.terminal action.result.result.data.terminal', action.result.result.data.terminal);
        // let posts = action.result.result.data.post,
        //   postResult = TerminalModal.getVideoData(posts.data);
        return {
          ...state,
          onLoad: false,
          result: action.result.result.data.terminal,
          averageRating: action.result.result.data.terminal?.averageRating,
          // currentPage: posts.current_page,
          // nextPageUrl: posts.next_page_url,
          // post: [...posts.data],
          status: action.status,
          // total: posts.total,
          totalUser:action.result.result.data.terminal.total_users
        };
      }
    case ApiConstants.constants.API_TERMINAL_DETAIL_FAIL:
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_TERMINAL_DETAIL_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      const resetAction= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: action.navigation.dispatch(resetAction)
      };

    case ApiConstants.constants.API_TERMINAL_DETAIL_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

      case "API_TERMINAL_RATE_ADD_LOAD":
    
        return {
          
          ...state,
          onLoad: true
        };
  
      case "API_TERMINAL_RATE_ADD_SUCCESS":
     
          return {
            ...state,
            onLoad: false,
            averageRating:action.rates,
            apiSuccess:true
            
          };
        
      case "API_TERMINAL_RATE_ADD_FAIL":
        return {
          ...state,
          onLoad: false,
          averageRating:state.averageRating
        };
  
    case "API_TERMINAL_RATE_ADD_ERROR":
      return {
        ...state,
        onLoad: false,
        averageRating:state.averageRating
      };

  
      case "API_CHECKIN_BY_TERMINAL_LOAD":
    
        return {
          ...state,
          onLoad: false
        };
  
      case "API_CHECKIN_BY_TERMINAL_SUCCESS":
     console.log('action.result.result.data',action.result.result.data);
     if(action.index==0){
      state.terminalCheckinPost=action.result.result.data.data
     }
     else{

       Array.prototype.push.apply(state.terminalCheckinPost, action.result.result.data.data)
     }

          return {
            ...state,
            onLoad: false,
            // terminalCheckinPost:action.result.result.data.data,
            latestArrayCheckinPost:action.result.result.data.data,
          };
        
      case "API_CHECKIN_BY_TERMINALL_FAIL":
        return {
          ...state,
          onLoad: false,
        };
  
    case "API_CHECKIN_BY_TERMINAL_ERROR":
      return {
        ...state,
        onLoad: false,
      };

  
  
      case ApiConstants.constants.API_TERMINAL_DETAIL_LOAD_END:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_TERMINAL_DETAIL_SUCCESS_END:
      if (action.feed) {
        Array.prototype.push.apply(state.post, action.result.result.data.data)
        return {
          ...state,
          onLoad: false,
          nextPageUrl: action.result.result.data.next_page_url
        }
      } else {

        let postss = action.result.result.data.post,
          postResults = TerminalModal.getVideoData(postss.data);

        for (let i in postResults) {
          state.post.push(postResults[i]);
        }
        return {
          ...state,
          onLoad: false,
          result: action.result.result.data.terminal,
          currentPage: postss.current_page,
          nextPageUrl: postss.next_page_url,
          total: action.result.result.data.total,
          status: action.status
        };
      }


    case ApiConstants.constants.API_TERMINAL_DETAIL_FAIL_END:
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_TERMINAL_DETAIL_UNAUTHENTICATED_END:
      // const resetActions = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      const resetActions= StackActions.replace('FavouriteTerminal2')

      DataManager.clearData()
      FetchApi.setAccessToken('')
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: action.navigation.dispatch(resetActions)
      };

    case ApiConstants.constants.API_TERMINAL_DETAIL_ERROR_END:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    /********** LIKE dislike cases */
    case ApiConstants.constants.API_LIKE_DISLIKE_LOAD:
      return { ...state, onLoad: true, index: action.index };

    case ApiConstants.constants.API_LIKE_DISLIKE_SUCCESS:
      if (action.likeDislikeType == "terminal") {
        state.post[state.index].like_count =
          action.result.result.data.like_count;
        state.post[state.index].dislike_count =
          action.result.result.data.dislike_count;
        state.post[state.index].like_status =
          action.result.result.data.like_status;
      }
      return { ...state, onLoad: false };

    case ApiConstants.constants.API_LIKE_DISLIKE_FAIL:
      return { ...state, onLoad: false };

    case ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS:
console.log("API_VIDEO_UPLOAD_SUCCESS TD");
      let result = TerminalModal.getVideoObject(action?.result?.result?.data);
      action.screen ? { ...state, onLoad: false } : { ...state, post: [result, ...state.post], onLoad: false };

    case ApiConstants.constants.API_FOLLOW_UNFOLLOW_TERMINAL_SUCCESS:
      if (state.result.is_follow == 0) {
        state.result.is_follow = 1;
        state.result.followers_count =
          Number(state.result.followers_count) + Number(1);
      } else {
        state.result.is_follow = 0;
        state.result.followers_count =
          Number(state.result.followers_count) - Number(1);
      }

      return { ...state, onLoad: false };

    case ApiConstants.constants.CLEAR_TERMINAL_DETAIL:
      return { ...state, onLoad: false, result: [], post: [] };
    case ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_INITIATE:
      return { ...state, onLoad: true, }
    case ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_SUCCESS:
      return { ...state, onLoad: false }
    case ApiConstants.constants.REPORT_TERMINAL_POST_DETAIL_ERROR:
      return { ...state, onLoad: false }
    case ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_INITATE:
      return {
        ...state,
        onLoad: true,
      }
    case ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_SUCCESS:
      const { payload } = action
      const index = state.post.findIndex((data) => {
        return data.id === payload
      })
      state.post.splice(index, 1)
      return {
        ...state,
        onLoad: false,

      }
    case ApiConstants.constants.DELETE_POST_TERMINAL_DETAIL_ERROR:
      return {
        ...state,
        onLoad: false,
      }
    case "API_TIMELINEPOST_BY_TERMINAL_LOAD":
      return {
        ...state,
        onLoad: false,
      }
    case "API_TIMELINEPOST_BY_TERMINAL_SUCCESS":
      console.log('action.result.result',action.result.result.data.data);
      if(action.index==0){
        state.terminalRoutes=action.result.result.data.data
       }
       else{
      Array.prototype.push.apply(state.terminalRoutes, action.result.result.data.data)
       }
      return {
        ...state,
        // terminalRoutes:action.result.result.data.data,
        onLoad: false,
        latestArrayRoute:action.result.result.data.data
      }
    case "API_TIMELINEPOST_BY_TERMINAL_FAIL":
      return {
        ...state,
        onLoad: false,
      }
    case "API_TIMELINEPOST_BY_TERMINAL_ERROR":
      return {
        ...state,
        onLoad: false,
      }



      ////rating
    case "API_RATING_BY_TERMINAL_LOAD":
      return {
        ...state,
        onLoad: false,
      }
    case "API_RATING_BY_TERMINAL_SUCCESS":
      if(action.index==0){
        state.terminalRating=action.result.result.data.list
       }
       else{
      Array.prototype.push.apply(state.terminalRating, action.result.result.data.list)
       }

      return {
        ...state,
        // terminalRating:action.result.result.data.list,
        onLoad: false,
        latestArrayRating:action.result.result.data.list
      }
    case "API_RATING_BY_TERMINAL_FAIL":
      return {
        ...state,
        onLoad: false,
      }
    case "API_RATING_BY_TERMINAL_ERROR":
      return {
        ...state,
        onLoad: false,
      }
    case ApiConstants.constants.ADD_Count:
      return {
        ...state,
        result: {
          ...state.result,
          today_total_post: state.result.today_total_post + action.payload
        }

      }
    default:
      return state;
  }
}
export default terminalDetail;
