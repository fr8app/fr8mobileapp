import { ApiConstants } from './../../Themes'

const initialState = {
    onLoad: false,
    error: null,
    result: null,
    array: [],
    status: 0,
    navigation: null,
    currentPage: 1,
    nextPageurl: null,
    lastPage: null,
    mediaImages: [],
    like: 0,
    share: 0,
    // comment: 0,
    total: 0,
    detail: null,
    comment: [],
    disable: true,
    postShared: false,
    fromDeleted: false,
    isLoad: false,
    imageCount: 0,
    vieoCount: 0,
    imageLike: false,
    imageHeight: 0,
    imageWidth: 0,
    sharedUserList: [],
    likedUserList: [],
    reactionCount: {
        angry: 0,
        beamingSmile: 0,
        confuse: 0,
        dislike: 0,
        grinningSmile: 0,
        like: 0,
        rollingEyes: 0,
        thinking: 0,
        latestArray:[]
    }
};

function timeLine(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_TIMELINE_GET_LOAD:
            return { ...state, onLoad: action.loader, currentPage: action.page, isLoad: false };

        case ApiConstants.constants.API_TIMELINE_GET_SUCCESS:
            let result = action.result.result.data.data

            if (action.page == 1) {
                state.array = result
            }
            else {
                Array.prototype.push.apply(state.array, result)
            }

            return {
                ...state,
                onLoad: false,
                result: action.result.result,
                isLoad: true,
                latestArray:action.result.result.data.data,
                currentPage: action.result.result.data.current_page,
                nextPageurl: action.result.result.data.next_page_url,
                lastPage: action.result.result.data.last_page,
                // total: action.result.result.data.total
            };

        case ApiConstants.constants.API_TIMELINE_GET_FAIL:
            return { ...state, onLoad: false, isLoad: true };

        case ApiConstants.constants.API_TIMELINE_GET_ERROR:
            return { ...state, onLoad: false, isLoad: true };

        //add the timeline post

        case ApiConstants.constants.API_TIMELINE_ADD_LOAD:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_ADD_SUCCESS:

            return { ...state, onLoad: false, postShared: true, disable: false }
        case ApiConstants.constants.API_TIMELINE_ADD_FAIL:

            return { ...state, onLoad: false, disable: false }
        case ApiConstants.constants.API_TIMELINE_ADD_ERROR:
            return { ...state, onLoad: false, disable: false }
        case ApiConstants.constants.API_TIMELINE_LIKE_LOAD:

            return { ...state, onLoad: action.loader }

        case ApiConstants.constants.API_TIMELINE_LIKE_SUCCESS:
            console.log('API_TIMELINE_LIKE_SUCCESS', action)

            // state.imageLike = !action.isLike
            let timeLinePostDetail = { ...state.detail }
            // console.log('timeLinePostDetail',timeLinePostDetail);
            console.log('timeLIneArray[index]', timeLinePostDetail, action?.result?.result?.data);
            if (timeLinePostDetail._id == action.id) {
                if (action?.result?.result?.data) {
                    if (action?.result.result?.data?.type == '') {
                        timeLinePostDetail.reactionType = null
                        timeLinePostDetail.is_like = false
                    }
                    else {
                        timeLinePostDetail.reactionType = action?.result?.result?.data
                        timeLinePostDetail.is_like = true
                    }
                }
                else {
                    timeLinePostDetail.reactionType = null
                    timeLinePostDetail.is_like = false
                }
            }

            let timeLIneArray = [...state.array];
            timeLIneArray.map((x, index) => {
                if (x._id == action.id) {
                    console.log('timeLIneArray[index]', timeLIneArray[index], action?.result?.result?.data);
                    if (action?.result?.result?.data) {
                        if (action?.result.result?.data?.type == '') {
                            timeLIneArray[index].is_like = false
                            timeLIneArray[index].isDoubleTabLiked = false
                            state.imageLike = false
                            timeLIneArray[index].reactionType = null

                        }
                        else {
                            timeLIneArray[index].is_like = true
                            timeLIneArray[index].isDoubleTabLiked = true
                            state.imageLike = true
                            timeLIneArray[index].reactionType = action?.result?.result?.data
                            // timeLIneArray[index].is_like = false
                            // state.imageLike=false
                            // timeLIneArray[index].reactionType=null
                        }
                    }
                    else {
                        timeLIneArray[index].reactionType = null
                        timeLIneArray[index].is_like = false
                        timeLIneArray[index].isDoubleTabLiked = false
                        state.imageLike = false
                    }
                    // if(x.reactionType){

                    // timeLIneArray[index].reactionType=action?.result?.result?.data
                    timeLIneArray[index].total_likes = action?.result?.result?.data?.like_count

                    // }
                    // else{

                    // }
                    // if (x.is_like == true) {
                    //     x.total_likes = x.total_likes - 1
                    //     x.is_like = false
                    // }
                    // else {
                    //     x.total_likes = x.total_likes + 1
                    //     x.is_like = true
                    // }
                }
            })
            console.log('timeLinePostDetail', timeLinePostDetail);
            return { ...state, onLoad: false, array: timeLIneArray, detail: timeLinePostDetail }
        case ApiConstants.constants.API_TIMELINE_LIKE_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_LIKE_ERROR:

            return { ...state, onLoad: false }


        //time line share
        case ApiConstants.constants.API_TIMELINE_SHARE_LOAD:

            return { ...state, onLoad: true }

        case ApiConstants.constants.API_TIMELINE_SHARE_SUCCESS:
            let timeLIneShareArray = [...state.array];
            timeLIneShareArray.map((x, index) => {
                if (x._id == action.id) {

                    x.total_shares = x.total_shares + 1


                }
            })
            return { ...state, onLoad: false, array: timeLIneShareArray, postShared: true }
        case ApiConstants.constants.API_TIMELINE_SHARE_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_SHARE_ERROR:

            return { ...state, onLoad: false }

        //time line share list
        case ApiConstants.constants.API_TIMELINE_SHARE_LIST_LOAD:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_SHARE_LIST_SUCCESS:
            console.log('action.result', action.result.result.data.list);
            // let timeLIneShareArray = [...state.array];
            let sharedUserList = action.result.result.data.list

            return { ...state, onLoad: false, sharedUserList: sharedUserList }
        case ApiConstants.constants.API_TIMELINE_SHARE_LIST_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_SHARE_LIST_ERROR:

            return { ...state, onLoad: false }
        //time line like list
        case ApiConstants.constants.API_TIMELINE_LIKE_LIST_LOAD:

            return { ...state, onLoad: true }

        case ApiConstants.constants.API_TIMELINE_LIKE_LIST_SUCCESS:
            console.log('action.result', action.result.result.data.list);
            // let timeLIneShareArray = [...state.array];
            let likedUserList = action.result.result.data.list

            return { ...state, onLoad: false, likedUserList: likedUserList, reactionCount: action?.result?.result?.data?.reactionCount }
        case ApiConstants.constants.API_TIMELINE_LIKE_LIST_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_LIKE_LIST_ERROR:

            return { ...state, onLoad: false }
        //comment reducer
        case ApiConstants.constants.API_TIMELINE_COMMENT_LOAD:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_COMMENT_SUCCESS:
            console.log('action.result.result.data.commentPost', action.result.result.data.commentPost);
            let timeLIneCommentArray = [...state.array];
            let commentData = [...state.comment]
            if (action.commentId) {
                commentData.map((x, index) => {
                    if (x._id == action.commentId) {

                        commentData[index].subComments.push({
                            likes: 0,
                            comment_creator: action.result.result.data.commentPost.comment_creator._id,
                            user: {
                                _id: action.result.result.data.commentPost.comment_creator._id,
                                userName: action.result.result.data.commentPost.comment_creator.userName,
                                name: action.result.result.data.commentPost.comment_creator.name,
                                profile: action.result.result.data.commentPost.comment_creator.profile
                            },
                            description: action.result.result.data.commentPost.description,
                            post_creator: action.result.result.data.commentPost.post_creator,
                            post_id: action.result.result.data.commentPost.post_id,
                            _id: action.result.result.data.commentPost._id
                        })
                        timeLIneCommentArray.map((x, index) => {
                            if (x._id == action.id) {

                                x.total_comments = x.total_comments + 1
                            }
                        })
                        // x.subComments.map((x,index)=>{

                        // })
                    }
                })

            }
            else {
                timeLIneCommentArray.map((x, index) => {
                    if (x._id == action.id) {

                        x.total_comments = x.total_comments + 1
                    }
                })

                commentData.push({
                    likes: 0,
                    // reactionType:action.types,
                    subComments: action.result.result.data.commentPost.subComments,
                    comment_creator: action.result.result.data.commentPost.comment_creator._id,
                    user: {
                        _id: action.result.result.data.commentPost.comment_creator._id,
                        userName: action.result.result.data.commentPost.comment_creator.userName,
                        name: action.result.result.data.commentPost.comment_creator.name,
                        profile: action.result.result.data.commentPost.comment_creator.profile
                    },
                    description: action.result.result.data.commentPost.description,
                    post_creator: action.result.result.data.commentPost.post_creator,
                    post_id: action.result.result.data.commentPost.post_id,
                    _id: action.result.result.data.commentPost._id
                })
            }
            return { ...state, onLoad: false, comment: commentData, array: timeLIneCommentArray }
        case ApiConstants.constants.API_TIMELINE_COMMENT_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_COMMENT_ERROR:

            return { ...state, onLoad: false }
        //comment like reducer
        case ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_LOAD:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_SUCCESS:
            console.log('action.result.result.data.commentPost', action.result);
            let timeLIneCommentArray1 = [...state.array];
            let commentDataw = [...state.comment]
            if (action.commentId) {
                commentDataw.map((x, index) => {
                    if (x._id == action.commentId) {
                        console.log('is in x');
                        x.subComments.map((j, i) => {
                            if (j._id == action.id) {
                                console.log('is in j', j._id, action.id);
                                commentDataw[index].subComments[i].reactionType = { type: action.reactionType }
                                commentDataw[index].subComments[i].likes = action?.result?.result?.data?.like_count
                            }
                        })

                    }
                })

            }
            else {
                commentDataw.map((x, index) => {
                    if (x._id == action.id) {

                        if (x._id == action.id) {
                            commentDataw[index].reactionType = { type: action.reactionType }
                            commentDataw[index].likes = action?.result?.result?.data?.like_count

                        }
                    }
                })
            }
            console.log('commentDataw', commentDataw);
            return { ...state, onLoad: false, comment: commentDataw }
        case ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_COMMENT_LIKE_ERROR:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_POST_DETAIL_LOAD:

            return { ...state, onLoad: true }

        case ApiConstants.constants.API_TIMELINE_POST_DETAIL_SUCCESS:
            return { ...state, onLoad: false, detail: action.result, comment: action.result.comments }


        case ApiConstants.constants.API_TIMELINE_POST_DETAIL_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_POST_DETAIL_ERROR:

            return { ...state, onLoad: false }

        case ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_LOAD:

            return { ...state, onLoad: true }

        case ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_SUCCESS:
            let timeLIneComment = [...state.array];
            timeLIneComment.map((x, index) => {
                if (x._id == action.postId) {

                    x.total_comments = x.total_comments - 1
                }
            })
            let deleteComment = [...state.comment]
            if (action.commentId) {
                deleteComment.map((x, index) => {
                    if (x._id == action.commentId) {
                        x.subComments.map((y, i) => {
                            if (y._id == action.id) {
                                deleteComment[index].subComments.splice(i, 1)
                            }
                        })
                    }
                })
            }
            else {
                deleteComment.map((x, index) => {

                    if (x._id == action.id) {
                        deleteComment.splice(index, 1)
                    }
                })
            }
            return { ...state, onLoad: false, comment: deleteComment, array: timeLIneComment }
        case ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_FAIL:

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_TIMELINE_COMMENT_DELETE_ERROR:

            return { ...state, onLoad: false }

        case 'API_TIMELINE_POST_DELETE_LOAD':

            return { ...state, onLoad: true }

        case 'API_TIMELINE_POST_DELETE_SUCCESS':

            return { ...state, onLoad: false, postShared: true,fromDeleted:true }
        case 'API_TIMELINE_POST_DELETE_FAIL':

            return { ...state, onLoad: false }
        case 'API_TIMELINE_POST_DELETE_ERROR':

            return { ...state, onLoad: false }
        case ApiConstants.constants.API_VIDEO_UPLOAD_SUCCESS:
            return { ...state, postShared: true }
        case ApiConstants.constants.API_VIDEO_UPLOAD_ERROR:
            return { ...state, postShared: true }
        case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_SUCCESS:
            return { ...state, postShared: true }
        case ApiConstants.constants.API_VIDEO_UPLOAD_EDIT_ERROR:
            return { ...state, postShared: true }
        case 'CLEAR_TIMELINE_DETAIL':
            return { ...state, detail: null, comment: [] }

        case 'UPDATE_IMAGE_VIDEO_COUNT':
            console.log('UPDATE_IMAGE_VIDEO_COUNT', action)
            state[action.key] = action.count
            return { ...state, }

        case 'UPDATE_DATA':
            console.log('UPDATE_DATA', action)
            if (action.key == 'imageSize') {
                state.imageHeight = action.data.height
                state.imageWidth = action.data.width
            } else {

                state.imageLike = action.data
            }
            return { ...state, }

        default:
            return state;
    }
}
export default timeLine
