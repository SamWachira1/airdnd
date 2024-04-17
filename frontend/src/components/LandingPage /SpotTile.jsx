import spotTileStyle from './SpotTile.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getSpotReviewsThunk } from '../../store/review';
import { useNavigate } from "react-router-dom";
import UpdateSpotForm from '../UpdateForm/UpdateForm';
import { NavLink } from 'react-router-dom';

const SpotTile = ({ spot, showButtons = false, onEdit }) => {
  const sessionUser = useSelector(state => state.session)
  const dispatch = useDispatch()
  const nav = useNavigate()


  useEffect(() => {
    dispatch(getSpotReviewsThunk(Number(spot.id)))

  }, [dispatch, spot.id])


  const formattedPrice = spot.price ? `$${spot.price.toFixed(2)}` : 'Price not available';
  const isOwner = spot.ownerId

  const handleUpdate = () => {
    if (isOwner) {
      nav(`/spots/${spot.id}/edit`);

    } else {
      // Handle the case where the user is not the owner
      alert("You are not authorized to update this spot.");
    }
  };
 
  return (
 
    <>
    
    <div className="spot-tile" onClick={()=> nav(`/spots/${spot.id}`)}>
      <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
      <div className="spot-details">
        <p>{spot.city}, {spot.state}</p>

        <p>Price: {formattedPrice} per night</p>

      </div>
    </div>

      <div>

      {showButtons && isOwner && (
          <div>
            <button onClick={handleUpdate}>Update Spot</button>
          </div>
        )}

      </div>


    </>



);


};

export default SpotTile;
