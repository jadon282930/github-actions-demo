
import { ADD_PHYSICIAN_LIST,GET_PHYSICIAN_LIST,EDIT_PHYSICIAN_LIST, SEARCH_PHYSICIAN_LIST, ADD_MINUTE_PHYSICIAN_LIST,
    DELETE_PHYSICIAN_LIST,UPDATE_STATUS_PHYSICIAN_LIST,SEARCH_PHAYSICIAN_PATIENTS,GET_PHYSICIAN_DETAILS,UPDATE_PHYSICIAN_LIST,GET_PHYSICIAN_PATIENTS} from "../../actionTypes"


const initialState = {
    physicianList: [],
    editPhysician: {},
    addPhsyician: null,
    updatePhysicianlist: null,  
    getPhysicianDtails: {},
    demophy:[],
    getPhyPatients:[]
}

export const physicianAddListReducer = (state = initialState, {type,payload}) => {

    switch (type) {
        case GET_PHYSICIAN_LIST : {
            return{
                ...state,
                physicianList:payload
            }
        }
           case ADD_PHYSICIAN_LIST:{
            let result=[...state.physicianList,{...payload.physician}]
            return{
                ...state,
                physicianList:result
            }
        }
        case EDIT_PHYSICIAN_LIST : {
            return{
                ...state,
                editPhysician: payload
            }    
        }
        case UPDATE_STATUS_PHYSICIAN_LIST : {
            let temp = {...state};
            let index = state.physicianList.findIndex(data => data._id === payload?.id);
            if (index > -1) {
                temp.physicianList[index].isActive[0].isActive = payload.status
            }
            return temp
        }
         case SEARCH_PHYSICIAN_LIST: {
            return {
                ...state,
                physicianList: [...payload]
            }
        }
        case ADD_MINUTE_PHYSICIAN_LIST: {
            let tempData = { ...state }
            let index = state.physicianList.findIndex(data => data._id === payload.pysician_id)
            if (index > -1) {
                tempData.physicianList[index].availableMinutes = tempData.physicianList[index].availableMinutes + payload.minutes
            }
            return tempData;
        }
        case DELETE_PHYSICIAN_LIST : {
            let temp = state.physicianList.filter(item=>item._id !== payload.id)
            return {
                ...state,
                physicianList: temp
            }
        }
        case GET_PHYSICIAN_DETAILS: {
            return {
                ...state,
                getPhysicianDtails: payload
            }
        }
        case SEARCH_PHAYSICIAN_PATIENTS:{
            return {
                ...state,
                getPhyPatients: {...state.getPhyPatients,patients: [...payload] }
            }
        }
        case UPDATE_PHYSICIAN_LIST: {
            let temp ={...state}
            let index = state.physicianList.findIndex(item => item._id === payload.physician._id)
            if(index > -1){
                temp.physicianList[index] = {...temp.physicianList[index], ...payload.physician}
            }
        return temp
        }
         case GET_PHYSICIAN_PATIENTS : {
            return {
                ...state,
                getPhyPatients:payload
            }
        }
        default:
            return state

    }


}
