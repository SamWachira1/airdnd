import { useState, useEffect } from "react"
import { useDispatch, useSelector} from "react-redux"
import { createSpotThunk, createImage } from "../../store/spot"
import NewSpotStyles from './NewSpot.module.css'
import { useNavigate } from 'react-router-dom';



const SpotForm = () => {

    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [lat, setLatitude] = useState("")
    const [lng, setLongitude] = useState("")
    const [description, setDescription] = useState("");
    const [name, setSpotName] = useState("");
    const [price, setPrice] = useState("")
    const [previewImageUrl, setPreviewImageUrl] = useState(""); // New state for the preview image URL
    const [img1, setImg1] = useState("")
    const [img2, setImg2] = useState("")
    const [img3, setImg3] = useState("")
    const [img4, setImg4] = useState("")

    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const nav = useNavigate()

    const sessionUser = useSelector(state => state.session)
    const isLoggedIn = !!sessionUser




    useEffect(() => {
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
        if (!price.trim()) {
            newErrors.price = "Price per night is required";
        }
        if (!previewImageUrl.trim()) {
            newErrors.previewImageUrl = "Preview Image URL is required";
        }
        setErrors(newErrors);
    }, [country, address, city, state, name, description, price, previewImageUrl]);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (isLoggedIn && Object.values(errors).length === 0) {
            setErrors({});
            const spot = {
                address,
                city,
                state,
                country,
                lat,
                lng,
                name,
                description,
                price,
                previewImageUrl,
                imageUrls: [img1, img2, img3, img4], 
            }

            const newSpot = await dispatch(createSpotThunk(spot));
    

            if (newSpot) {
                nav(`/spots/${newSpot.id}`);
            } else {
                console.log("Error creating spot");
            }
        }
    };



    return (
        <div>
            <h1>Create a New Spot</h1>
            {/* First section */}
            <section className={NewSpotStyles.mainSectionContainer}>
                <h2>Where's your place located?</h2>
                <p>Guests will only get your exact address once they book a reservation.</p>
                <form onSubmit={handleSubmit}>
                {submitted && errors.country && <p className={NewSpotStyles.error}>{errors.country}</p>}
                    <label>
                        Country:
                        <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter country" />
                    </label>
                    {submitted && errors.address && <p className={NewSpotStyles.error}>{errors.address}</p>}
                    <label>
                        Street Address:
                        <input type="text" name="streetAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter street address" />
                    </label>
                    {submitted && errors.city && <p className={NewSpotStyles.error}>{errors.city}</p>}

                    <label>
                        City:
                        <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
                    </label>
                    {submitted && errors.state && <p className={NewSpotStyles.error}>{errors.state}</p>}
                    <label>
                        State:
                        <input type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state" />
                    </label>
                    {/* Latitude and Longitude inputs (optional) */}

                    {/* <label>
                        Latitude:
                        <input type="text" name="latitude" value={lat} onChange={(e) => setLatitude(e.target.value)} placeholder="Enter latitude" />
                    </label>
                    <label>
                        Longitude:
                        <input type="text" name="longitude" value={lng} onChange={(e) => setLongitude(e.target.value)} placeholder="Enter longitude" />
                    </label> */}


                    {/* Second section */}
                    <section>
                        <h2>Describe your place to guests</h2>
                        <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                        {submitted && errors.description && <p className={NewSpotStyles.error}>{errors.description}</p>}
                        <textarea  style={{ width: "100%", minHeight: "100px" }} name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>
                    </section>

                    {/* Third section */}
                    <section>
                        <h2>Create a title for your spot</h2>
                        <p>Catch guests' attention with a spot title that highlights what makes your place special.</p>
                        {submitted && errors.name && <p className={NewSpotStyles.error}>{errors.name}</p>}

                        <input type="text" name="spotName" value={name} onChange={(e) => setSpotName(e.target.value)} placeholder="Name of your spot" />
                    </section>

                    {/* Fourth section */}
                    <section>
                        <h2>Set a base price for your spot</h2>
                        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        {submitted && errors.price && <p className={NewSpotStyles.error}>{errors.price}</p>}

                        <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
                    </section>

                    {/* Fifth section */}
                    <section className={NewSpotStyles.imagesUrl}>
                        <h2>Liven up your spot with photos</h2>
                        <p>Submit a link to at least one photo to publish your spot.</p>
                        {submitted && errors.previewImageUrl && <p className={NewSpotStyles.error}>{errors.previewImageUrl}</p>}

                        <label >
                            Preview Image URL:
                            <input type="text" name="previewImageUrl" value={previewImageUrl} onChange={(e)=> setPreviewImageUrl(e.target.value)} placeholder="Preview Image URL" />
                        </label>
                        <label>
                            Image URL 1:
                            <input type="text" name="imageUrl1" value={img1} onChange={(e) => setImg1(e.target.value)} placeholder="Image URL 1" />
                        </label>
                        <label>
                            Image URL 2:
                            <input type="text" name="imageUrl2" value={img2} onChange={(e) => setImg2(e.target.value)} placeholder="Image URL 2" />
                        </label>
                        <label>
                            Image URL 3:
                            <input type="text" name="imageUrl3" value={img3} onChange={(e) => setImg3(e.target.value)} placeholder="Image URL 3" />
                        </label>
                        <label>
                            Image URL 4:
                            <input type="text" name="imageUrl4" value={img4} onChange={(e) => setImg4(e.target.value)} placeholder="Image URL 4" />
                        </label>
                       
                    </section>

                    <button type="submit">Create Spot</button>
                </form>
            </section>





        </div>
    );
}




export default SpotForm 
