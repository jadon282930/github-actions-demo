import {
    GET_INVOICE_DATA
} from "../../actionTypes";

let initialState = {
    invoice_data: {}
}

export const InvoiceReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case GET_INVOICE_DATA: {
            let billing_address = payload?.billing_address?.reduce((acc, cur) => ({ ...cur, ...acc }))
            return {
                ...state,
                invoice_data: {...payload, billing_address: { ...billing_address }}
            }
        }
        default:
            return state
    }
}