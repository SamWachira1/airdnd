import { csrfFetch } from "./csrf"

const LOAD_SPOTS = 'spot/LOAD_SPOTS'
const LOAD_SPOT = 'spot/LOAD_SPOT '
const POST_SPOT = 'spot/POST_SPOT'
const LOAD_CURRENT_SPOT = 'spot/LOAD_CURRENT_SPOT'
const DELETE_SPOT = 'spot/DELETE_SPOT'

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

export const loadCurrentSpots = (spots) => {
    return{
        type: LOAD_CURRENT_SPOT,
        payload: spots
    }
}

export const removeSpot = (spotId)=> {
    return {
        type: DELETE_SPOT,
        spotId
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

export const getCurrentSpotUser = ()=> async (dispatch)=>{
    const response = await csrfFetch(`/api/spots/current`)
    const data = await response.json()
    dispatch(loadCurrentSpots(data))
    return data 
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

export const updateSpotThunk = (spot, spotId)=> async (dispatch)=>{

        const response = await csrfFetch(`/api/spots/${spotId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(spot)
        })



        if (response.ok){
            const updatedSpot = await response.json()
            dispatch(loadSpotsById(updatedSpot))
            return updatedSpot
        }
}


export const deleteSpotThunk = (spotId)=> async (dispatch)=>{
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: "DELETE"
    })

    if (response.ok){
        dispatch(removeSpot(spotId))
    }
    
}





const initialState = {}

const spotReducer = (state = initialState, action) => {
    switch(action.type){
        case LOAD_SPOTS: {
            const newState = action.payload.reduce((acc, spot) => {
                acc[spot.id] = spot;
                return acc;
              }, {});

            return {...state, ...newState}
        }

        case LOAD_SPOT:
            return { ...state, [action.payload.id]: action.payload};

        case POST_SPOT: 
            return {...state, [action.payload.id]: action.payload}

        case LOAD_CURRENT_SPOT: {
            const normalizedData = action.payload.Spots.reduce((acc, spot) => {
                acc[spot.id] = spot;
                return acc;
            }, {});

            return { ...state, ...normalizedData };
        }

        case DELETE_SPOT: {
            // console.log('Payload in DELETE_SPOT:', action.payload);
            
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;

        }


        
        default:
            return state 
    }
}

export default spotReducer
