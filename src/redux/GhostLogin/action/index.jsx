

import Cookies from 'js-cookie'
import { Encryption } from "../../../utils";

export const ghostLoginClinic = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/clinicGhostLogin", payload)
        .then((res) => {
            if (res.status === 200) {
                Cookies.set("x-access-token_new", res.data.data.token, { domain: process.env.REACT_APP_DOMAIN });
                window.open(process.env.REACT_APP_CLINIC_URL, '_blank');
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};

export const ghostLoginPhysician = (payload) => async (dispatch, getState, api) => {
    return await api
        .post("/admin/physicianGhostLogin", payload)
        .then((res) => {
            if (res.status === 200) {
                Cookies.set("x-access-token_phy", res.data.data.token, { domain: process.env.REACT_APP_DOMAIN });
                window.open(process.env.REACT_APP_PHYSICIAN_URL, '_blank');
            }
            return res;
        })
        .catch((err) => {
            return err.response;
        });

};