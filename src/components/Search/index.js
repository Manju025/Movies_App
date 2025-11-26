import { Component } from "react";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import { TailSpin } from "react-loader-spinner";
import { HiOutlineSearch } from "react-icons/hi";
import FailureView from "../FailureView";
import "./index.css";

const apiStatus = {
  initial: "INITIAL",
  loading: "LOADING",
  success: "SUCCESS",
  failure: "FAILURE",
};

class Search extends Component {
  state = {
    searchInput: "",
    searchResults: [],
    status: apiStatus.initial,
  };

  onClickProfile = () => {
    <Navigate to="/account" />;
  };

  onClickSearch = () => {
    <Navigate to="/search" />;
  };

  onChangeSearchInput = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  onSearch = async () => {
    const { searchInput } = this.state;
    if (searchInput.trim() === "") return;

    this.setState({ status: apiStatus.loading });

    const jwtToken = Cookies.get("jwt_token");
    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`;

    const options = {
      method: "GET",
      headers: { Authorization: `Bearer ${jwtToken}` },
    };

    const response = await fetch(url, options);
    if (response.ok) {
      const data = await response.json();
      const updated = data.results.map((each) => ({
        id: each.id,
        title: each.title,
        posterPath: each.poster_path,
        backdropPath: each.backdrop_path,
      }));

      this.setState({
        searchResults: updated,
        status: apiStatus.success,
      });
    } else {
      this.setState({ status: apiStatus.failure });
    }
  };

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin color="#D81F26" height={50} width={50} />
    </div>
  );

  renderFailure = () => <FailureView onRetry={this.onSearch} />;

  renderNoResults = () => {
    const { searchInput } = this.state;
    return (
      <div className="search-no-results">
        <img
          src="https://assets.ccbp.in/frontend/react-js/movies-no-results.png"
          alt="no movies"
          className="no-movies-img"
        />
        <p className="no-results-text">
          Your search for {searchInput} did not find any matches.
        </p>
      </div>
    );
  };

  renderSuccess = () => {
    const { searchResults } = this.state;

    if (searchResults.length === 0) return this.renderNoResults();

    return (
      <ul className="search-results-list">
        {searchResults.map((movie) => (
          <Link to={`/movies/${movie.id}`} key={movie.id}>
            <li className="search-result-item">
              <img
                src={movie.posterPath}
                alt={movie.title}
                className="search-movie-img"
              />
            </li>
          </Link>
        ))}
      </ul>
    );
  };

  onSearchBtnClick = () => {
    this.onSearch();
  };

  render() {
    const { searchInput, status } = this.state;

    let content;
    if (status === apiStatus.loading) {
      content = this.renderLoader();
    } else if (status === apiStatus.failure) {
      content = this.renderFailure();
    } else if (status === apiStatus.success) {
      content = this.renderSuccess();
    }

    return (
      <>
        <nav className="header search-header">
          <div className="header-left">
            <Link to="/">
              <img
                src="https://i.postimg.cc/dtyBJHq5/Group-7399.png"
                alt="website logo"
                className="header-logo"
              />
            </Link>
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/popular" className="nav-link">
                  Popular
                </Link>
              </li>
            </ul>
          </div>
          <div className="header-right">
            <input
              type="search"
              value={searchInput}
              onChange={this.onChangeSearchInput}
              className="search-input"
              placeholder="Search Movie"
            />
            <button
              type="button"
              data-testid="searchButton"
              onClick={this.onSearchBtnClick}
              className="search-btn"
            >
              <HiOutlineSearch size={20} />
            </button>
            <button
              type="button"
              className="profile-btn"
              onClick={this.onClickProfile}
            >
              <img
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQ4IDI0QzQ4IDEwLjc0NTIgMzcuMjU0OCA3LjU1NDcxZS0wNSAyNCA3LjU4MTI4ZS0wNUMxMC43NDUyIDcuNjA3ODVlLTA1IC0zLjU1MDcyZS0wNiAxMC43NDUyIC0yLjI4NzQyZS0wNiAyNEMtMS4wMjQxMWUtMDYgMzcuMjU0OCAxMC43NDUyIDQ4IDI0IDQ4QzM3LjI1NDggNDggNDggMzcuMjU0OCA0OCAyNFoiIGZpbGw9IndoaXRlIi8+CjxtYXNrIGlkPSJtYXNrMF84ODQxXzYxOTgiIHN0eWxlPSJtYXNrLXR5cGU6YWxwaGEiIG1hc2tVbml0cz0idXNlclNwYWNlT25Vc2UiIHg9IjAiIHk9IjAiIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCI+CjxwYXRoIGQ9Ik00OCAyNEM0OCAxMC43NDUyIDM3LjI1NDggNy41NTQ3MWUtMDUgMjQgNy41ODEyOGUtMDVDMTAuNzQ1MiA3LjYwNzg1ZS0wNSAtMy41NTA3MmUtMDYgMTAuNzQ1MiAtMi4yODc0MmUtMDYgMjRDLTEuMDI0MTFlLTA2IDM3LjI1NDggMTAuNzQ1MiA0OCAyNCA0OEMzNy4yNTQ4IDQ4IDQ4IDM3LjI1NDggNDggMjRaIiBmaWxsPSJ3aGl0ZSIvPgo8L21hc2s+CjxnIG1hc2s9InVybCgjbWFzazBfODg0MV82MTk4KSI+CjxwYXRoIGQ9Ik00NCA0OC4wMDAzSDRDNS44NDM5OCAzOS45MDgzIDEwLjc5NCAzOC4yOTIgMTAuNzk0IDM4LjI5MkwyMC4zMzUxIDMzLjkzMDdMMjMuOTUwMSAzMy44OTg0SDI0LjA0OTVMMjcuNjY4NSAzMy45MzA3TDM3LjIwODkgMzguMjkyQzM3LjIwODkgMzguMjkyIDQyLjE1NTcgMzkuOTA4MyA0NCA0OC4wMDAzWiIgZmlsbD0iIzA1NkY4QyIvPgo8cGF0aCBkPSJNMjYuMjAwOSAxMC42NTc0QzI2LjIwMDkgMTAuNjU3NCAyOS41Mjk5IDkuMjA3OCAzMC43MTAyIDExLjk0OUMzMS44NDYyIDE0LjU4ODQgMjcuMzM0MyAxNy4xMDM4IDI3LjMzNDMgMTcuMTAzOEwyNi4yMDA5IDEwLjY1NzRaIiBmaWxsPSIjMUQwMzAwIi8+CjxwYXRoIGQ9Ik0xOS45NzU2IDIxLjUxOTRDMjAuMDEwOCAyMi43MzgyIDE5LjAyODEgMjMuNzU0NiAxNy43ODE0IDIzLjc4OUMxNi41MzM2IDIzLjgyMzQgMTUuNDk0MSAyMi44NjMzIDE1LjQ1ODkgMjEuNjQ0MUMxNS40MjM3IDIwLjQyNTMgMTYuNDA2NCAxOS40MDkzIDE3LjY1MzEgMTkuMzc0OUMxOC45MDAxIDE5LjM0MDIgMTkuOTQwNCAyMC4zMDA2IDE5Ljk3NTYgMjEuNTE5NFoiIGZpbGw9IiNEQzdFNjgiLz4KPHBhdGggZD0iTTE2LjQ0MzEgMjEuMzU0QzE2LjQ0MzEgMjEuMzU0IDE3LjM0MTUgMjAuOTI2NSAxOC4xOTc2IDIyLjQ1MTciIHN0cm9rZT0iI0MwNTEzQyIgc3Ryb2tlLXdpZHRoPSIwLjI2ODc3NyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI4LjE3MDIgMjEuNTgxOUMyOC4xNzAyIDIyLjgwMTEgMjkuMTgxOCAyMy43ODk4IDMwLjQyOTIgMjMuNzg5OEMzMS42NzcgMjMuNzg5OCAzMi42ODgzIDIyLjgwMTEgMzIuNjg4MyAyMS41ODE5QzMyLjY4ODMgMjAuMzYyNCAzMS42NzcgMTkuMzc0IDMwLjQyOTIgMTkuMzc0QzI5LjE4MTggMTkuMzc0IDI4LjE3MDIgMjAuMzYyNCAyOC4xNzAyIDIxLjU4MTlaIiBmaWxsPSIjREM3RTY4Ii8+CjxwYXRoIGQ9Ik0zMS43NzE0IDIxLjM0NkMzMS43NzE0IDIxLjM0NiAzMC44NjEgMjAuOTQzMiAzMC4wNDk2IDIyLjQ5MTciIHN0cm9rZT0iI0MwNTEzQyIgc3Ryb2tlLXdpZHRoPSIwLjI2ODc3NyIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTI2Ljk0MDYgMjYuNjY0NUMyNi45NDA2IDI2LjY2NDUgMjUuNjY2NyAyNy41NDI4IDI0LjUwNjIgMjcuNzU5NkMyMy4zNDU3IDI3Ljk3NjQgMjIuMjE3MSAyNy4zMTgxIDIyLjIwMjggMjcuMzEwMkMyMi4xODg1IDI3LjMwMiAyMC44NDc2IDI2LjU0ODMgMjAuODQ3NiAyNi41NDgzTDIwLjI5MjUgMzMuODE1N0wyMC40NDI0IDMzLjkzNjVDMjIuNDEwNyAzNS41MjMzIDI1LjI0NzYgMzUuNTQyIDI3LjIzNzYgMzMuOTgxNkwyNy41Mjg3IDMzLjc1MzRMMjYuOTQwNiAyNi42NjQ1WiIgZmlsbD0iI0RDN0U2OCIvPgo8cGF0aCBkPSJNMjAuMjkyNSAyNS44NDg2QzIwLjI5MjUgMjUuODQ4NiAyMS41NTgyIDI5Ljg5ODIgMjQuNDcxIDI5Ljg1MzRDMjYuODY1NCAyOS44MTYxIDI3LjI1MTUgMjUuODQ4NiAyNy4yNTE1IDI1Ljg0ODZIMjAuMjkyNVoiIGZpbGw9IiMxRDAzMDAiLz4KPHBhdGggZD0iTTMwLjE1ODUgMTcuNzUxN0MzMC4xNzEzIDIwLjI0NzQgMjkuODE3NSAyMi40MDMgMjkuNDYxOCAyMy45MzMyQzI5LjExMjcgMjUuNDMxNiAyOC4xMTUgMjYuNDgyMyAyNi43MDE1IDI3LjMzMTNMMjYuNDQ0MSAyNy40ODU3QzI0Ljk0ODggMjguMzgzOCAyMy4wMTEzIDI4LjQxNDMgMjEuNDgzOCAyNy41NjM1QzE5Ljk0MzQgMjYuNzA1MiAxOC44NjE3IDI1LjU2OTIgMTguNTIyOSAyMy45NjUxQzE3LjkwNTUgMjEuMDQ3MyAxNy44MjMgMTcuODEyNiAxNy44MjMgMTcuODEyNkMxNy44MjMgMTcuODEyNiAxNi45NTU4IDExLjA2MiAyMy42MDkgMTEuMTUxM0MzMC4yNjE5IDExLjI0MDkgMzAuMTU4NSAxNy43NTE3IDMwLjE1ODUgMTcuNzUxN1oiIGZpbGw9IiNEQzdFNjgiLz4KPHBhdGggZD0iTTIxLjcyNzcgMTkuNzI1N0MyMS43MjczIDIwLjAxNjMgMjEuNDg2NCAyMC4yNTE3IDIxLjE4ODcgMjAuMjUxN0MyMC44OTE3IDIwLjI1MTcgMjAuNjUwNCAyMC4wMTYzIDIwLjY1MDQgMTkuNzI1N0MyMC42NTA0IDE5LjQzNSAyMC44OTIgMTkuMTk5MiAyMS4xODkgMTkuMTk5MkMyMS40ODY0IDE5LjE5OTIgMjEuNzI3NyAxOS40MzUgMjEuNzI3NyAxOS43MjU3WiIgZmlsbD0iIzFEMDMwMCIvPgo8cGF0aCBkPSJNMjcuMDA5MyAxOS43MjU3QzI3LjAwOTMgMjAuMDE2MyAyNi43Njg0IDIwLjI1MTcgMjYuNDcxIDIwLjI1MTdDMjYuMTczNiAyMC4yNTE3IDI1LjkzMjQgMjAuMDE2MyAyNS45MzI0IDE5LjcyNTdDMjUuOTMyNCAxOS40MzUgMjYuMTczNiAxOS4xOTkyIDI2LjQ3MSAxOS4xOTkyQzI2Ljc2ODQgMTkuMTk5MiAyNy4wMDkzIDE5LjQzNSAyNy4wMDkzIDE5LjcyNTdaIiBmaWxsPSIjMUQwMzAwIi8+CjxwYXRoIGQ9Ik0yMy4zMzYyIDIwLjU5ODZWMjIuMDVIMjQuMjk1NCIgc3Ryb2tlPSIjQzA1MTNDIiBzdHJva2Utd2lkdGg9IjAuMjY4Nzc3IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNMTkuMTI4OSAxNy40NzFMMjIuNjQ2NCAxNy4xNjFDMjIuNjQ2NCAxNy4xNjEgMjIuMzMxNCAxNi4yNzAxIDIwLjkwOTEgMTYuNDE0OEMxOS40NTQxIDE2LjU2MjUgMTkuMTI4OSAxNy40NzEgMTkuMTI4OSAxNy40NzFaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjguMTk2NCAxNy40NzFMMjQuNjc5IDE3LjE2MUMyNC42NzkgMTcuMTYxIDI0Ljk5MzkgMTYuMjcwMSAyNi40MTYyIDE2LjQxNDhDMjcuODcxMiAxNi41NjI1IDI4LjE5NjQgMTcuNDcxIDI4LjE5NjQgMTcuNDcxWiIgZmlsbD0iYmxhY2siLz4KPHBhdGggZD0iTTIyLjA4MjggMjMuMjIzNkgyNS41NTI5QzI1LjU1MjkgMjMuMjIzNiAyNS4zOTAxIDI0LjI2MjUgMjMuNzY2NSAyNC4yNjI1QzIyLjE0MjkgMjQuMjYyNSAyMi4wODI4IDIzLjIyMzYgMjIuMDgyOCAyMy4yMjM2WiIgZmlsbD0id2hpdGUiLz4KPHBhdGggZD0iTTE4LjAzNzggMjEuMDU0M0MxOC4wMzc4IDIxLjA1NDMgMTkuMDIyNiAxMy43NTI4IDE4LjU0MDggMTIuNTQ5OEMxOC41NDA4IDEyLjU0OTggMTUuMTkwMiAxNS4yNTg3IDE4LjAzNzggMjEuMDU0M1oiIGZpbGw9IiMxRDAzMDAiLz4KPHBhdGggZD0iTTI5LjkyMDQgMjEuMDAzQzI5LjkyMDQgMjEuMDAzIDI4LjgxMiAxNC4wMzA2IDI5LjExOTMgMTIuMDI0NEMyOS4xMTkzIDEyLjAyNDQgMzIuMzU0OCAxNC44MjU0IDI5LjkyMDQgMjEuMDAzWiIgZmlsbD0iIzFEMDMwMCIvPgo8cGF0aCBkPSJNMjguOTEzNCAxMS40MjExTDI1Ljg0NTkgMTAuOTY3OEwyNS41NzU2IDEwLjQ0OTJMMjMuOTU2OCAxMC42ODg2TDIyLjMzNzYgMTAuNDQ5MkwyMi4wNjc3IDEwLjk2NzhMMTkuMDAwNSAxMS40MjExTDE4LjU5MTMgMTMuMDI1MkwxOC42OTIxIDE0Ljg3NEMxOC42OTIxIDE0Ljg3NCAxOS4xNzc2IDEyLjc3NjggMjAuODY4IDEzLjE5NDdDMjEuMjY2NSAxMy4yOTMyIDIxLjc0MzYgMTMuNDU2MyAyMi4zMDE2IDEzLjU2NjNDMjIuODIyNyAxMy42NzcgMjMuMzE5MSAxMy43Mjc2IDIzLjc4NzggMTMuNzM1NUMyMy44NDMxIDEzLjczNjkgMjMuOTAwMyAxMy43MzU1IDIzLjk1NjggMTMuNzM1OEMyNC4wMTMzIDEzLjczNTUgMjQuMDcwNSAxMy43MzY5IDI0LjEyNTggMTMuNzM1NUMyNC41OTQ0IDEzLjcyNzYgMjUuMDkwOSAxMy42NzcgMjUuNjEyMyAxMy41NjYzQzI2LjE3IDEzLjQ1NjMgMjYuNjU3NyAxMy4zMjY2IDI3LjA0NTYgMTMuMTk0N0MyOC42MTI4IDEyLjY2MTQgMjkuMTg5OSAxNC43Nzg3IDI5LjE4OTkgMTQuNzc4N0wyOS4zMjIzIDEzLjAyNTJMMjguOTEzNCAxMS40MjExWiIgZmlsbD0iIzFEMDMwMCIvPgo8cGF0aCBkPSJNMjguODQ2MyAxMy4zMjkyQzI4Ljg0NjMgMTMuMzI5MiAyNi44NTEzIDE1LjA2OTEgMjQuMjk1MiAxMy43MzI0QzI0LjI5NTIgMTMuNzMyNCAxNy43OTI3IDE3LjY0NzUgMTUuOTU3MiAxMy4zODUxQzE0LjQyNyA5LjgzMjIzIDIwLjc3ODkgNS4wMTAwMSAyNy4zMzIzIDEwLjQ0MzZMMjguODQ2MyAxMy4zMjkyWiIgZmlsbD0iIzFEMDMwMCIvPgo8cGF0aCBkPSJNMjAuMzY1MSAzMy43ODQ3TDE4LjIzMzYgMzQuNzQxOUMxOC4yMzM2IDM0Ljc0MTkgMTguMjEwMiAzOC4yMzQ1IDI0LjAwMjUgMzguMDUzNkMyOS45NDE0IDM3Ljg2NzkgMjkuOTA2MiAzNC43OTQ5IDI5LjkwNjIgMzQuNzk0OUwyNy42MDEgMzMuNzIyN0wyMC4zNjUxIDMzLjc4NDdaIiBmaWxsPSIjREM3RTY4Ii8+CjwvZz4KPC9zdmc+Cg=="
                alt="profile"
                className="profile-img"
              />
            </button>
          </div>
        </nav>
        <div className="search-bg">
          <div className="search-input-container"></div>

          <div className="search-content">{content}</div>
        </div>
      </>
    );
  }
}

export default Search;
