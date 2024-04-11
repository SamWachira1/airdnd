import { csrfFetch } from "./csrf"

const LOAD_REVIEWS = 'review/LOAD_REVIEW'
const LOAD_REVIEW = 'review/LOAD_REVIEW'



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

export const getSpotReviewsThunk = (spotId) => async (dispatch)=> {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await response.json()
    dispatch(loadReviews(data.Reviews))
    return data
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
            return {...state, [action.review.id]: action.review}
        }

        default: 
            return state 
    }
}

export default reviewReducer
