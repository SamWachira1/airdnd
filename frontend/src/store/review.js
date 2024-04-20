import { csrfFetch } from "./csrf"

const LOAD_REVIEWS = 'review/LOAD_REVIEW'
const LOAD_REVIEW = 'review/LOAD_REVIEW'
const POST_REVIEW = 'review/POST_REVIEW'
const DELETE_REVIEW = 'review/DELETE_REVIEW'




export const loadReviews = (reviews) => {
    return {
        type: LOAD_REVIEWS,
        payload: reviews
    }
}

export const loadReview = (review) => {
    return {
        type: LOAD_REVIEW,
        payload: review
    }
}

export const createReview = (review, user) => {
    return {
        type: POST_REVIEW,
        payload: {
            review,
            user
        }
    }
}

export const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId

    }
}



export const getSpotReviewsThunk = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`)
    const data = await response.json()
    dispatch(loadReviews(data.Reviews))
    return data
}

export const createReviewThunk = (spot, review, user) => async (dispatch) => {

    try {
        const reviewResponse = await csrfFetch(`/api/spots/${spot.id}/reviews`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(review)
        })

        if (reviewResponse.ok) {
            const reviewData = await reviewResponse.json()
            dispatch(createReview(reviewData, user))
            return reviewData
        }

    } catch (e) {
        console.log(e)

    }

}

export const deleteReviewThunk = (reviewId) => async (dispatch) => {
    try {
        const response = await csrfFetch(`/api/reviews/${reviewId}`, {
            method: "DELETE"
        });

        if (response.ok) {
            await response.json(); // No need to store response data if not using it
            dispatch(deleteReview(reviewId));
            return { success: true };
        } else {
            const errorData = await response.json(); // Get error data from response body
            return { error: errorData.message || 'Failed to delete review' };
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        return { error: 'An error occurred while deleting review' };
    }
}





const initialState = {}
const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_REVIEWS: {
            const newState = {}
            action.payload.forEach(review => {

                 const { User, ...reviewData } = review; // Destructure User information from review
                 newState[reviewData.id] = { ...User, ...reviewData, }; // Spread User information along with other review properties
            })
            return newState
        }

        case LOAD_REVIEW: {
            return { ...state, [action.payload.id]: action.payload }
        }

        case POST_REVIEW: {
            const { review } = action.payload;
            const {firstName} = action.payload.user[0] 

            return {...state, [review.id]: {firstName, ...review}}


        }

        case DELETE_REVIEW: {
            const newState = { ...state }
            delete newState[action.reviewId]
            return newState
        }


        default:
            return state
    }
}

export default reviewReducer
