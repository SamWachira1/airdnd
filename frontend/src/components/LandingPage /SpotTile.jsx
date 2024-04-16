import spotTileStyle from './SpotTile.module.css'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getSpotReviewsThunk } from '../../store/review';
import { useNavigate } from "react-router-dom";


const SpotTile = ({ spot }) => {
  const dispatch = useDispatch()
  const nav = useNavigate()

    // const reviews = useSelector(state=> Object.values(state.reviews))
    // const totalStars = reviews.reduce((acc, review)=> acc + review.stars, 0)
    // const avgRating = (totalStars/reviews.length.toFixed(1))
  
    

    useEffect(() => {
        dispatch(getSpotReviewsThunk(Number(spot.id)))

    }, [dispatch, spot.id])


    const formattedPrice = spot.price ? `$${spot.price.toFixed(2)}` : 'Price not available';


  return (
 
      <div className="spot-tile" onClick={()=> nav(`/spots/${spot.id}`)}>
        <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
        <div className="spot-details">
          <p>{spot.city}, {spot.state}</p>

          <p>Price: {formattedPrice} per night</p>

        </div>
      </div>

 

  );
};

export default SpotTile;
