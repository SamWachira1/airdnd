import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotsByIdThunk } from '../../store/spot';
import { useEffect } from 'react';


function SpotDetail() {

    const { spotId } = useParams()
    const spot = useSelector(state => state.spots[spotId])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getSpotsByIdThunk(Number(spotId)))
    }, [dispatch, spotId])


    if (!spot) {
        return <div>Loading...</div>;
    }

    console.log(spot)

    return (
        <div>
            <h1 className="spot-name">{spot.name}</h1>
            <p className="location">Location: {spot.city}, {spot.state}, {spot.country}</p>
            <div>
                <img></img>
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

    // return (
    //     <div className="spot-detail">
    //         <h1 className="spot-name">{spot.name}</h1>
    //         <p className="location">Location: {spot.city}, {spot.state}, {spot.country}</p>

    //         <div className="images">
    //             <img src={spot.largeImage} alt="Large Image" className="large-image" />
    //             <div className="small-images">
    //                 {spot.smallImages.map((image, index) => (
    //                     <img key={index} src={image} alt={`Small Image ${index + 1}`} className="small-image" />
    //                 ))}
    //             </div>
    //         </div>

    //         <div className="host-info">
    //             <p>Hosted by <span className="host-name">{spot.host.firstName} {spot.host.lastName}</span></p>
    //         </div>

    //         <div className="description">
    //             <p>{spot.description}</p>
    //         </div>

    //         <div className="callout">
    //             {/* Callout information box */}
    //         </div>
    //     </div>
    // );
}

export default SpotDetail
