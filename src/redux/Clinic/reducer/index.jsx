import {
    ADD_CLINIC,
    GET_CLINIC_LIST,
    UPDATE_CLINIC_STATUS,
    GET_CLINIC,
    ADD_AUTHORIZED,
    GET_CLINIC_DETAILS,
    DELETE_AUTH_USER,
    EDIT_AUTH_USER,
    UPDATE_AUTH_USER,
    UPDATE_AUTH_USER_STATUS,
    SEARCH_CLINIC_LIST,
    CLEAR_CLINIC,
    CHANGE_PRIMARY_AUTH_USER,
    UPDATE_CLINIC,
    GET_COUNTRY_DATA,
    DELETE_CLINICE,
    DELETE_PHYSICIAN,
    UPDATE_CLINIC_PHYSICIAN,
    UPDATE_STATUS_PHYSICIAN,
    ADD_PHYSICIAN,
    GET_MINUTE_DATA,
    UPDATE_CLINIC_MINUTE_PLAN, CANCEL_CLINIC_MINUTE_PLAN,

} from '../../actionTypes';


const initialState = {
    clinicList:[],
    addClinicData:[],
    clinicDetail:{},
    authUser:{},
    getClinicData: {},
    countryData:[],
    stateData:[],
    getMinute:[]
}


