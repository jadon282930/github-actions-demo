import { combineReducers } from 'redux';
import loginReducer from '../auth/reducer';
import ClinicReducer from '../Clinic/reducer';
import { physicianAddListReducer } from '../physician/reducer';
import {InvoiceReducer} from "../Invoice/reducer";
import websiteReducer from "../WebsiteLeads/reducer";
import {SettingReducer} from "../Settings/reducer";

export default combineReducers({
    loginReducer: loginReducer,
    clinicReducer: ClinicReducer,
    physicianReducer: physicianAddListReducer,
    invoiceReducer:InvoiceReducer,
    leadsReducer:websiteReducer,
    settingReducer:SettingReducer
})