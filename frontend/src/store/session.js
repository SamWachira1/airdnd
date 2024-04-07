import { csrfFetch } from "./csrf"
const SET_SESSION_USER = 'session/SET_SESSION_USER'
const REMOVE_SESSION_USER = 'session/REMOVE_SESSION_USER'


export const setSessionUser =(user)=> {
    return {
        type: SET_SESSION_USER,
        payload: user 
    }
}


const removeSessionUser = ()=>{
    return {
        type: REMOVE_SESSION_USER

    }
}


export const loginThunk =  ({user}) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      body: JSON.stringify({
        credential,
        password
      })
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  };
  

const initialState = { user: null }

const sessionReducer = (state = initialState, action)=> {
    switch(action.type){

        case SET_SESSION_USER:{
            return {
                ...state,
                user: action.payload
            }
        }

        case REMOVE_SESSION_USER:{
            return {
                ...state,
                user: null 
            }
        }

        default:
          return state 
    }

  
}


export default sessionReducer
