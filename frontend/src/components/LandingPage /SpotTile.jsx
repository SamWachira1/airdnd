import image2 from '../../../public/images/stock2.png'
import image3 from '../../../public/images/stock3.png'
import image4 from '../../../public/images/stock4.png'
import image5 from '../../../public/images/stock5.png'
import image6 from '../../../public/images/stock6.png'
import spotTileStyle from './SpotTile.module.css'
import { Link } from 'react-router-dom';

const SpotTile = ({ spot }) => {

  const imgArr = [image2, image3, image4, image5, image6]

  const spotIndex = spot.id % imgArr.length;

  // Assign the corresponding image to the spot
  spot.previewImage = imgArr[spotIndex];

  const calculateAvgRating = () => {
    if (!spot.reviews || spot.reviews.length === 0) {
      return 'New';
    } else {
      const totalStars = spot.reviews.reduce((acc, review) => acc + review.stars, 0);
      return (totalStars / spot.reviews.length).toFixed(1);
    }
  };

  return (
    <Link to={`/spots/${spot.id}`} >
      <div className="spot-tile">
        <img className={spotTileStyle.imgTile} src={spot.previewImage} alt={spot.name} title={spot.name} />
        <div className="spot-details">
          <p>{spot.city}, {spot.state}</p>
          <p>Rating: {calculateAvgRating()}</p>
          <p>Price: ${spot.price.toFixed(2)} per night</p>

        </div>
      </div>

    </Link>

  );
};

export default SpotTile;
