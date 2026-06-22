import { ApiConstants } from './../../Themes'
import AsyncStorage from '@react-native-async-storage/async-storage';
const initialState = {
    onLoad: false,
    error: null,
    result: null,
    routeData: [],
    status: 0,
    navigation: null,
    currentPage: 1,
    nextPageurl: null,
    lastPage: null,
    timeLineDetail:null,
    linkingData:null,
    interChange:[],
    equipment:[],
    video:[],
    total:0,
    imageUpdate:false,
    receiptPrivate:false,
    delete:false,
    isLoad:false,
    inTerminal:null,
    manualMedia:[],
    statusLocal:'terminal',
    recentLocations:[]
};

function routeData(state = initialState, action) {
    switch (action.type) {
        case ApiConstants.constants.API_POST_LOAD:
            return { ...state, onLoad: true, currentPage: action.page,isLoad:false, };

        case ApiConstants.constants.API_POST_SUCCESS:
            let result = action.result.result.data.route_post
            if (action.page == 1) {
                state.routeData = result
            }
            else {
                Array.prototype.push.apply(state.routeData, result)
            }

            return {
                ...state,
                statusLocal:action.result.result.data.status,
                onLoad: false,
                result: action.result.result,
                isLoad:true,
                currentPage: action.result.result.data.current_page,
                nextPageurl: action.result.result.data.next_page_url,
                lastPage: action.result.result.data.last_page,
                total:action.result.result.data.total
            };

        case ApiConstants.constants.API_POST_FAIL:
            return { ...state,isLoad:true, onLoad: false };

        case ApiConstants.constants.API_POST_ERROR:
            return { ...state, onLoad: false,isLoad:true };

            

        //create route post

        case ApiConstants.constants.API_ROUTE_POST_CREATE_LOAD:
            return { ...state, onLoad: true };

        case ApiConstants.constants.API_ROUTE_POST_CREATE_SUCCESS:
            AsyncStorage.removeItem('timelineMapData')
            return { ...state, onLoad: false, navigation: action.navigation.popToTop() };

        case ApiConstants.constants.API_ROUTE_POST_CREATE_FAIL:
            return { ...state, onLoad: false };

        case ApiConstants.constants.API_ROUTE_POST_CREATE_ERROR:
            return { ...state, onLoad: false };

        //delete the route
        case ApiConstants.constants.API_ROUTE_DELETE_LOAD:
            return { ...state, onLoad: true }
        case ApiConstants.constants.API_ROUTE_DELETE_SUCCESS:
            return { ...state, onLoad: false, navigation: action.navigation.pop() }
        case ApiConstants.constants.API_ROUTE_DELETE_FAIL:
            return { ...state, onLoad: false };

        case ApiConstants.constants.API_ROUTE_DELETE_ERROR:
            return { ...state, onLoad: false };

        case ApiConstants.constants.API_ROUTE_EDIT_LOAD:
            return { ...state, onLoad: action.navigation? true:false }
        case ApiConstants.constants.API_ROUTE_EDIT_SUCCESS:
            return { ...state, onLoad: false, navigation: action.navigation&&action.navigation.pop(2),imageUpdate:action.navigation?false: true }
        case ApiConstants.constants.API_ROUTE_EDIT_FAIL:
            return { ...state, onLoad: false };

        case ApiConstants.constants.API_ROUTE_EDIT_ERROR:
            return { ...state, onLoad: false };


        case ApiConstants.constants.ROUTE_POST_DETAIL_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_DETAIL_SUCESS:
            let interChangeData=[]
            let equipmentData=[]
            let videoData=[]
            let media=[]
            if(action?.result?.result?.data?.type=='manual'&& action?.result?.result?.data?.medias)
            {
                media=action?.result?.result?.data?.medias
            }

            if(action.result.result.data.route_post_media){
            if(action.result.result.data.route_post_media.length>0){
                action.result.result.data.route_post_media.map((x)=>{
                    if(x.type=='interchange_file'){
                        interChangeData.push(x)
                    }
                    else if(x.type=='equipment_photo'){
                        equipmentData.push(x)
                    }
                    else{
                        videoData.push(x)
                    }
                })

            }
        }
            return {...state,
                manualMedia:media,
                receiptPrivate:action.result.result.data.receipt_private,onLoad:false,timeLineDetail:action.result.result.data,status:1,linkingData:action.result.result.data,
                interChange:interChangeData,equipment:equipmentData,video:videoData}
        case ApiConstants.constants.ROUTE_POST_DETAIL_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_DETAIL_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_SUCESS:
            let myInterChangeData=[...state.interChange]
                myInterChangeData.push(action.result.result.data.route_post_media_id)
            return {...state,onLoad:false,interChange:myInterChangeData}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_ADD_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_SUCESS:
            let editInterChangeData=[...state.interChange]
                editInterChangeData.map((x,index)=>{
                    if(x._id==action.id){
                        editInterChangeData[index]=action.result.result.data.route_post_media_id
                    }
                })
            return {...state,onLoad:false,interChange:editInterChangeData}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_EDIT_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_SUCESS:
            let deleteInterChangeData=[...state.interChange]
            deleteInterChangeData.map((x,index)=>{
                    if(x._id==action.id){
                        deleteInterChangeData.splice(index,1)
                    }
                })
            return {...state,onLoad:false,interChange:deleteInterChangeData,delete:true}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_INTERCHANGE_DELETE_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_SUCESS:
            let myEqup=[...state.equipment]
                myEqup.push(action.result.result.data.route_post_media_id)
            return {...state,onLoad:false,equipment:myEqup}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_ADD_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_SUCESS:
            let editEquop=[...state.equipment]
            editEquop.map((x,index)=>{
                if(x._id==action.id){
                    editEquop[index]=action.result.result.data.route_post_media_id
                }
            })
            return {...state,onLoad:false,equipment:editEquop}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_EDIT_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_SUCESS:
            let deleteEquipmentData=[...state.equipment]
            let manualMedia=[...state.manualMedia]
            if(action.mediaType=='manual'){
                manualMedia.map((x,index)=>{

                if(x._id==action.id){

                manualMedia.splice(index,1)
                }
            })
            }
            else{
            deleteEquipmentData.map((x,index)=>{
                    if(x._id==action.id){
                        deleteEquipmentData.splice(index,1)
                    }
                })
            }
            return {...state,onLoad:false,equipment:deleteEquipmentData,delete:true,manualMedia:manualMedia}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_EQUIPMENT_DELETE_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_VIDEO_ADD_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_VIDEO_ADD_SUCESS:
            let myVideo=[...state.video]
                myVideo.push(action.result.result.data.route_post_media_id)
            return {...state,onLoad:false,video:myVideo}
        case ApiConstants.constants.ROUTE_POST_VIDEO_ADD_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_VIDEO_ADD_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_SUCESS:
            let deleteVideoData=[...state.video]
            deleteVideoData.map((x,index)=>{
                    if(x._id==action.id){
                        deleteVideoData.splice(index,1)
                    }
                })
            return {...state,onLoad:false,video:deleteVideoData,delete:true}
        case ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_VIDEO_DELETE_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_LOAD:
            return {...state,onLoad:true}
        case ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_SUCESS:
            let editVideo=[...state.video]
            editVideo.map((x,index)=>{
                if(x._id==action.id){
                    editVideo[index]=action.result.result.data.route_post_media_id
                }
            })
            return {...state,onLoad:false,video:editVideo}
        case ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_VIDEO_EDIT_ERROR:
            return {...state,onLoad:false}

        case ApiConstants.constants.ROUTE_POST_PRIVATE_LOAD:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_PRIVATE_SUCESS:
            
            return {...state,onLoad:false,receiptPrivate:state.receiptPrivate=='1'?'0':'1'}
        case ApiConstants.constants.ROUTE_POST_PRIVATE_FAIL:
            return {...state,onLoad:false}
        case ApiConstants.constants.ROUTE_POST_PRIVATE_ERROR:
            return {...state,onLoad:false}

            //user is in terminal
        case 'API_USER_IS_IN_TERMINAL_LOAD':
            let userStatus
            if(action.enterType=='1'){
                userStatus='terminal'
            }
            else{
                userStatus=null
            }
            return {...state,onLoad:false,statusLocal:userStatus}
        case 'API_USER_IS_IN_TERMINAL_SUCESS':
            console.log('user in terminal reducer',action.result.result.data.inTerminal);
            return {...state,onLoad:false,inTerminal:action.result.result.data.inTerminal}
        case 'API_USER_IS_IN_TERMINAL_FAIL':
            return {...state,onLoad:false}
        case 'API_USER_IS_IN_TERMINAL_ERROR':
            return {...state,onLoad:false}

            /////////////
        case 'API_RECENT_LOCATIONS_LOAD':
           
            return {...state,onLoad:false}
        case 'API_RECENT_LOCATIONS_SUCCESS':
            return {...state,onLoad:false,recentLocations:action.result.result.data}
        case 'API_RECENT_LOCATIONS_FAIL':
            return {...state,onLoad:false}
        case 'API_RECENT_LOCATIONS_ERROR':
            return {...state,onLoad:false}

            case ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_LOAD:
                return{
                    ...state,onLoad:true
                }
            case ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_SUCESS:
                return{
                    ...state,onLoad:false
                }
            case ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_FAIL:
                return{
                    ...state,onLoad:false
                }
            case ApiConstants.constants.API_CREATE_MANUAL_TIMELINE_ERROR:
                return{
                    ...state,onLoad:false
                }

        default:
            return state;
    }
}
export default routeData
