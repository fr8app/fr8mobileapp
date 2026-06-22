import { ApiConstants } from '../../Themes';

export function myPostAction(index,id,  navigation,load=true) {
    const action = {
        index:index,
        type: ApiConstants.constants.API_MY_POSTS_LOAD,
        id: id,
        navigation: navigation,
        load:load
    }
    return action;
}
export const deletePostInitiate = (data) => {
    const action = {
        type:ApiConstants.constants.DELETE_POST_INITIATE,
        payload: data
    }
    return action 
}
export const deletePostSuccess = (data) => {
    const action = {
        type:ApiConstants.constants.DELETE_POST_SUCCESS,
        payload: data
    }
    return action 
}
export const deletePostError = (data) => {
    const action = {
        type:ApiConstants.constants.DELETE_POST_ERROR,
        payload: data
    }
    return action 
}
export const onReachEndPost = (data) => {
    return {
        type: ApiConstants.constants.ON_REACH_END_POST_INITATE,
        payload: data
    }
}
// DELETE_POST_INITIATE:'DELETE_POST_INITIATE',
//   DELETE_POST_SUCCESS:'DELETE_POST_SUCCESS',
//   DELETE_POST_ERROR:'DELETE_POST_ERROR'