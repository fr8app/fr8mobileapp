import { ApiConstants } from './../../Themes';
// import { StackActions, NavigationActions } from 'react-navigation';
import { DataManager } from "./../../Components";
import { StackActions } from '@react-navigation/native';

const initialState = {
    onLoad: false,
    error: null,
    result: [],
    status: 0,
    navigation: null,
    selectedItem: null,
    currentPage: 1,
    nextPageurl: null,
    lastPage: null,
    total:0,
    latestArray:[]
};

function myPosts(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_MY_POSTS_LOAD:
            return { ...state, onLoad: action.load };

        case ApiConstants.constants.API_MY_POSTS_SUCCESS:
            if (action.index == 0) {
                state.result = action?.result?.result?.data?.data
            }
            else {
                Array.prototype.push.apply(state.result, action.result.result.data.data)
            }
            // console.log('action.result.result.data.current_page',action.result.result.data.current_page,"Ff",action.result.result.data);
            return { ...state, onLoad: false,
                currentPage: action.result.result.data.current_page,
                nextPageurl: action.result.result.data.next_page_url,
                lastPage: action.result.result.data.last_page,
                latestArray:action?.result?.result?.data?.data,
                // total: action.result.result.data.total,
                collection: action.result.result.data, status: action.status };

        case ApiConstants.constants.API_MY_POSTS_FAIL:
            return { ...state, onLoad: false, result: [], status: action.status, navigation: null };

        case ApiConstants.constants.API_LIKE_DISLIKE_SUCCESS:
            if (action.likeDislikeType == "myPost") {
                state.result[action.index].like_count = action.result.result.data.like_count
                state.result[action.index].dislike_count = action.result.result.data.dislike_count
                state.result[action.index].is_like = action.result.result.data.like_status
            }
            return { ...state, onLoad: false, };

        case ApiConstants.constants.API_LIKE_DISLIKE_FAIL:
            return { ...state, onLoad: false, };

        case ApiConstants.constants.API_MY_POSTS_UNAUTHENTICATED:
            // const resetAction = StackActions.reset({
            //     index: 0,
            //     actions: [NavigationActions.navigate({ routeName: 'OnBoarding' })],
            // });
            const resetAction= StackActions.replace('FavouriteTerminal2')

            DataManager.clearData()
            return { ...state, onLoad: false, result: [], status: action.status, 
                navigation: action.navigation.dispatch(resetAction) 
            };

        case ApiConstants.constants.API_MY_POSTS_ERROR:
            return { ...state, onLoad: false, error: action.error, status: action.status, navigation: null };

        case ApiConstants.constants.API_VIDEO_PLAY_SUCCESS:
            if (action.likeDislikeType !== "terminal") {
                state.result[action.index].view_count = Number(state.result[action.index].view_count) + Number(1)
                return { ...state, onLoad: false, };
            }
            else {
                return { ...state, onLoad: false, };
            }
        case ApiConstants.constants.DELETE_POST_INITIATE:
            return { ...state, onLoad: true }

        case ApiConstants.constants.DELETE_POST_SUCCESS:

            const index = state.result.findIndex((data) => {
                return data.id === action.id
            })

            state.result.splice(index, 1)

            return { ...state, deleteSuccess: 'success', onLoad: false }
        case ApiConstants.constants.DELETE_POST_ERROR:
            return { ...state, deleteError: 'error', onLoad: false }
        case ApiConstants.constants.ON_REACH_END_POST_SUCCESS:
            return {
                ...state,
                result: [...state.result, ...action.payload.data],
                collection: action.payload
            }
        case ApiConstants.constants.ON_REACH_END_POST_ERROR:
            return {
                ...state,

            }
            case "CLEAR_PROFILE_DATA":
                return{
                    ...state,result:[]
                }
        default:
            return state;
    }
}
export default myPosts;