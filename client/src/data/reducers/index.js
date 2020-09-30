// root reducers for combine all reducets in app 
import { combineReducers } from 'redux'
import auth from './auth'

export default combineReducers({
  auth
});