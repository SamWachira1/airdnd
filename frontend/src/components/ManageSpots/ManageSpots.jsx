import { useEffect, } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentSpotUser } from "../../store/spot";
import SpotTile from "../LandingPage /SpotTile.jsx";
import StylesManageSpots from './ManageSpots.module.css'
import IoStar from "../StarIcons";

const ManageSpots = () => {
    const nav = useNavigate()
    const dispatch = useDispatch()

    const spots = useSelector(state => Object.values(state.spots))
    const currentUser = useSelector(state => state.session.user);



    useEffect(() => {
        if (currentUser) {
            dispatch(getCurrentSpotUser())
        }
    }, [dispatch, currentUser])




    if (!spots || !currentUser) {
        return (
            <>
                <div>Loading...</div>
            </>
        );
    }

    const userSpots = spots.filter(spot => spot.ownerId === currentUser.id);




    if (!userSpots) {
        return (
            <>
                <div>Loading...</div>
            </>
        );
    }




    return (
        <>
            <h1 className={StylesManageSpots.h1}>Manage Your Spots</h1>
            <button className={StylesManageSpots.createButtonSpot} onClick={() => nav('/spots/new')}>Create a New Spot</button>

            <ul className={StylesManageSpots.spotTileContainer}>
                {userSpots.map((spot) => (
                    <li className={StylesManageSpots.spotTile} key={spot.id}>
                        <SpotTile key={spot.id} spot={spot} showButtons={true} isOwner={true} />

                        <div className={StylesManageSpots.ratings}>
                            {spot.avgRating ? (
                                <>
                                    <IoStar size={19} color="gold" />
                                    <span>{parseFloat(spot.avgRating).toFixed(2)}</span>
                                </>
                            ) : (
                                <span>New</span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}

export default ManageSpots
