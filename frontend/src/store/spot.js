import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spot/LOAD_SPOTS'
const LOAD_SPOT = 'spot/LOAD_SPOT '
const POST_SPOT = 'spot/POST_SPOT'
const POST_REVIEW = 'review/POST_REVIEW'


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

export const createSpot = (spot)=>{
    return {
        type: POST_SPOT,
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

export const createSpotThunk = (spot, spotImages)=> async(dispatch)=>{

    try {
        // Create the spot

        const spotResponse = await csrfFetch(`/api/spots`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(spot)
        });

        if(spotResponse.ok){
            const spotData = await spotResponse.json();
            
            await Promise.all(
                spotImages.map(async (image) => {
                    await csrfFetch(`/api/spots/${spotData.id}/images`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(image),
                    });
                })
            );

            const spotWithImagesResponse = await csrfFetch(
                `/api/spots/${spotData.id}`
            );
            const spotWithImagesData = await spotWithImagesResponse.json();
    
            // Dispatch the combined data
            dispatch(loadSpotsById(spotWithImagesData));
    
            return spotWithImagesData; 
        } 
       
    

    } catch (error) {
        console.error("Error in createSpotThunk:", error);
    }
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

        case POST_SPOT: 
            return {...state, [action.payload.id]: action.payload}


        default:
            return state 
    }
}

export default spotReducer
