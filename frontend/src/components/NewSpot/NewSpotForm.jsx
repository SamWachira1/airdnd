import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { createSpotThunk } from "../../store/spot"
import NewSpotStyles from './NewSpot.module.css'
import { useNavigate } from 'react-router-dom';



const SpotForm = () => {

    const defaultImageURLs = {
        img1: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGhfuejy_oghr74Ss2n8bn0pEBx2JjwM-Hg&s`,
        img2: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGhfuejy_oghr74Ss2n8bn0pEBx2JjwM-Hg&s`,
        img3: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGhfuejy_oghr74Ss2n8bn0pEBx2JjwM-Hg&s`,
        img4: `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfGhfuejy_oghr74Ss2n8bn0pEBx2JjwM-Hg&s`,
    };

    const [country, setCountry] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [lat, setLatitude] = useState(1)
    const [lng, setLongitude] = useState(1)
    const [description, setDescription] = useState("");
    const [name, setSpotName] = useState("");
    const [price, setPrice] = useState("")
    const [previewImage, setPreviewImage] = useState("");
    const [img1, setImg1] = useState("");
    const [img2, setImg2] = useState("");
    const [img3, setImg3] = useState("");
    const [img4, setImg4] = useState("");

    // const handleImageInputChange = (name, value) => {
    //     switch (name) {
    //         case "img1":
    //             setImg1(value);
    //             break;
    //         case "img2":
    //             setImg2(value);
    //             break;
    //         case "img3":
    //             setImg3(value);
    //             break;
    //         case "img4":
    //             setImg4(value);
    //             break;
    //         default:
    //             break;
    //     }
    // };

    const [submitted, setSubmitted] = useState(false)
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const nav = useNavigate()

    const sessionUser = useSelector(state => state.session.user)
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
        if (!previewImage.trim()) {
            newErrors.previewImage = "Preview Image URL is required";
        }
        setErrors(newErrors);
    }, [country, address, city, state, name, description, price, previewImage]);



    const handleSubmit = async (e) => {

        try {
            e.preventDefault();
            setSubmitted(true);


            if (isLoggedIn && Object.values(errors).length === 0) {
                setErrors({});
                const spot = {
                    ownerId: sessionUser.id,
                    address,
                    city,
                    state,
                    country,
                    lat,
                    lng,
                    name,
                    description,
                    price,
                }


                // const spotImages = [
                //     { url: previewImage, preview: true },
                //     { url: img1, preview: false },
                //     { url: img2, preview: false },
                //     { url: img3, preview: false },
                //     { url: img4, preview: false },
                // ];

                const spotImages = [
                    { url: previewImage, preview: true },
                    { url: img1 || defaultImageURLs.img1, preview: false },
                    { url: img2 || defaultImageURLs.img2, preview: false },
                    { url: img3 || defaultImageURLs.img3, preview: false },
                    { url: img4 || defaultImageURLs.img4, preview: false },
                ];



                const newSpot = await dispatch(createSpotThunk(spot, spotImages));

                if (newSpot) nav(`/spots/${newSpot.id}`)



            }

        } catch (e) {
            console.log(e)
        }
    };



    return (
        <div>
            <div className={NewSpotStyles.header}>
                <h1 className={NewSpotStyles.h1}>Create a New Spot</h1>
                <h2 className={NewSpotStyles.h2}>Where&apos;s your place located?</h2>
                <p className={NewSpotStyles.p}>Guests will only get your exact address once they book a reservation.</p>

            </div>

            <section className={NewSpotStyles.mainSectionContainer}>

                <form className={NewSpotStyles.formContainer} onSubmit={handleSubmit}>
                    {submitted && errors.country && <p className={NewSpotStyles.error}>{errors.country}</p>}

                    <section className={NewSpotStyles.addressContainer}>
                        <label className={NewSpotStyles.country}>
                            Country:
                            <input type="text" name="country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Enter country" />
                        </label>
                        {submitted && errors.address && <p className={NewSpotStyles.error}>{errors.address}</p>}
                        <label>
                            Street Address:
                            <input type="text" name="streetAddress" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter street address" />
                        </label>
                        {submitted && errors.city && <p className={NewSpotStyles.error}>{errors.city}</p>}

                        <div className={NewSpotStyles.cityStateContainer}>

                            <label className={NewSpotStyles.city}>
                                City:
                                <input type="text" name="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter city" />
                            </label>
                            {submitted && errors.state && <p className={NewSpotStyles.error}>{errors.state}</p>}
                            <label className={NewSpotStyles.state}>
                                State:
                                <input type="text" name="state" value={state} onChange={(e) => setState(e.target.value)} placeholder="Enter state" />
                            </label>
                        </div>

                    </section>
                    {/* Latitude and Longitude inputs (optional) */}

                    <div style={{ display: "none" }}>
                        <label>
                            Latitude:
                            <input type="text" name="latitude" value={lat} onChange={(e) => setLatitude(e.target.value)} placeholder="Enter latitude" />
                        </label>
                        <label>
                            Longitude:
                            <input type="text" name="longitude" value={lng} onChange={(e) => setLongitude(e.target.value)} placeholder="Enter longitude" />
                        </label>
                    </div>


                    {/* Second section */}
                    <section className={NewSpotStyles.textbox}>
                        <h2 className={NewSpotStyles.guestDescription}>Describe your place to guests</h2>
                        <p className={NewSpotStyles.descriptionText}>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
                        {submitted && errors.description && <p className={NewSpotStyles.error}>{errors.description}</p>}
                        <textarea style={{ width: "100%", minHeight: "100px" }} name="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Please write at least 30 characters"></textarea>
                    </section>

                    {/* Third section */}
                    <section>
                        <h2 className={NewSpotStyles.guestDescription}>Create a title for your spot</h2>
                        <p className={NewSpotStyles.p}>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
                        {submitted && errors.name && <p className={NewSpotStyles.error}>{errors.name}</p>}

                        <input type="text" name="spotName" value={name} onChange={(e) => setSpotName(e.target.value)} placeholder="Name of your spot" />
                    </section>

                    {/* Fourth section */}
                    <section className={NewSpotStyles.guestDescripContainer}>
                        <h2 className={NewSpotStyles.guestDescription}>Set a base price for your spot</h2>
                        <p className={NewSpotStyles.p}>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                        {submitted && errors.price && <p className={NewSpotStyles.error}>{errors.price}</p>}

                        <input type="number" name="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price per night (USD)" />
                    </section>

                    {/* Fifth section */}
                    <section className={NewSpotStyles.imagesUrl}>
                        <h2 className={NewSpotStyles.guestDescription}>Liven up your spot with photos</h2>
                        <p className={NewSpotStyles.p} >Submit a link to at least one photo to publish your spot.</p>
                        {submitted && errors.previewImage && <p className={NewSpotStyles.error}>{errors.previewImage}</p>}

                        <label >
                            Preview Image URL:
                            <input type="text" name="previewImage" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} placeholder="Preview Image URL" />
                        </label>



                        <label>
                            Image URL 1:
                            {/* <input type="text" name="imageUrl1" value={img1} onChange={(e) => setImg1(e.target.value)} placeholder="Image URL 1" /> */}

                            <input
                                type="text"
                                name="imageUrl1"
                                value={img1 || ""}
                                onChange={(e) => setImg1(e.target.value)}
                                placeholder="Image URL 1"
                            />

                        </label>
                        <label>
                            Image URL 2:
                            {/* <input type="text" name="imageUrl2" value={img2} onChange={(e) => setImg2(e.target.value)} placeholder="Image URL 2" /> */}

                            <input
                                type="text"
                                name="imageUrl2"
                                value={img2 || ""}
                                onChange={(e) => setImg2(e.target.value)}

                                placeholder="Image URL 2"
                            />
                        </label>
                        <label>
                            Image URL 3:
                            {/* <input type="text" name="imageUrl3" value={img3} onChange={(e) => setImg3(e.target.value)} placeholder="Image URL 3" /> */}

                            <input
                                type="text"
                                name="imageUrl3"
                                value={img3 ||  ""}
                                onChange={(e) => setImg3(e.target.value)}
                                placeholder="Image URL 3"
                            />
                        </label>
                        <label>
                            Image URL 4:
                            {/* <input type="text" name="imageUrl4" value={img4} onChange={(e) => setImg4(e.target.value)} placeholder="Image URL 4" /> */}
                            <input
                                type="text"
                                name="imageUrl4"
                                value={img4 ||  ""}
                                onChange={(e) => setImg4(e.target.value)}
                                placeholder="Image URL 4"
                            />
                        </label>

                    </section>

                    <button className={NewSpotStyles.submitButton} type="submit">Create Spot</button>
                </form>
            </section>





        </div>
    );
}




export default SpotForm 
