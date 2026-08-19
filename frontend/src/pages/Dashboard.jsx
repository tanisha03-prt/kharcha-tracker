import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {

  const navigate = useNavigate();

  return (
    <div className="page">

      {/* HEADER */}
      <div className="page-header">

        <div>
          <p className="eyebrow">
            OVERVIEW
          </p>

          <h1>
            Welcome back, Tanisha 👋
          </h1>

          <p className="page-subtitle">
            Here's what's happening with
            your money today.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/transactions")
          }
        >
          + Add Transaction
        </button>

      </div>


      {/* STAT CARDS */}
      <section className="stats-grid">

        <div className="stat-card">

          <div className="stat-top">
            <span className="stat-label">
              TOTAL INCOME
            </span>

            <span className="stat-icon income">
              ↗
            </span>
          </div>

          <h2>
            ₹50,000
          </h2>

          <p className="stat-positive">
            ↑ Money received
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <span className="stat-label">
              TOTAL EXPENSE
            </span>

            <span className="stat-icon expense">
              ↘
            </span>
          </div>

          <h2>
            ₹3,000
          </h2>

          <p className="stat-neutral">
            This month
          </p>

        </div>


        <div className="stat-card">

          <div className="stat-top">
            <span className="stat-label">
              AVAILABLE BALANCE
            </span>

            <span className="stat-icon balance">
              ₹
            </span>
          </div>

          <h2>
            ₹47,000
          </h2>

          <p className="stat-positive">
            Healthy balance
          </p>

        </div>

      </section>


      {/* MAIN DASHBOARD GRID */}
      <section className="dashboard-grid">

        {/* CHART PLACEHOLDER */}
        <div className="dashboard-card chart-card">

          <div className="card-heading">

            <div>
              <p className="eyebrow">
                ANALYTICS
              </p>

              <h2>
                Spending Overview
              </h2>
            </div>

            <span className="card-period">
              This Month
            </span>

          </div>


          <div className="chart-placeholder">

            <div className="chart-line">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="chart-labels">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>

          </div>

        </div>


        {/* QUICK ACTIONS */}
        <div className="dashboard-card">

          <div className="card-heading">

            <div>
              <p className="eyebrow">
                ACTIONS
              </p>

              <h2>
                Quick Actions
              </h2>
            </div>

          </div>


          <div className="quick-actions">

            <button
              onClick={() =>
                navigate("/transactions")
              }
            >
              <span>＋</span>
              <div>
                <strong>
                  Add Transaction
                </strong>
                <small>
                  Record income or expense
                </small>
              </div>
            </button>


            <button
              onClick={() =>
                navigate("/budget")
              }
            >
              <span>₹</span>
              <div>
                <strong>
                  Manage Budget
                </strong>
                <small>
                  Set your monthly limit
                </small>
              </div>
            </button>


            <button
              onClick={() =>
                navigate("/goals")
              }
            >
              <span>◎</span>
              <div>
                <strong>
                  Create Goal
                </strong>
                <small>
                  Start saving for something
                </small>
              </div>
            </button>

          </div>

        </div>

      </section>


      {/* RECENT ACTIVITY */}
      <section className="dashboard-card">

        <div className="card-heading">

          <div>
            <p className="eyebrow">
              ACTIVITY
            </p>

            <h2>
              Recent Transactions
            </h2>
          </div>

          <button
            className="text-btn"
            onClick={() =>
              navigate("/transactions")
            }
          >
            View all →
          </button>

        </div>


        <div className="transaction-preview">

          <div className="transaction-row">

            <div className="transaction-info">

              <div className="transaction-avatar">
                S
              </div>

              <div>
                <strong>
                  Shopping
                </strong>

                <small>
                  Today · Shopping
                </small>
              </div>

            </div>

            <span className="expense-amount">
              -₹3,000
            </span>

          </div>


          <div className="transaction-row">

            <div className="transaction-info">

              <div className="transaction-avatar">
                F
              </div>

              <div>
                <strong>
                  Food
                </strong>

                <small>
                  Yesterday · Food
                </small>
              </div>

            </div>

            <span className="expense-amount">
              -₹500
            </span>

          </div>


          <div className="transaction-row">

            <div className="transaction-info">

              <div className="transaction-avatar income-avatar">
                S
              </div>

              <div>
                <strong>
                  Salary
                </strong>

                <small>
                  15 Aug · Income
                </small>
              </div>

            </div>

            <span className="income-amount">
              +₹50,000
            </span>

          </div>

        </div>

      </section>

    </div>
  );
};

export default Dashboard;