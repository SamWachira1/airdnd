import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useModal } from '../../context/Modal';
import { createReviewThunk } from "../../store/review";
import SpotDetailsStyles from './SpotDetail.module.css'
import IoStar from '../StarIcons';


const ReviewFormModel = ({ spot }) => {

    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal();
    const [submitted, setSubmitted] = useState(false)
    const dispatch = useDispatch()
    const user = useSelector(state => Object.values(state.session))

    const [hoveredStars, setHoveredStars] = useState(0);


    useEffect(() => {
        const newErrors = {}
        if (review.trim().length < 10) {
            newErrors.review = 'Minimum of 10 characters are needed'
        }

        if (stars === 0) {
            newErrors.stars = 'Minimum of one star is required'
        }

        setErrors(newErrors)
    }, [submitted, review, stars])

    const handleStarToggle = (starIndex) => {
        // Toggle selection based on current state (selected or not)
        setStars(stars === starIndex ? 0 : starIndex);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)

        if (Object.keys(errors).length === 0) {
            let newReview = { review, stars }
            return dispatch(createReviewThunk(spot, newReview, user))
                .then(closeModal)
                .catch(
                    async (res) => {
                        const data = await res.json()
                        if (data?.errors) {
                            setErrors(data.errors);
                        }

                    }

                )
        }


    }

    return (
        <form onSubmit={handleSubmit} className={SpotDetailsStyles.modalContainer}>
            <h2 className={SpotDetailsStyles.h2}>How was your stay?</h2>
            <label htmlFor="comment">Leave your review here...</label>
            {submitted && errors.review && <p className={SpotDetailsStyles.error}>{errors.review}</p>}

            <textarea
                id="comment"
                name="comment"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Leave your review here..."
                style={{ width: '100%', height: '150px' }}
                required
            ></textarea>
            <div className={SpotDetailsStyles.starsContainer}>
                <label className={SpotDetailsStyles.stars} htmlFor="rating">Stars</label>
                {submitted && errors.stars && <p className={SpotDetailsStyles.error}>{errors.stars}</p>}

               
                {[1, 2, 3, 4, 5].map((index) => (
                    <IoStar
                        key={index}
                        size={24}
                        color={index <= stars || index <= hoveredStars ? "gold" : "gray"} // Update color based on both stars and hoveredStars
                        onMouseEnter={() => setHoveredStars(index)} // Update hoveredStars on hover
                        onMouseLeave={() => setHoveredStars(0)} // Clear hover on leave
                        onClick={() => handleStarToggle(index)} // Toggle selection on click
                    />
                ))}
            </div>
            <button className={SpotDetailsStyles.submitReviewButton} disabled={Object.values(errors).length} type="submit">Submit Your Review</button>
        </form>
    );

}

export default ReviewFormModel
