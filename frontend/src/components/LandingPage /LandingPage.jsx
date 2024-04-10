import { useDispatch, useSelector } from "react-redux";
import { getSpotsThunk } from "../../store/spot";
import { useEffect } from "react";
import SpotTile from "./SpotTile";
import spotTileStyle from './SpotTile.module.css'

function LandingPage(){

    const dispatch = useDispatch()
    const spots = useSelector(state => Object.values(state.spots))

    useEffect(()=>{
        dispatch(getSpotsThunk())
    }, [dispatch])


    return (
        <>
        <h1>Welcome!</h1>
        <h2>Spots</h2>
        <ul className={spotTileStyle.spotTileContainer}>    
            {spots.map((spot) => (
                <li className={spotTileStyle.spotTile} key={spot.id}>
                    <SpotTile key={spot.id} spot={spot} />
                </li>
            ))}
        </ul>

        </>
    )
}

export default LandingPage
