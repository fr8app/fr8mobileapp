import { ApiConstants } from '../../Themes';

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    status: 0,
    navigation: null,
    userData: null
};


function checkUser(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_CHECK_USER_LOAD:
            return { ...state, onLoad: true, userData: action };

        case ApiConstants.constants.API_CHECK_USER_SUCCESS:
           
            return { ...state, onLoad: false, result: action.result.result, status: action.status, navigation: action.navigation.navigate("OTP") };

        case ApiConstants.constants.API_CHECK_USER_FAIL:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        case ApiConstants.constants.API_CHECK_USER_ERROR:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        default:
            return state;
    }
}

export default checkUser;