import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk} from "../../store/spot";
import { useEffect } from "react";
import SpotTile from "./SpotTile";
import spotTileStyle from './SpotTile.module.css'
// import { getSpotReviewsThunk } from "../../store/review";
import IoStar from "../StarIcons";

function LandingPage(){

    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots))
    // const reviews = useSelector(state => Object.values(state.reviews))


    useEffect(()=>{
        dispatch(getSpotsThunk())
    }, [dispatch])

 

    if(!spots){
        <div>Loading...</div>
    }

    return (
        <>
        <h1>Welcome!</h1>
        <h2>Spots</h2>
        <ul className={spotTileStyle.spotTileContainer}>    
            {spots.map((spot) => (
                <li className={spotTileStyle.spotTile} key={spot.id}>

                    <SpotTile key={spot.id} spot={spot} />

                    {spot.avgRating !== undefined && (
                             <div>
                                 <IoStar size={19} color="gold" />
                                 <span>{spot.avgRating.toFixed(1)}</span>
                             </div>

                   
                        )}

                </li>
               
            ))}
        </ul>

        </>
    )
}

export default LandingPage
