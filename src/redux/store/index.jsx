import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../rootReducer';
import axiosClient from '../../api/axiosClient';


const store = createStore(rootReducer, applyMiddleware(thunk.withExtraArgument(axiosClient)))

export default store;