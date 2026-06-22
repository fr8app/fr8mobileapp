import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager,FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  selectedItem: null
};

function videoPlay(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_VIDEO_PLAY_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_VIDEO_PLAY_SUCCESS:

      return {
        ...state,
        onLoad: false,
        result: action.result.result.data,
        status: action.status,
        navigation: action.navigation.navigate("PostDetails", {
          item: action.item,
          index: action.index,
          likeDislikeype: action.likeDislikeType
        })
      };

    case ApiConstants.constants.API_VIDEO_PLAY_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_VIDEO_PLAY_UNAUTHENTICATED:
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

    case ApiConstants.constants.API_VIDEO_PLAY_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    default:
      return state;
  }
}
export default videoPlay;
