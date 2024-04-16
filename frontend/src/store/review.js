import { csrfFetch } from "./csrf"

const LOAD_REVIEWS = 'review/LOAD_REVIEW'
const LOAD_REVIEW = 'review/LOAD_REVIEW'
const POST_REVIEW = 'review/POST_REVIEW'




export const loadReviews= (reviews)=> {
    return {
        type: LOAD_REVIEWS,
        payload: reviews 
    }
}

export const loadReview = (review)=> {
    return {
        type: LOAD_REVIEW,
        payload: review 
    }
}

export const createReview = (review)=> {
    return {
        type: POST_REVIEW,
        payload: review 
    }
}


export const getSpotReviewsThunk = (spotId) => async (dispatch)=> {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await response.json()
    dispatch(loadReviews(data.Reviews))
    return data
}

export const createReviewThunk = (spot, review)=> async (dispatch)=>{

    try{
        const reviewResponse = await csrfFetch(`/api/spots/${spot.id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        })

        if (reviewResponse.ok){
            const reviewData = await reviewResponse.json()
            dispatch(createReview(reviewData))
            return reviewData
        }



    }catch(e){
        console.log(e)
      
    }

}




const initialState = {}
const reviewReducer = (state = initialState, action)=>{
    switch(action.type){
        case LOAD_REVIEWS: {
            let newState = {}
            action.payload.forEach(review => {
                newState[review.id] = review 
            })

            return newState
        }

        case LOAD_REVIEW: {
            return {...state, [action.payload.id]: action.payload}
        }

        case POST_REVIEW: {
            return {...state, [action.payload.id]: action.payload}
        }

       
        default: 
            return state 
    }
}

export default reviewReducer