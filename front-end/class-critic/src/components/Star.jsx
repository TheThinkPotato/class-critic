import Star from "react-star-ratings";

const StarRatings = (props) => {
  const rating = props.score;
  const width = props.width || "45";

  return (
    <div className="flex-col self-center">
      <Star    
        starDimension={width}
        rating={Number(rating)}
        starEmptyColor="#d7d8d8"
        starRatedColor="#229df9"
        numberOfStars={5}
        name="rating"
      />
    </div>
  );
};

export default StarRatings;
