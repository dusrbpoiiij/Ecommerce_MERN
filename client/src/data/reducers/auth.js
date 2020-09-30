import axios from 'axios'
import { toast } from 'react-toastify'
import setAuthToken from '../../helpers/setAuthToken'
import { URLDevelopment } from '../../helpers/URL'

// Types 
const REGISTER_SUCCESS = "REGISTER_SUCCESS"
const REGISTER_FAIL = "REGISTER_FAIL"
const LOGIN_SUCCESS = "LOGIN_SUCCESS"
const LOGIN_FAIL = "LOGIN_FAIL"
const USER_LOADED = "USER_LOADED"
const AUTH_ERROR = "AUTH_ERROR"
const LOGOUT = "LOGOUT"
const SET_LOADING = "SET_LOADING"

// Initial State 
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

// Reducers
export default function(state = initialState, action) {
  const {type, payload} = action
  
  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        isAuthenticated: true,
        loading: false
      }
    
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      // Set Token in localstorage
      localStorage.setItem('token', payload.token)
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        loading: false,
      }

    case SET_LOADING:
      return {
        ...state,
        loading:true
      }
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      // Remove Token in localstorage
      localStorage.removeItem('token')
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
      }

    default:
      return state;
  }
}

// Actions 
export const loadUser = () => async (dispatch) => {
  if(localStorage.token) {
    setAuthToken(localStorage.token)
  }

  try {
    const res = await axios.get(`${URLDevelopment}/api/user`);
    dispatch({
      type: USER_LOADED,
      payload: res.data
    })
  } catch (error) {
    console.log(error.response);
    dispatch({
      type:AUTH_ERROR
    })
  }
}


export const register = ({name, email, password}) => async(dispatch) => {
  
  // config header for axios 
  const config = {
    headers: {
      'Content-Type' : 'application/json',
    },
  };

  // Set body 
  const body = JSON.stringify({name, email, password});

  dispatch({
    type: SET_LOADING
  })
  try {
    // Response 
    const res = await axios.post(`${URLDevelopment}/api/user/register`, body, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())

  } catch(error) {
    const errors = error.response.data.errors
    if (errors) {
      errors.forEach(error => toast.error(error.msg))
    }

    dispatch({
      type: REGISTER_FAIL
    })
  }
}


export const login = ({email, password}) => async(dispatch) => {
  
  // config header for axios 
  const config = {
    headers: {
      'Content-Type' : 'application/json',
    },
  };

  // Set body 
  const body = JSON.stringify({email, password});

  dispatch({
    type: SET_LOADING
  })
  try {
    // Response 
    const res = await axios.post(`${URLDevelopment}/api/user/login`, body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    })

    dispatch(loadUser())

  } catch(error) {
    const errors = error.response.data.errors
    if (errors) {
      errors.forEach(error => toast.error(error.msg))
    }

    dispatch({
      type: LOGIN_FAIL
    })
  }
}



export const logout = () => dispatch => {
  dispatch({
    type:LOGOUT
  })
}