export default function loginReducer(state = initialState, { type, payload,clinicList }) {
    switch (type) {
        case GET_CLINIC_LIST: {
            return {
                ...state,
                clinicList: payload
            }
        }
        case ADD_CLINIC: {
            return {
                ...state,
                addClinicData:payload
            }
        }
        case GET_CLINIC:{
            let result = payload?.reduce((acc, cur) => ({ ...cur, ...acc }))
            return {
                ...state,
                getClinicData: result
            }
        }
        case ADD_AUTHORIZED:{
            let temp = {...state};
            let index = state.clinicList.findIndex(data => data._id === clinicList.clinic_id)
            let result;
            if (state.clinicDetail.authUsers) {
                result = [...state.clinicDetail.authUsers, {...payload.user,user_id: payload.user._id}];
                temp.clinicDetail.AuthUserCount  = temp.clinicDetail.AuthUserCount + 1
            } else {
                result = [{...clinicList.contact}];
            }
            if(index > -1) {
                temp.clinicList[index].AuthUserCount  = temp.clinicList[index].AuthUserCount + 1
            }
            return {
                ...state,
                clinicDetail: {...temp.clinicDetail, authUsers: [...result]},
                clinicList: [...temp.clinicList]
            }
        }
        case GET_CLINIC_DETAILS:{
            let result = payload?.Data.reduce((acc, cur) => ({ ...cur, ...acc }))
            let PrimaryUser = result?.PrimaryUser?.reduce((acc, cur) => ({ ...cur, ...acc }))
            let billing_address = result?.billing_address?.reduce((acc, cur) => ({ ...cur, ...acc }))
            let business_address = result?.business_address?.reduce((acc, cur) => ({ ...cur, ...acc }))
            return {
                ...state,
                clinicDetail: {...result,PrimaryUser: {...PrimaryUser},billing_address:{...billing_address},business_address:{...business_address} }
            }
        }
            case DELETE_AUTH_USER:{
                let temp = {...state}
                let result = state.clinicDetail.authUsers.filter(item=> item.user_id !== payload.id)
                temp.clinicDetail.AuthUserCount  = temp.clinicDetail.AuthUserCount - 1
            return {
                ...state,
                clinicDetail:{...temp.clinicDetail, authUsers: [...result] }
            }
        }

        case EDIT_AUTH_USER:{
            return {
                ...state,
                authUser:payload
            }
        }
        case UPDATE_AUTH_USER :{
            let temp = {...state};
            let index = state.clinicDetail.authUsers.findIndex(data => data.user_id === payload.contact.user_id);
            if (index > -1) {
                temp.clinicDetail.authUsers[index] = {...temp.clinicDetail.authUsers[index], ...payload.contact}
            }
            return temp
        }
        case UPDATE_CLINIC_STATUS:{
            let temp = {...state}
            let index = state.clinicList.findIndex(data => data._id === payload.id)
            if (index > -1) {
                temp.clinicList[index].isActive = payload.status
            }
            return temp
        }
        case UPDATE_AUTH_USER_STATUS :{
            let temp = {...state};
            let index = state.clinicDetail.authUsers.findIndex(data => data.user_id === payload.id);
            if (index > -1) {
                temp.clinicDetail.authUsers[index].isActive[0].isActive = payload.status
            }
            return temp
        }
        case SEARCH_CLINIC_LIST:{
           return {
               ...state,
               clinicList: payload
           }
        }
        case CLEAR_CLINIC :{
            return {
                ...state,
                getClinicData: {}
            }
        }
        case CHANGE_PRIMARY_AUTH_USER: {
            let temp = {...state};
            let index = temp.clinicDetail.authUsers.findIndex(data => data.user_id === payload.user_id);
            let prevIndex = temp.clinicDetail.authUsers.findIndex(data => data.isPrimary);
            if (index > -1) {
                temp.clinicDetail.PrimaryUser = {...temp.clinicDetail.authUsers[index]};
                temp.clinicDetail.authUsers[index] = {...state.clinicDetail.authUsers[index], isPrimary: true};
                if (prevIndex > -1) {
                    temp.clinicDetail.authUsers[prevIndex] = {...state.clinicDetail.authUsers[prevIndex], isPrimary: false};
                }
            }
            return {...temp}
        }
        case UPDATE_CLINIC :{
            let temp = {...state}
                temp.clinicDetail.clinic_name = payload.clinic_name;
           return {
               ...state,
               clinicDetail: {...temp.clinicDetail,billing_address:{...payload.billing_address} ,business_address:{... payload.business_address} }
           }
        }
        case GET_COUNTRY_DATA : {
            return {
                ...state,
                countryData: payload
            }
        }
        case 'GET_STATE_DATA' :{
            return {
                ...state,
                stateData : payload
            }
        }
        case DELETE_CLINICE : {
            let result = state.clinicList.filter(item=> item._id !== payload.id)
            return {
                ...state,
                clinicList: [...result]
            }
        }
        case DELETE_PHYSICIAN: {
            let temp = {...state}
            let result = state.clinicDetail.physicianUsers.filter(item=> item.physician_id !== payload.id)
            temp.clinicDetail.physicianUsers  = temp.clinicDetail.physicianUsers - 1
            return {
                ...state,
                clinicDetail:{...temp.clinicDetail, physicianUsers: [...result] }
            }
        }
        case UPDATE_CLINIC_PHYSICIAN: {
            let temp = {...state};
            let index = state.clinicDetail.physicianUsers.findIndex(data => data.physician_id === payload?.physician.user_id);
            if (index > -1) {
                temp.clinicDetail.physicianUsers[index] = {...temp.clinicDetail.physicianUsers[index], ...payload.physician}
            }
            return temp
        }
        case UPDATE_STATUS_PHYSICIAN: {
            let temp = { ...state }

            let index = state.clinicDetail.physicianUsers.findIndex(data => data.physician_id === payload.id)

            if (index > -1) {
                temp.clinicDetail.physicianUsers[index].isActive[0].isActive = payload.status
            }
            return temp
        }
        case ADD_PHYSICIAN:{
            let temp = { ...state }
            let result = [...state.clinicDetail.physicianUsers, {...payload.physician, physician_id: payload.physician._id}];
            temp.clinicDetail.physicianUsers  = temp.clinicDetail.physicianUsers  + 1
            return {
                ...state,
                clinicDetail: {...temp.clinicDetail, physicianUsers: [...result]}
            }
        }
        case GET_MINUTE_DATA :{
            return {
                ...state,
                getMinute: payload
            }
        }
           case UPDATE_CLINIC_MINUTE_PLAN:{
               let temp = {...state};
                   temp.clinicDetail.upcoming_clinic_billing_minute = payload
                   return temp
            }
        case CANCEL_CLINIC_MINUTE_PLAN:{
            let temp = {...state};
            temp.clinicDetail.upcoming_clinic_billing_minute = payload
            return temp
        }
        default:
            return state;
    }

}