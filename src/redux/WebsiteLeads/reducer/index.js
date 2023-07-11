import {GET_WEBSITE_LEADS_DATA, SEARCH_WEBSITE_LEADS_DATA} from "../../actionTypes";

const initialState = {
    leadsData:[]
}
const websiteReducer = (state=initialState,{type,payload}) =>{
    switch (type) {
        case GET_WEBSITE_LEADS_DATA : {
                return {
                    ...state,
                    leadsData: payload
                }
        }
        case SEARCH_WEBSITE_LEADS_DATA:{
            return {
                ...state,
                leadsData: payload
            }
        }
        default :
           return state
    }
}

export default websiteReducer