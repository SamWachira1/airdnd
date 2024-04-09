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


export const loginThunk = ({user}) => async (dispatch) => {
    const { credential, password } = user;
    const response = await csrfFetch("/api/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
         },
      body: JSON.stringify({
        credential,
        password
      })
    });
    const data = await response.json();
    dispatch(setSessionUser(data.user));
    return response;
  };


export const logoutThunk = ()=> async (dispatch)=>{
    const response = await csrfFetch("api/session", {
        method: "DELETE"
    })

    dispatch(removeSessionUser())
    return response 
}
  
export const restoreUserThunk = ()=> async(dispatch)=>{
    const response = await csrfFetch("/api/session")
    const data = await response.json()
    dispatch(setSessionUser(data.user))
    return response 
}

export const signUpThunk = ({user})=> async (dispatch)=>{
    const {username, firstName, lastName, email, password} = user 

    const response = await csrfFetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, firstName, lastName, email, password})
    })

    const data = await response.json()
    dispatch(setSessionUser(data.user))
    return response
}

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
