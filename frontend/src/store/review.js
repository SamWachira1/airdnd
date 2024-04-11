import { csrfFetch } from "./csrf"

const LOAD_REVIEW = 'review/LOAD_REVIEW'

export const loadReview = (review)=> {
    return {
        type: LOAD_REVIEW,
        payload: review 
    }
}
