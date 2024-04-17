import { useEffect, } from "react";
import { useDispatch } from "react-redux";
// import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentSpotUser } from "../../store/spot";
import SpotTile from "../LandingPage /SpotTile.jsx";
import StylesManageSpots from './ManageSpots.module.css'
import IoStar from "../StarIcons";
import UpdateSpotForm from '../UpdateForm/UpdateForm';

const ManageSpots = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()
    const currentSpots = useSelector(state => state.spots.Spots)


    useEffect(() => {
        dispatch(getCurrentSpotUser())
    }, [dispatch])


    const handleEdit = (spotId) => {
        // Navigate to the update spot form when edit button is clicked
        nav(`/spots/${spotId}/edit`);
    };

    if (!currentSpots) {
        return (
            <>
                <div>Loading...</div>
            </>
        )
    }


    return (
        <>
            <h1>Manage Your Spots</h1>
            <button onClick={() => nav('/spots/new')}>Create a New Spot</button>

            <ul className={StylesManageSpots.spotTileContainer}>
                {currentSpots.map((spot) => (

                    <li className={StylesManageSpots.spotTile} key={spot.id}>

                        <SpotTile key={spot.id} spot={spot} showButtons={true} onEdit={handleEdit}/>
               
                        {spot.avgRating && (
                            <div>
                                <IoStar size={19} color="gold" />
                                <span>{parseFloat(spot.avgRating).toFixed(2)}</span>
                            </div>


                        )}

                    </li>


                    

                ))}


            </ul>

        </>
    )
}

export default ManageSpots
