import { ApiConstants } from '../../Themes';
const initialState = {
    onLoad: false,
    result: [],
    unread_notification: 0,
    currentPage: 1,
    nextPageurl: null,
    lastPage: null,
    total: 0,
}

export default function (state = initialState, { page,type, payload,loader, likeDislikeType, index, result }) {
    switch (type) {
        case ApiConstants.constants.NOTIFY_NOTIFICATION_INITATE:
            return {
                ...state,
                onLoad: loader,
                currentPage: page

            }
        case ApiConstants.constants.NOTIFY_NOTIFICATION_SUCCESS:
            if (page == 1) {
                state.result=payload
            }
            else {
                Array.prototype.push.apply(state.result.result.data.result,payload.result.data.result)
            }
            return {
                ...state,
                onLoad: false,
                unread_notification: payload.result.data.unread_notification,
                currentPage: payload.result.data.current_page,
                nextPageurl: payload.result.data.next_page_url,
                lastPage: payload.result.data.last_page,
                total: payload.result.data.total
            }
        case ApiConstants.constants.NOTIFY_NOTIFICATION_ERROR:
            return {
                ...state,
                onLoad: false,
                error: payload
            }
        case ApiConstants.constants.API_LIKE_DISLIKE_SUCCESS:
            if (likeDislikeType === 'Notification') {
               
                state.result.result.data.result[index].post.like_count = result.result.data.like_count
                state.result.result.data.result[index].post.dislike_count = result.result.data.dislike_count
                state.result.result.data.result[index].post.is_like = result.result.data.like_status
                 }
            return {
                ...state,
                onLoad: false,
            }
        case ApiConstants.constants.API_NOTIFICATION_READ_LOAD:
            return {
                ...state,
                onLoad: true,
            }
        case ApiConstants.constants.API_NOTIFICATION_READ_SUCCESS:

            if (state.result.result.data.result[index].status == null) {
                
            }
            state.unread_notification = state.unread_notification > 0 ? state.unread_notification - 1 : 0
            state.result.result.data.result[index].status = 'readed'

            return {
                ...state, onLoad: false,
            }
        case ApiConstants.constants.API_NOTIFICATION_READ_FAIL:
            return {
                ...state, onLoad: false
            }
        case ApiConstants.constants.API_NOTIFICATION_READ_ERROR:
            return {
                ...state, onLoad: false
            }

        case ApiConstants.constants.API_NOTIFICATION_DELETE_LOAD:
            return {
                ...state,
                onLoad: true,
            }
        case ApiConstants.constants.API_NOTIFICATION_DELETE_SUCCESS:


            if (state.result.result.data.result[index].status == null) {
                state.unread_notification = state.unread_notification > 0 ? state.unread_notification - 1 : 0

            }
            state.result.result.data.result.splice(index, 1)
            return {
                ...state, onLoad: false,
            }
        case ApiConstants.constants.API_NOTIFICATION_DELETE_FAIL:
            return {
                ...state, onLoad: false
            }
        case ApiConstants.constants.API_NOTIFICATION_DELETE_ERROR:
            return {
                ...state, onLoad: false
            }
        case 'BADGE_INCREASE':
            return {
                ...state,
                onLoad: false,
                unread_notification: state.unread_notification + 1
            }
        default:
            return state
    }
}
