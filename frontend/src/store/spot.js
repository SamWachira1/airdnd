import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spot/LOAD_SPOTS'
const LOAD_SPOT = 'spot/LOAD_SPOT '


export const loadSpots = (spots)=> {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

export const loadSpotsById = (spot)=>{
    return {
        type: LOAD_SPOT,
        payload: spot
    }
}


export const getSpotsThunk = ()=> async(dispatch)=>{
    const response = await csrfFetch("/api/spots")
    const data = await response.json()
    dispatch(loadSpots(data.Spots))
    return response 
}

export const getSpotsByIdThunk = (id)=> async(dispatch)=>{
    const response = await csrfFetch(`/api/spots/${id}`)
    const data = await response.json()
    dispatch(loadSpotsById(data))
    return response 
}


const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            let newState = {}
            action.payload.forEach(spot => {
                newState[spot.id] = spot
            })
            return newState
        }

        case LOAD_SPOT:
            return { ...state, [action.payload.id]: action.payload};

     
        default:
            return state 
    }
}

export default spotReducer
