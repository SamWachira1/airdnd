import { useEffect, } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getCurrentSpotUser, getSpotsThunk } from "../../store/spot";
import SpotTile from "../LandingPage /SpotTile.jsx";
import StylesManageSpots from './ManageSpots.module.css'
import IoStar from "../StarIcons";
import OpenModalDelete from '../LandingPage /OpenModelDelete';
import ConfirmationModal from '../LandingPage /ConfirmationDelete';
import spotTileStyle from '../LandingPage /SpotTile.module.css'


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

    // useEffect(()=>{
    //     dispatch(getSpotsThunk())
    // }, [])



//   const handleUpdate = () => {
//     if (isOwner) {
//       nav(`/spots/${spot.id}/edit`);

//     } else {
//       alert("You are not authorized to update this spot.");
//     }
//   };


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
                {spots.map((spot) => {
                    if(spot.id === 13){

                        console.log('User spots', spot.previewImage)
                    }

                    return (
                    <li className={StylesManageSpots.spotTile} key={spot.id}>
                         {/* <SpotTile key={spot.id} spot={spot} showButtons={true} isOwner={true} /> */}

                        <SpotTile key={spot.id} spot={spot}/>


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


                            <div className={StylesManageSpots.updateDeleteContainer}>
                                <div className={StylesManageSpots.updateButton}>
                                    <button onClick={()=> nav(`/spots/${spot.id}/edit`)}>Update</button>
                                </div>

                         
                                <ul className={StylesManageSpots.deleteButton}>
                                    {/* Use OpenModalDelete component to open the confirmation modal */}
                                    <OpenModalDelete
                                        modalComponent={<ConfirmationModal spot={spot} />} // Pass the confirmation modal component
                                        itemText="Delete" // Text of the menu item that opens the modal
                                    />
                                </ul>

                    
                           </div>


                    </li>
                )})}
            </ul>
        </>
    );
}

export default ManageSpots
