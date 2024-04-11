import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotsByIdThunk } from '../../store/spot';
import { getSpotReviewsThunk } from '../../store/review';
import { useEffect } from 'react';
import SpotDetailsStyles from './SpotDetail.module.css'


function SpotDetail() {

    const { spotId } = useParams()
    const spot = useSelector(state => state.spots[spotId])
    const review = useSelector(state => state.reviews[spotId])
    const dispatch = useDispatch()




    useEffect(() => {
        dispatch(getSpotsByIdThunk(Number(spotId)))
    }, [dispatch, spotId])

    useEffect(() => {
        dispatch(getSpotReviewsThunk(Number(spotId)))

    }, [dispatch, spotId])

    
    if (!spot) {
        return <div>Loading...</div>;
    }




    return (
        <div>
            <h1 className={SpotDetailsStyles.spotName}>{spot.name}</h1>
            <p className="location">Location: {spot.city}, {spot.state}, {spot.country}</p>
            <div className={SpotDetailsStyles.spotDetailImages}>
              


                <img className={SpotDetailsStyles.largeImages} src={spot.SpotImages[0].url} alt="Large Image"/>
          

                <div className={SpotDetailsStyles.smallImages}>
                    {spot.SpotImages.map((spot, index) => (
                        <img key={index} src={spot.url} alt={`Small Image ${index + 1}`} className={SpotDetailsStyles.smallImages} />
                    ))}
                </div>
            </div>
            <div className="host-info">
                <p>Hosted by <span className="host-name">Spot Owner ref id: {spot.ownerId}</span></p>
            </div>

            <div className="description">
                <p>{spot.description}</p>
            </div>

            <div className="callout">
                {/* Callout information box */}
            </div>

        </div>
    )


}

export default SpotDetail
