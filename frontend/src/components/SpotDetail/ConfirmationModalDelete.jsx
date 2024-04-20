
import { useDispatch } from 'react-redux';
import { deleteReviewThunk } from '../../store/review';
import { useModal } from '../../context/Modal';
import SpotDetailStyles from './SpotDetail.module.css'




const ConfirmationModalDelete = ({review})=> {
    const dispatch = useDispatch()
    const { closeModal } = useModal();

 
    const handleDelete = async() => {    
        try {
           
            await dispatch(deleteReviewThunk(review.id))
            .then(()=> closeModal())


        }catch(e){
            console.error('Error deleting review', e)
        }

    };


    const onCancel = () => {
        closeModal();
    };

    return (
        <div className={SpotDetailStyles.confirmationModal}>
            <h2 className={SpotDetailStyles.confirmDeleteHeader}>Confirm Delete</h2>
            <p className={SpotDetailStyles.confirmDeleteText}>Are you sure you want to delete this review?</p>
            <div className={SpotDetailStyles.buttonContainer}>
                <button className={SpotDetailStyles.deleteButtonReview} onClick={handleDelete}>Yes (Delete Review)</button>
                <button className={SpotDetailStyles.cancelButtonReview }onClick={onCancel}>No (Keep Review)</button>
            </div>
        </div>
    );

}

export default ConfirmationModalDelete
