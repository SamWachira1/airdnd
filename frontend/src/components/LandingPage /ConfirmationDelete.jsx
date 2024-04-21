import { useDispatch } from 'react-redux';
import { deleteSpotThunk, getCurrentSpotUser} from '../../store/spot';
import { useEffect } from "react";
import { useModal } from '../../context/Modal';
import SpotTileStyles from './SpotTile.module.css'

const ConfirmationModal = ({spot}) => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();


    useEffect(()=>{
        dispatch(getCurrentSpotUser())
    }, [dispatch])


    const handleDelete =  async(e) => {
        e.preventDefault()

        try {
            await dispatch(deleteSpotThunk(spot.id))
            closeModal();
        }catch(e) {
            console.error('Error deleting spot:', e);
        }
    
    };

    const onCancel = () => {
        closeModal();
    };


    return (
      <div className={SpotTileStyles.confirmationModal}>
        <h2 className={SpotTileStyles.confirmDeleteHeader}>Confirm Delete</h2>
        <p className={SpotTileStyles.confirmDeleteText}>Are you sure you want to remove this spot?</p>
        <div className={SpotTileStyles.buttonContainer}>
          <button  className={SpotTileStyles.deleteButtonReview} onClick={handleDelete}>Yes (Delete Spot)</button>
          <button  className={SpotTileStyles.cancelButtonReview}onClick={onCancel}>No (Keep Spot)</button>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
