import { LOGIN_SUCCESS } from '../../actionTypes';
const initialState = {}

export default function loginReducer(state = initialState, action) {
    const { type } = action;
    switch (type) {
        case LOGIN_SUCCESS: {
            return {...action.currentUser}
        }
        default:
            return state;
    }

}