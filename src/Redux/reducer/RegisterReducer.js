import { ApiConstants } from "./../../Themes";

const initialState = {
  onLoad: false,
  error: null,
  result: null,
  status: 0,
  navigation: null
};

function register(state = initialState, action) {
  switch (action.type) {
    case ApiConstants.constants.API_REGISTER_LOAD:
      return { ...state, onLoad: true };

    case ApiConstants.constants.API_REGISTER_SUCCESS:
      return {
        ...state,
        onLoad: false,
        result: action.result.result,
        status: action.status
      };

    case ApiConstants.constants.API_REGISTER_FAIL:
      return {
        ...state,
        onLoad: false,
        error: action.error,
        status: action.status,
        navigation: null
      };

    case ApiConstants.constants.API_REGISTER_ERROR:
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

export default register;
