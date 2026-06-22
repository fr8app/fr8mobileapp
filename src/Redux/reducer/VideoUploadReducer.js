import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import { DataManager, FetchApi } from "./../../Components";
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null,
  selectedItem: null,
  postCreated: false,
};

function video(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_LOAD:
      return { ...state, onLoad: true };
    case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_SUCCESS:
      return { ...state, onLoad: false };
    case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR:
      return { ...state, onLoad: false };
    case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_FAIL:
      return { ...state, onLoad: false };

    case ApiConstants.constants.API_VIDEO_UPLOAD_LOAD:
      return { ...state, onLoad: true, postCreated: false };

    case ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS:
      console.log(" API_VIDEO_UPLOAD_SUCCESS video", action);
      return {
        ...state,
        onLoad: false,
        result: action.result.result,
        status: action.status,
        postCreated: action.postCreated,
      };

    case ApiConstants.constants.API_VIDEO_UPLOAD_FAIL:
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: null,
      };

    case ApiConstants.constants.API_VIDEO_UPLOAD_UNAUTHENTICATED:
      // const resetAction = StackActions.reset({
      //   index: 0,
      //   actions: [NavigationActions.navigate({ routeName: "FavouriteTerminal2" })]
      // });
      const resetAction = StackActions.replace("FavouriteTerminal2");

      DataManager.clearData();
      FetchApi.setAccessToken("");
      return {
        ...state,
        onLoad: false,
        result: action.result,
        status: action.status,
        navigation: action.navigation.dispatch(resetAction),
      };

    case ApiConstants.constants.API_VIDEO_UPLOAD_ERROR:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null,
      };

    default:
      return state;
  }
}
export default video;
