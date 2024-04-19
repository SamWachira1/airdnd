import { useDispatch } from 'react-redux';
import { deleteSpotThunk, getCurrentSpotUser} from '../../store/spot';
import { useEffect } from "react";
import { useModal } from '../../context/Modal';

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
      <div className="confirmation-modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot?</p>
        <div className="button-container">
          <button className="delete-button" onClick={handleDelete}>Yes (Delete Spot)</button>
          <button className="cancel-button" onClick={onCancel}>No (Keep Spot)</button>
        </div>
      </div>
    );
  };
  
  export default ConfirmationModal;
