import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotsByIdThunk } from '../../store/spot';
import { getSpotReviewsThunk } from '../../store/review';
import { useEffect } from 'react';
import SpotDetailsStyles from './SpotDetail.module.css'
import IoStar from '../StarIcons';
import OpenModalReview from './OpenModelReview';
import OpenModalDelete from './OpenModelDelete';
import PostReviewModel from './PostReviewModel'
import ConfirmationModalDelete from './ConfirmationModalDelete';


function SpotDetail() {

    const { spotId } = useParams()
    const spot = useSelector(state => state.spots[spotId])
    const reviews = useSelector(state => Object.values(state.reviews)); // Change this line
    const sessionUser = useSelector(state => state.session.user)
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
    const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(2) : 'New';
    const reviewCount = reviews.length


    const reviewCountText = reviewCount === 0 ? 'Be the first to post a review!' : reviewCount === 1 ? '1 Review' : `${reviewCount} Reviews`;

    // const avgRatingText = avgRating !== 'New' ? `${avgRating} ${reviewCountText && `· ${reviewCountText}`}` : 'New';
    const avgRatingText = avgRating !== 'New' ? `${avgRating} · ${reviewCountText}` : 'New';

    const sortedReviews = [...reviews].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    const userIsOwner = sessionUser && sessionUser.id === spot.ownerId;

    const userLoggedIn = !!sessionUser;
    const userHasReviewed = reviews.some(review => review.userId === sessionUser?.id);





    let hasImages = false;
    let largeImage = "";
    const otherImages = [];



    if (spot.SpotImages.length) {
        hasImages = true;
        spot.SpotImages.forEach((img) => {
            if (img.preview) {
                largeImage = img.url;
            } else {
                otherImages.push(img.url);
            }
        });
    }






    return (
        <div className={SpotDetailsStyles.mainContainer}>
            <h1 className={SpotDetailsStyles.spotName}>{spot.name}</h1>
            <p className={SpotDetailsStyles.location}>Location: {spot.city}, {spot.state}, {spot.country}</p>


            <div className={SpotDetailsStyles.spotDetailImages}>
                {hasImages && <img className={SpotDetailsStyles.largeImages} src={largeImage} alt="Large Image" />}
                <div className={SpotDetailsStyles.smallImages}>
                    {otherImages.map((url, index) => (
                        <img key={index} src={url} alt={`Small Image ${index + 1}`} className={SpotDetailsStyles.img} />
                    ))}
                </div>
            </div>

            <section className={SpotDetailsStyles.hostInfoCallOutContainer}>

                <div className={SpotDetailsStyles.hostInfo}>
                    <p className={SpotDetailsStyles.hostTitle}>Hosted by <span className={SpotDetailsStyles.hostName}>{firstName} {lastName}</span></p>
                    <p>{spot.description}</p>
                </div>


                <div className={SpotDetailsStyles.callout}>
                    <span>
                        <span className={SpotDetailsStyles.price}>${spot.price.toFixed(2)}</span> night
                    </span>
                    <div className={SpotDetailsStyles.ratingContainer}>
                        <IoStar size={19} color="gold" />
                        {avgRating && (
                            <p>{avgRatingText}</p>
                        )}

                    </div>
                    <button className={SpotDetailsStyles.reserverButton} onClick={() => alert("Feature coming soon")}>Reserve</button>

                </div>

            </section>

            <section>

                <div >
                    <div className={SpotDetailsStyles.headingBeforeReviews}>
                        <IoStar size={24} color="gold" />
                        {avgRating !== 'New' && reviewCountText ? (
                            <p>{avgRating} · {reviewCountText}</p>
                        ) : (
                            <p>New</p>
                        )}
                    </div>
                </div>

                <div>
                    {!userIsOwner && userLoggedIn && reviewCount === 0 && (
                        <p className={SpotDetailsStyles.noReviewsText}>Be the first to post a review!</p>
                    )}
                </div>

                <div>
                    {!userIsOwner && userLoggedIn && !userHasReviewed && (

                        <>
                            <button className={SpotDetailsStyles.buttonPostReview}>
                                <ul>
                                    <OpenModalReview className={SpotDetailsStyles.modalContainer}
                                        modalComponent={<PostReviewModel spot={spot} />}
                                        itemText="Post Your Review" />

                                </ul>

                            </button>
                        </>


                    )}
                </div>

                <div className="reviews">
              

                    {sortedReviews.map((review, index) => (

                        <div key={index} className={SpotDetailsStyles.reviews}>
                            <p style={{ fontWeight: 550 }}>{review.firstName}</p>
                            <p style={{ fontWeight: 500, color: "grey" }}>{new Date(review.createdAt).toLocaleString('en-US', { month: 'long', year: 'numeric' })} </p>
                            <p>{review.review}</p>
                            <div >
                                <IoStar size={20} color="gold" />
                                <span>{review.stars}</span>
                            </div>


                            {userLoggedIn && sessionUser.id === review.userId && (
                                <>

                                    <button className={SpotDetailsStyles.deleteButton}>
                                        <ul>
                                            <OpenModalDelete
                                                modalComponent={<ConfirmationModalDelete review={review} />}
                                                itemText="Delete Review"
                                            />

                                        </ul>

                                    </button>

                                </>
                            )}
                        </div>
                    ))}


                </div>










            </section>



        </div>
    )


}

export default SpotDetail
