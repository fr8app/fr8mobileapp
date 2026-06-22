import { ApiConstants } from '../../Themes';

const initialState= {
    onLoad: false,
    image:false,
    imageUrl: null
}

export default function (state=initialState, {type, payload}){
    switch(type) {
        case ApiConstants.constants.Add_USER_IMAGE_INITATE:
            return {
                ...state,
                onLoad: true
            }
        case ApiConstants.constants.Add_USER_IMAGE_SUCCESS:
            return {
                ...state,
                onLoad: false,
                image:true,
                imageUrl:payload
            }
        case ApiConstants.constants.Add_USER_IMAGE_ERROR:
            return {
                ...state,
                onLoad: true
            }

        default :
            return {
                ...state
            }
    }
}