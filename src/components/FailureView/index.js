import "./index.css";

const FailureView = (props) => {
  const { onRetry } = props;

  return (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <p className="failure-text">Something went wrong. Please try again</p>
      <button type="button" className="retry-btn" onClick={onRetry}>
        Try Again
      </button>
    </div>
  );
};

export default FailureView;
