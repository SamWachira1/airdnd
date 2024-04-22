import { NavLink } from 'react-router-dom';
import spotTileStyle from './SpotTile.module.css'
// import { useNavigate } from "react-router-dom";
// import OpenModalDelete from './OpenModelDelete';
// import ConfirmationModal from './ConfirmationDelete';

const SpotTile = ({ spot}) => {


  // const nav = useNavigate()
  

  if(!spot.previewImage){
    return (
      <>
        <div>Loading...</div>
      </>
    )
  }

  const formattedPrice = spot.price ? `$${spot.price.toFixed(2)}` : 'Price not available';


  // const handleUpdate = () => {
  //   if (isOwner) {
  //     nav(`/spots/${spot.id}/edit`);

  //   } else {
  //     alert("You are not authorized to update this spot.");
  //   }
  // };


  // console.log(spot.previewImage, spot.id)

  return (

    <>
      <NavLink to={`/spots/${spot.id}`}>
          <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
          <div >
            <p>{spot.city}, {spot.state}</p>
            <p className={spotTileStyle.price}>
            <span style={{ fontWeight: 550 }}>{formattedPrice} </span>night
          </p>

          </div>
      </NavLink>

      {/* <div className={spotTileStyle.spotTileContainer}>

        {showButtons && isOwner && (
          <div className={spotTileStyle.updateButtonContainer}>
            <button className={spotTileStyle.buttonUpdate} onClick={handleUpdate}>Update</button>
          </div>

        )}


        {showButtons && isOwner && (
          <ul className={spotTileStyle.deleteButtonContainer}>
            <OpenModalDelete 
              modalComponent={<ConfirmationModal spot={spot} />} 
              itemText="Delete"
            />
          </ul>
        )}
      </div> */}


    </>



  );


};

export default SpotTile;
