import { ApiConstants } from '../../Themes';
const initialState =  {
    onLoad: false,
}

export default (state= initialState, {type,payload}) => {
    switch(type) {
        case ApiConstants.constants.FEED_POST_INITIATE : 
            return {
                onLoad: false
            }
        case ApiConstants.constants.FEED_POST_SUCCESS:
            return {
                onLoad:false
            }  
        case ApiConstants.constants.FEED_POST_ERROR:
            return {
                onLoad:false
            } 
        case ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_INITIATE:
            return {
                onLoad:false
            } 
        case ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_SUCCESS:
            return {
                onLoad:false
            }
        case ApiConstants.constants.ADD_POST_BOTTOM_TERMINAL_ERROR:
            return {
                onLoad: false
            }    
        default :
            return state               
    }
}









