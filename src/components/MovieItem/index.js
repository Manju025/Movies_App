import { Component } from "react";
import { format } from "date-fns";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { Link, useParams } from "react-router-dom";
import Header from "../Header";
import FailureView from "../FailureView";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

class MovieItem extends Component {
  state = {
    movieDetails: null,
    status: apiStatusConstants.initial,
    joke: "",
  };

  componentDidMount() {
    this.getMovieDetails();
  }

  componentDidUpdate(prevProps) {
    const { id: prevId } = prevProps;
    const { id: currentId } = this.props;

    if (prevId !== currentId) {
      this.getMovieDetails();
    }
  }

  getMovieDetails = async () => {
    this.setState({ status: apiStatusConstants.inProgress });
    const { id } = this.props;

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/movies-app/movies/${id}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const movie = data.movie_details;

      const updated = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        backdropPath: movie.backdrop_path,
        posterPath: movie.poster_path,
        runtime: movie.runtime,
        adult: movie.adult,
        budget: movie.budget,
        releaseDate: movie.release_date,
        genres: movie.genres,
        spokenLanguages: movie.spoken_languages,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        similarMovies: movie.similar_movies.map((each) => ({
          id: each.id,
          title: each.title,
          posterPath: each.poster_path,
          backdropPath: each.backdrop_path,
        })),
      };

      this.setState({
        movieDetails: updated,
        status: apiStatusConstants.success,
      });
    } else {
      this.setState({ status: apiStatusConstants.failure });
    }
  };

  jokes = [
    "Why don’t programmers like nature? Too many bugs!",
    "This movie app is so good, even popcorn wants a subscription.",
    "I told my code a joke… but it didn’t get the runtime error.",
    "Movies are like commits — some are blockbusters, some you regret pushing.",
    "Debugging is like watching a thriller: you never know who the culprit is!",
    "This app has more drama than my JavaScript errors.",
    "Why did the movie developer go broke? Because he kept working for free previews!",
    "My code is like a suspense movie — I never know how it will end.",
    "Why was the JavaScript developer sad? Because he didn’t ‘null’ his feelings.",
    "This app has more twists than a Christopher Nolan film.",
    "Why do developers love horror movies? They’re used to scary stack traces.",
    "Watching movies here is smoother than my CSS transitions.",
    "Why did the movie refuse to play? It had stage fright.",
    "This app is like a rom-com: sometimes cheesy, but always entertaining.",
    "Why did the developer bring popcorn to debugging? Because it was going to be a long show.",
  ];

  onClickPlay = () => {
    const randomIndex = Math.floor(Math.random() * this.jokes.length);
    const newjoke = this.jokes[randomIndex];
    this.setState({ joke: newjoke });
    alert(newjoke);
  };

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin color="#D81F26" height={50} width={50} />
    </div>
  );

  renderFailure = () => <FailureView onRetry={this.getMovieDetails} />;

  renderSuccess = () => {
    const { movieDetails } = this.state;
    const {
      title,
      overview,
      backdropPath,
      runtime,
      adult,
      releaseDate,
      genres,
      spokenLanguages,
      voteAverage,
      voteCount,
      budget,
      similarMovies,
    } = movieDetails;

    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    const runtimeText = `${hours}h ${minutes}m`;
    const censorRating = adult ? "A" : "U/A";

    const formattedDate = format(new Date(releaseDate), "do MMMM yyyy");
    const releaseYear = format(new Date(releaseDate), "yyyy");

    return (
      <div className="movie-details-bg">
        <div
          className="movie-hero"
          style={{ backgroundImage: `url(${backdropPath})` }}
        >
          <Header />
          <div className="movie-hero-overlay">
            <h1 className="movie-title">{title}</h1>
            <div className="movie-meta">
              <p className="runtime">{runtimeText}</p>
              <p className="censor">{censorRating}</p>
              <p className="year">{releaseYear}</p>
            </div>
            <p className="overview">{overview}</p>
            <button
              type="button"
              className="play-btn"
              onClick={this.onClickPlay}
            >
              Play
            </button>
          </div>
        </div>

        <div className="movie-info-section">
          <div className="info-group">
            <h1>Genres</h1>
            <ul>
              {genres.map((each) => (
                <li key={each.id}>{each.name}</li>
              ))}
            </ul>
          </div>

          <div className="info-group">
            <h1>Audio Available</h1>
            <ul>
              {spokenLanguages.map((each) => (
                <li key={each.id}>{each.english_name}</li>
              ))}
            </ul>
          </div>

          <div className="info-group">
            <h1>Rating Count</h1>
            <p>{voteCount}</p>
            <h1>Rating Average</h1>
            <p>{voteAverage}</p>
          </div>

          <div className="info-group">
            <h1>Budget</h1>
            <p>{budget}</p>
            <h1>Release Date</h1>
            <p>{formattedDate}</p>
          </div>
        </div>

        <div className="similar-movies-section">
          <h1 className="section-title">More like this</h1>
          <ul className="similar-movies-list">
            {similarMovies.slice(0, 10).map((movie) => (
              <li className="similar-movie-item" key={movie.id}>
                <Link to={`/movies/${movie.id}`}>
                  <img
                    src={movie.posterPath}
                    alt={movie.title}
                    className="similar-movie-img"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  render() {
    const { status } = this.state;
    switch (status) {
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      case apiStatusConstants.success:
        return this.renderSuccess();
      case apiStatusConstants.failure:
        return this.renderFailure();
      default:
        return null;
    }
  }
}

function MovieItemWrapper(props) {
  const { id } = useParams();
  return <MovieItem {...props} id={id} />;
}

export default MovieItemWrapper;
