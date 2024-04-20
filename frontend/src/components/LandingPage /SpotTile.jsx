import spotTileStyle from './SpotTile.module.css'

import { useNavigate } from "react-router-dom";
import OpenModalDelete from './OpenModelDelete';
import ConfirmationModal from './ConfirmationDelete';

const SpotTile = ({ spot, showButtons = false, isOwner}) => {


  const nav = useNavigate()
  

 

  const formattedPrice = spot.price ? `$${spot.price.toFixed(2)}` : 'Price not available';


  const handleUpdate = () => {
    if (isOwner) {
      nav(`/spots/${spot.id}/edit`);

    } else {
      alert("You are not authorized to update this spot.");
    }
  };




  return (

    <>

      <div onClick={() => nav(`/spots/${spot.id}`)}>
        <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
        <div >
          <p>{spot.city}, {spot.state}</p>
          <p className={spotTileStyle.price}>
           <span style={{ fontWeight: 550 }}>{formattedPrice} </span>night
        </p>

        </div>
      </div>

      <div className={spotTileStyle.spotTileContainer}>

        {showButtons && isOwner && (
          <div className={spotTileStyle.updateButtonContainer}>
            <button className={spotTileStyle.buttonUpdate} onClick={handleUpdate}>Update</button>
          </div>

        )}



        {showButtons && isOwner && (
          <ul className={spotTileStyle.deleteButtonContainer}>
            {/* Use OpenModalDelete component to open the confirmation modal */}
            <OpenModalDelete 
              modalComponent={<ConfirmationModal spot={spot} />} // Pass the confirmation modal component
              itemText="Delete" // Text of the menu item that opens the modal
            />
          </ul>
        )}
      </div>


    </>



  );


};

export default SpotTile;
