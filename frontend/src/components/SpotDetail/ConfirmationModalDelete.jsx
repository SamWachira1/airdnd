
import { useDispatch } from 'react-redux';
import { deleteReviewThunk } from '../../store/review';
import { useModal } from '../../context/Modal';




const ConfirmationModalDelete = ({review})=> {
    const dispatch = useDispatch()
    const { closeModal } = useModal();



    const handleDelete = async(e) => {
        // Call the onDeleteReview function to delete the review
     e.preventDefault()
        try {
            await dispatch(deleteReviewThunk(review.id))
            closeModal()
        }catch(e){
            console.error('Error deleting review', e)
        }

    };


    const onCancel = () => {
        closeModal();
    };

    return (
        <div className="confirmation-modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <div className="button-container">
                <button className="delete-button" onClick={handleDelete}>Yes (Delete Review)</button>
                <button className="keep-button"onClick={onCancel}>No (Keep Review)</button>
            </div>
        </div>
    );

}

export default ConfirmationModalDelete
