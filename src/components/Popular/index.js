import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import Header from "../Header";
import FailureView from "../FailureView";
import "./index.css";

const apiStatusConstants = {
  initial: "INITIAL",
  inProgress: "IN_PROGRESS",
  success: "SUCCESS",
  failure: "FAILURE",
};

const Popular = () => {
  const [popularList, setPopularList] = useState([]);
  const [status, setStatus] = useState(apiStatusConstants.initial);

  const getPopularMovies = async () => {
    setStatus(apiStatusConstants.inProgress);
    const jwtToken = Cookies.get("jwt_token");
    const url = "https://apis.ccbp.in/movies-app/popular-movies";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    const res = await fetch(url, options);
    if (res.ok) {
      const data = await res.json();
      const updated = data.results.map((each) => ({
        id: each.id,
        title: each.title,
        posterPath: each.poster_path,
        backdropPath: each.backdrop_path,
      }));
      setPopularList(updated);
      setStatus(apiStatusConstants.success);
    } else {
      setStatus(apiStatusConstants.failure);
    }
  };

  useEffect(() => {
    getPopularMovies();
  }, []);

  const renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin color="#D81F26" height={50} width={50} />
    </div>
  );

  const renderFailure = () => <FailureView onRetry={getPopularMovies} />;

  const renderSuccess = () => (
    <ul className="popular-list">
      {popularList.map((movie) => (
        <li key={movie.id} className="popular-item">
          <Link to={`/movies/${movie.id}`}>
            <img
              src={movie.posterPath}
              alt={movie.title}
              className="popular-img"
            />
          </Link>
        </li>
      ))}
    </ul>
  );

  const renderContent = () => {
    switch (status) {
      case apiStatusConstants.inProgress:
        return renderLoader();
      case apiStatusConstants.success:
        return renderSuccess();
      case apiStatusConstants.failure:
        return renderFailure();
      default:
        return null;
    }
  };

  return (
    <>
      <Header />
      <div className="popular-bg">{renderContent()}</div>
    </>
  );
};

export default Popular;
