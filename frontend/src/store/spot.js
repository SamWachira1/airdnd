import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spot/LOAD_SPOTS'
const LOAD_SPOTS_ID = 'spot/LOAD_SPOTS_ID'


export const loadSpots = (spots)=> {
    return {
        type: LOAD_SPOTS,
        payload: spots
    }
}

export const loadSpotsById = (spot)=>{
    return {
        type: LOAD_SPOTS_ID,
        payload: spot
    }
}


export const getSpotsThunk = ()=> async(dispatch)=>{
    const response = await csrfFetch("api/spots")
    const data = await response.json()
    dispatch(loadSpots(data.Spots))
    return response 
}

export const getSpotsByIdThunk = (spotsId)=> async(dispatch)=>{
    const response = await csrfFetch(`api/spots/${spotsId}`)
    const data = await response.json()
    console.log(data)
    dispatch(loadSpotsById(data.Spots))
}


const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            return {
                ...state,
                ...action.payload
            }
        }

        case LOAD_SPOTS_ID:{
            return {
                ...state,
                selectedSpot: action.payload
            }
        }

        default:
            return state 
    }
}

export default spotReducer



