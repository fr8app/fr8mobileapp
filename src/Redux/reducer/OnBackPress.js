import { ApiConstants } from "./../../Themes";
import { DataManager, FetchApi } from "./../../Components";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null,
  valueIndex: 2
};

function onBackPress(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_LOGIN_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_LOGIN_SUCCESS:

      FetchApi.setAccessToken(action.result.result.data.data.access_token);
      DataManager.setAccessToken(action.result.result.data.data.access_token);
      DataManager.setUserDetails(action.result.result.data);
      return {
        ...state,
        onLoad: false,
        result: action.result.result.data,
        status: action.status,
        valueIndex: 3,
        navigation: null
      };

    case ApiConstants.constants.API_LOGIN_FAIL:
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

export default onBackPress;
