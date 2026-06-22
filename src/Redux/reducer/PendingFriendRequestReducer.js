
import {
    ApiConstants
} from './../../Themes';
// import {
//     StackActions,
//     NavigationActions
// } from 'react-navigation';
import { DataManager } from "./../../Components";
import { StackActions } from '@react-navigation/native';

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    navigation: null,
    selectedItem: null
};

function pendingFriendRequest(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_PENDING_FRIEND_REQUEST_LOAD:
            return {
                ...state, onLoad: true
            };

        case ApiConstants.constants.API_PENDING_FRIEND_REQUEST_SUCCESS:
            return {
                ...state, onLoad: false, result: action.result.result.data.listRequests, status: action.status,
            };

        case ApiConstants.constants.API_PENDING_FRIEND_REQUEST_FAIL:
            return {
                ...state, onLoad: false, result: [], status: action.status, navigation: null
            };

        case ApiConstants.constants.API_PENDING_FRIEND_REQUEST_UNAUTHENTICATED:
            // const resetAction = StackActions.reset({
            //     index: 0,
            //     actions: [NavigationActions.navigate({
            //         routeName: 'OnBoarding'
            //     })],
            // });
            // const resetAction= StackActions.replace('FavouriteTerminal2')

            DataManager.clearData()
            return {
                ...state, onLoad: false, result: [], status: action.status,
                //  navigation: action.navigation.dispatch(resetAction)
            };

        case ApiConstants.constants.API_PENDING_FRIEND_REQUEST_ERROR:
            return {
                ...state, onLoad: false, error: action.error, status: action.status, navigation: null
            };

        case ApiConstants.constants.API_FRIEND_REQUEST_SUCCESS:
            // if(action.index){
                state.result.splice(action.index, 1)
            // }
            return {
                ...state,
            };

        default:
            return state;
    }
}
export default pendingFriendRequest;