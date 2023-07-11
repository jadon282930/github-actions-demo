import {
    GET_SETTING_DATA, UPDATE_MAINTENANCE_MODE
} from "../../actionTypes";

let initialState = {
    setting_list: {}
}

export const SettingReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_SETTING_DATA: {
           let result =  payload.maintenanceModeData.reduce((acc,cur)=> ({...cur,...acc}))
            let AndroidHaploscopeMD = payload?.appVersionData?.filter((item) => (item.appName === "md" && item.appType === "android")).reduce((acc,cur)=>({...cur,acc}))
            let AndroidHaploscope = payload?.appVersionData?.filter((item) => (item.appName !== "md" && item.appType === "android")).reduce((acc,cur)=>({...cur,acc}))
            let IOSHaploscopeMD = payload?.appVersionData?.filter((item) => (item.appName === "md" && item.appType === "ios")).reduce((acc,cur)=>({...cur,acc}))
            let IOSHaploscope = payload?.appVersionData?.filter((item) => (item.appName !== "md" && item.appType === "ios")).reduce((acc,cur)=>({...cur,acc}))
            return {
                ...state,
                setting_list: {...payload,maintenanceModeData:{...result},AndroidHaploscopeMD:{...AndroidHaploscopeMD},AndroidHaploscope:{...AndroidHaploscope},IOSHaploscopeMD:{...IOSHaploscopeMD},IOSHaploscope:{...IOSHaploscope}}
            }
        }
        case UPDATE_MAINTENANCE_MODE : {
            let temp = {...state}
            temp.maintenanceModeData.isMaintenanceMode = payload.status
            return temp
        }
        default:
            return state
    }
}