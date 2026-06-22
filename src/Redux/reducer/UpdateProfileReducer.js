import { ApiConstants } from "./../../Themes";
// import { StackActions, NavigationActions } from "react-navigation";
import DataManager from '../../Components/DataManager/index'
import {FetchApi} from '../../Components'
import { StackActions } from "@react-navigation/native";

const initialState = {
  onLoad: false,
  error: null,
  result: [],
  status: 0,
  navigation: null,
  selectedItem: null,
  profileData: ""
};

function updateUserProfile(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_UPDATE_USER_PROFILE_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_UPDATE_USER_PROFILE_SUCCESS:
     
      DataManager.setUserDetails({ 'data': action.result.result.data.user_id })
    
      DataManager.getAccessToken().then(response => {
        if (response !== null) {
        } else {
          accessToken = null;
        }
      });
      return {
        ...state,
        onLoad: false,
        result: action.result.result.data,
        status: action.status,
        // navigation: action.navigation.navigate("UserNamess")
      };

    case "saveProfileData":
      state.profileData = action;
      return { ...state };

    case ApiConstants.constants.API_UPDATE_USER_PROFILE_FAIL:
      return {
        ...state,
        onLoad: false,
        result: [],
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_UPDATE_USER_PROFILE_UNAUTHENTICATED:
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

    case ApiConstants.constants.API_UPDATE_USER_PROFILE_ERROR:
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
export default updateUserProfile;
