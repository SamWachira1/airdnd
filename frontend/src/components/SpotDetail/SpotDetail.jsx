import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotsByIdThunk } from '../../store/spot';
import { getSpotReviewsThunk } from '../../store/review';

import { useEffect } from 'react';
import SpotDetailsStyles from './SpotDetail.module.css'
import IoStar from '../StarIcons';


function SpotDetail() {

    const { spotId } = useParams()
    const spot = useSelector(state => state.spots[spotId])
    const reviews = useSelector(state => Object.values(state.reviews)); // Change this line
    const sessionUser = useSelector(state => Object.values(state.session))
    const dispatch = useDispatch()




    useEffect(() => {
        dispatch(getSpotsByIdThunk(Number(spotId)))
        dispatch(getSpotReviewsThunk(Number(spotId)))

    }, [dispatch, spotId])



    if (!spot) {
        return <div>Loading...</div>;
    }


    if (!spot.SpotImages || !spot.Owner || !spot.description) {
        return <div>Loading...</div>;
    }


    const { firstName, lastName } = spot.Owner

    const totalStars = reviews.reduce((acc, review) => acc + review.stars, 0);
    const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 'New';
    const reviewCount = reviews.length

    const reviewCountText = reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`

    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const userIsOwner = sessionUser && sessionUser.id === spot.id;

    const userLoggedIn = !!sessionUser;

    console.log(userIsOwner)


    return (
        <div>
            <h1 className={SpotDetailsStyles.spotName}>{spot.name}</h1>
            <p className="location">Location: {spot.city}, {spot.state}, {spot.country}</p>
            <div className={SpotDetailsStyles.spotDetailImages}>



                <img className={SpotDetailsStyles.largeImages} src={spot.SpotImages[0].url} alt="Large Image" />


                <div className={SpotDetailsStyles.smallImages}>
                    {spot.SpotImages.map((spot, index) => (
                        <img key={index} src={spot.url} alt={`Small Image ${index + 1}`} className={SpotDetailsStyles.smallImages} />
                    ))}
                </div>
            </div>

            <section className={SpotDetailsStyles.hostInfoCallOutContainer}>

                <div className={SpotDetailsStyles.hostInfo}>
                    <p>Hosted by <span className="host-name">{firstName} {lastName}</span></p>
                    <p>{spot.description}</p>
                </div>


                <div className={SpotDetailsStyles.callout}>
                    <p>Price: ${spot.price} per night</p>
                    <div>
                        <IoStar size={19} color="gold" />
                        {avgRating !== 'New' && (
                            <p>Average Rating: {avgRating} {reviewCountText && `· ${reviewCountText}`}</p>
                        )}

                    </div>
                    <button className="reserve-button" onClick={() => alert("Feature coming soon")}>Reserve</button>

                    {!userIsOwner && userLoggedIn && reviewCount === 0 && (
                        <p>Be the first to post a review!</p>
                    )}

                </div>



            </section>

            <section>

                <div className="heading-before-reviews">
                    <div>
                        <IoStar size={19} color="gold" />

                        {avgRating !== 'New' && reviewCountText && (
                            <p>Average Rating: {avgRating} · {reviewCountText}</p>
                        )}
                    </div>
                </div>

                <div className="reviews">
                    <h2>Reviews</h2>
                    {sortedReviews.map((review, index) => (
                        <div key={index} className={SpotDetailsStyles.reviews}>
                            <p>{review.User.firstName}</p>
                            <p>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })}</p>
                            <p>{review.review}</p>
                            <div>
                                <IoStar size={19} color="gold" />
                                <span>{review.stars}</span>
                            </div>
                        </div>
                    ))}
                </div>



            </section>



        </div>
    )


}

export default SpotDetail
