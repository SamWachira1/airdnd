import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spot";
import { useEffect } from "react";
import SpotTile from "./SpotTile";
import spotTileStyle from './SpotTile.module.css'
import { NavLink } from "react-router-dom";


import IoStar from "../StarIcons";

function LandingPage() {

    const dispatch = useDispatch()
    const spots = useSelector(state=> Object.values(state.spots)) 

   
    useEffect(() => {
        dispatch(getSpotsThunk())
    }, [dispatch])



    if (!spots) {
        <div>Loading...</div>
    }



    return (
        <>
            <h1 className={spotTileStyle.h1}>Welcome!</h1>
            <h2 className={spotTileStyle.h2}>Spots</h2>
            <ul className={spotTileStyle.spotTileContainer}>
                {spots.map((spot) => {
                    if(spot.id === 13){

                        console.log('All spots', spot.previewImage)
                    }
                   return(
                    
                     <NavLink key={spot.id} to={`/spots/${spot.id}`}>
                    <li className={spotTileStyle.spotTile} key={spot.id}>

                        <SpotTile key={spot.id} spot={spot} />

                        {spot.avgRating ? (
                        <div className={spotTileStyle.rating}>
                            <IoStar size={19} color="gold" />
                            <span>{parseFloat(spot.avgRating).toFixed(2)}</span>
                        </div>
                    ) : (

                        <div className={spotTileStyle.rating}>
                            <IoStar size={19} color="gold" />
                            <span className="">New</span>
                        </div>

                    )}

            

                    </li>
                 </NavLink>
                   )

                })}
            </ul>

        </>
    )
}

export default LandingPage
