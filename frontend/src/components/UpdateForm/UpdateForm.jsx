
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { updateSpotThunk } from "../../store/spot";
// import UpdateSpotStyles from './UpdateSpot.module.css';
import StyleUpdateForm from '../UpdateForm/UpdateForm.module.css'

import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { updateSpotThunk , getSpotsByIdThunk} from "../../store/spot";



const UpdateSpotForm = () => {
    const {spotId} = useParams()
    const dispatch = useDispatch()

    useEffect(()=>{
        dispatch(getSpotsByIdThunk(spotId))
    }, [dispatch, spotId])

 
    const spot = useSelector(state => state.spots[spotId]);

    const [country, setCountry] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [lat, setLat] = useState(1);
    const [lng, setLng] = useState(1);
    const [description, setDescription] = useState("");
    const [name, setSpotName] = useState("");
    const [price, setPrice] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const nav = useNavigate();

    useEffect(() => {
        if (spot) {
            // Set state values based on the spot object
            setCountry(spot.country || "");
            setAddress(spot.address || "");
            setCity(spot.city || "");
            setState(spot.state || "");
            setDescription(spot.description || "");
            setSpotName(spot.name || "");
            setPrice(spot.price || "");
        }
    }, [spot]);

    useEffect(() => {
        // Validation logic remains the same
        const newErrors = {};
        if (!country.trim()) {
            newErrors.country = "Country is required";
        }
        if (!address.trim()) {
            newErrors.address = "Address is required";
        }
        if (!city.trim()) {
            newErrors.city = "City is required";
        }
        if (!state.trim()) {
            newErrors.state = "State is required";
        }
        if (!name.trim()) {
            newErrors.name = "Spot name is required";
        }
        if (description.trim().length < 30) {
            newErrors.description = "Description needs 30 or more characters";
        }
        if (!price) {
            newErrors.price = "Price per night is required";
        }

        setErrors(newErrors);
    }, [country, address, city, state, name, description, price]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

     
        if (Object.values(errors).length === 0) {
            // Dispatch action to update spot
            const updatedSpot = {
                ...spot,
                country,
                address,
                city,
                state,
                lat,
                lng,
                description,
                name,
                price,
            };

            const success = await dispatch(updateSpotThunk(updatedSpot, spotId));

            if (success) {
                // Navigate to spot details page
                nav(`/spots/${spot.id}`);
            }
        }
    };


    return (
        <div>
            <h1>Update your Spot</h1>
            <form onSubmit={handleSubmit}>
            {submitted && errors.country && <p className={StyleUpdateForm.error}>{errors.country}</p>}
                    <label>
                        Country:
                        <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter country" />
                    </label>
                    {submitted && errors.address && <p className={StyleUpdateForm.error}>{errors.address}</p>}
                    <label>
                        Street Address:
                        <input type="text" name="streetAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter street address" />
                    </label>
                    {submitted && errors.city && <p className={StyleUpdateForm.error}>{errors.city}</p>}

                    <label>
                        City:
                        <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
                    </label>
                    {submitted && errors.state && <p className={StyleUpdateForm.error}>{errors.state}</p>}
                    <label>
                        State:
                        <input type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state" />
                    </label>
                    {/* Latitude and Longitude inputs (optional) */}

                        <div style={{ display: "none" }}>
                        <label>
                            Latitude:
                            <input type="text" name="latitude" value={lat} onChange={(e) => setLat(e.target.value)} placeholder="Enter latitude" />
                        </label>
                        <label>
                            Longitude:
                            <input type="text" name="longitude" value={lng} onChange={(e) => setLng(e.target.value)} placeholder="Enter longitude" />
                        </label> 

                        </div>


                    {/* Second section */}
                    <section>
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                        {submitted && errors.description && <p className={StyleUpdateForm.error}>{errors.description}</p>}
                        <textarea  style={{ width: "100%", minHeight: "100px" }} name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>
                    </section>

                    {/* Third section */}
                    <section>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                        {submitted && errors.name && <p className={StyleUpdateForm.error}>{errors.name}</p>}

                        <input type="text" name="spotName" value={name} onChange={(e) => setSpotName(e.target.value)} placeholder="Name of your spot" />
                    </section>

                    {/* Fourth section */}
                    <section>
                        <h2>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        {submitted && errors.price && <p className={StyleUpdateForm.error}>{errors.price}</p>}

                        <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
                    </section>


                <button type="submit">Update your Spot</button>
            </form>
        </div>
    );
};

export default UpdateSpotForm;
