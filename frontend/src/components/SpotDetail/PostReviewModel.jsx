import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { useModal } from '../../context/Modal';
import { createReviewThunk } from "../../store/review";
import SpotDetailsStyles from './SpotDetail.module.css'
import IoStar from '../StarIcons';


const ReviewFormModel = ({spot})=> {

    const [review, setReview] = useState("")
    const [stars, setStars] = useState(0)
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal();
    const [submitted, setSubmitted] = useState(false)
    const dispatch = useDispatch()



    useEffect(()=> {
        const newErrors = {}
        if (review.trim().length < 10){
            newErrors.review = 'Minimum of 10 characters are needed'
        }

        if(stars === 0){
            newErrors.stars = 'Minimum of one star is required'
        }

        setErrors(newErrors)
    }, [submitted, review, stars])


    const handleStarHover = (starIndex) => {
      if (!submitted) { // Only update stars on hover if form is not submitted
          setStars(starIndex);
      }
  };

    const handleSubmit = (e)=> {
        e.preventDefault()
        setSubmitted(true)

        if(Object.keys(errors).length === 0){
          let newReview = {review, stars}
            return dispatch(createReviewThunk(spot, newReview))
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
          <h2>How was your stay?</h2>
          <label htmlFor="comment">Leave your review here...</label>
          {submitted && errors.review && <p className={SpotDetailsStyles.error}>{errors.review}</p>}

          <textarea
            id="comment"
            name="comment"
            value={review}
            onChange={(e)=> setReview(e.target.value)}
            placeholder="Leave your review here..."
            required
          ></textarea>
          <div >
            <label htmlFor="rating">Stars</label>
            {submitted && errors.stars && <p className={SpotDetailsStyles.error}>{errors.stars}</p>}

            {[1, 2, 3, 4, 5].map((index) => (
                    <IoStar
                        key={index}
                        size={24}
                        color={index <= stars ? "gold" : "gray"} // Change color based on hover and submitted state
                        onMouseEnter={() => handleStarHover(index)} // Handle hover effect
                        onMouseLeave={() => handleStarHover(stars)} // Reset hover effect on mouse leave
                        onClick={() => setStars(index)} // Update stars on click
                    />
                ))}
          </div>
          <button disabled={Object.values(errors).length} type="submit">Submit Your Review</button>
        </form>
      );

}

export default ReviewFormModel
