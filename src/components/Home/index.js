import { Component } from "react";
import { TailSpin } from "react-loader-spinner";
import Cookies from "js-cookie";
import Header from "../Header";
import MoviesSlider from "../MoviesSlider";
import FailureView from "../FailureView";
import Footer from "../Footer";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Home extends Component {
  state = {
    trendingMovies: [],
    originals: [],
    trendingStatus: apiStatusConstants.initial,
    originalsStatus: apiStatusConstants.initial,
  };

  componentDidMount() {
    this.getTrendingMovies();
    this.getOriginals();
    this.getTopRated();
  }

  getTopRated = async () => {
    this.setState({ topRatedStatus: apiStatusConstants.inProgress });

    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/movies-app/top-rated-movies";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.results.map((each) => ({
        id: each.id,
        title: each.title,
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
      }));

      this.setState({
        topRatedMovies: updatedData,
        topRatedStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ topRatedStatus: apiStatusConstants.failure });
    }
  };

  getTrendingMovies = async () => {
    this.setState({ trendingStatus: apiStatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/movies-app/trending-movies";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.results.map((each) => ({
        id: each.id,
        title: each.title,
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
      }));
      this.setState({
        trendingMovies: updatedData,
        trendingStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ trendingStatus: apiStatusConstants.failure });
    }
  };

  getOriginals = async () => {
    this.setState({ originalsStatus: apiStatusConstants.inProgress });
    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/movies-app/originals";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const updatedData = data.results.map((each) => ({
        id: each.id,
        title: each.title,
        backdropPath: each.backdrop_path,
        posterPath: each.poster_path,
        overview: each.overview,
      }));
      this.setState({
        originals: updatedData,
        originalsStatus: apiStatusConstants.success,
      });
    } else {
      this.setState({ originalsStatus: apiStatusConstants.failure });
    }
  };

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin color="#D81F26" height={50} width={50} />
    </div>
  );

  renderFailureView = (retryFn) => <FailureView onRetry={retryFn} />;

  renderTrendingSection = () => {
    const { trendingStatus, trendingMovies } = this.state;
    switch (trendingStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      case apiStatusConstants.success:
        return <MoviesSlider movies={trendingMovies} />;
      case apiStatusConstants.failure:
        return this.renderFailureView(this.getTrendingMovies);
      default:
        return null;
    }
  };

  renderTopRatedSection = () => {
    const { topRatedStatus, topRatedMovies } = this.state;
    switch (topRatedStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      case apiStatusConstants.success:
        return <MoviesSlider movies={topRatedMovies} />;
      case apiStatusConstants.failure:
        return this.renderFailureView(this.getTopRated);
      default:
        return null;
    }
  };

  renderOriginalsSection = () => {
    const { originalsStatus, originals } = this.state;
    switch (originalsStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader();
      case apiStatusConstants.success:
        return <MoviesSlider movies={originals} />;
      case apiStatusConstants.failure:
        return this.renderFailureView(this.getOriginals);
      default:
        return null;
    }
  };

  renderHeroSection = () => {
    const { originals } = this.state;
    if (originals.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * originals.length);
    const movie = originals[randomIndex];

    return (
      <>
        <Header />
        <div
          className="hero-section"
          style={{ backgroundImage: `url(${movie.backdropPath})` }}
        >
          <div className="hero-content">
            <h1 className="hero-title">{movie.title}</h1>
            <p className="hero-overview">{movie.overview}</p>
            <button className="hero-play-btn" type="button">
              Play
            </button>
          </div>
        </div>
      </>
    );
  };

  render() {
    return (
      <>
        <div className="home-bg">
          {this.renderHeroSection()}

          <div className="movies-section">
            <h1 className="section-title">Trending Now</h1>
            {this.renderTrendingSection()}
          </div>

          <div className="movies-section">
            <h1 className="section-title">Originals</h1>
            {this.renderOriginalsSection()}
          </div>

          <div className="movies-section">
            <h1 className="section-title">Top Rated</h1>
            {this.renderTopRatedSection()}
          </div>
        </div>
        <Footer />
      </>
    );
  }
}

export default Home;
