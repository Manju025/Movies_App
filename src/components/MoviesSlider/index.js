import Slider from "react-slick";
import { Link } from "react-router-dom";
import "./index.css";

const MoviesSlider = (props) => {
  const { movies } = props;
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1025,
        settings: { slidesToShow: 5 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 376,
        settings: { slidesToShow: 2 },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {movies.map((movie) => (
        <Link to={`/movies/${movie.id}`} key={movie.id}>
          <div className="movie-item" data-testid="movieItem">
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="movie-img"
            />
          </div>
        </Link>
      ))}
    </Slider>
  );
};

export default MoviesSlider;
