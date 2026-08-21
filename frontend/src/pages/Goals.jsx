import React from "react";

const Goals = () => {
  return (
    <div className="page">

      <div className="page-header">
        <div>
          <p className="eyebrow">
            FUTURE
          </p>

          <h1>
            Financial Goals
          </h1>

          <p className="page-subtitle">
            Save money and achieve your goals.
          </p>
        </div>

        <button className="primary-btn">
          + Create Goal
        </button>
      </div>

      <div className="coming-card">
        <span>◎</span>
        <h2>
          Goals
        </h2>
        <p>
          Your savings goals will appear here.
        </p>
      </div>

    </div>
  );
};

export default Goals;