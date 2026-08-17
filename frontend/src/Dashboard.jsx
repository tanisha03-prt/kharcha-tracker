import { useEffect, useState } from "react";
import AddTransaction from "./AddTransaction";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // ==========================================
  // FETCH DASHBOARD DATA
  // ==========================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // --------------------------------------
      // SUMMARY
      // --------------------------------------

      const summaryResponse = await fetch(
        "http://localhost:5001/api/transactions/summary",
        {
          headers,
        }
      );

      const summaryData = await summaryResponse.json();

      if (!summaryResponse.ok) {
        throw new Error(
          summaryData.message || "Failed to fetch summary"
        );
      }

      setSummary(summaryData);

      // --------------------------------------
      // CATEGORY SUMMARY
      // --------------------------------------

      const categoryResponse = await fetch(
        "http://localhost:5001/api/transactions/category-summary",
        {
          headers,
        }
      );

      const categoryData = await categoryResponse.json();

      if (!categoryResponse.ok) {
        throw new Error(
          categoryData.message ||
            "Failed to fetch category summary"
        );
      }

      setCategories(categoryData);

      // --------------------------------------
      // TRANSACTIONS
      // --------------------------------------

      const transactionResponse = await fetch(
        "http://localhost:5001/api/transactions",
        {
          headers,
        }
      );

      const transactionData =
        await transactionResponse.json();

      if (!transactionResponse.ok) {
        throw new Error(
          transactionData.message ||
            "Failed to fetch transactions"
        );
      }

      setTransactions(transactionData);

    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD DASHBOARD
  // ==========================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="dashboard-container">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="dashboard-container">
        <h2>Something went wrong</h2>

        <p>{error}</p>

        <button onClick={fetchDashboardData}>
          Try Again
        </button>
      </div>
    );
  }

  // ==========================================
  // CHART COLORS
  // ==========================================

  const chartColors = [
    "#D4AF37",
    "#F2D36B",
    "#A88A2A",
    "#E6C65C",
    "#806B25",
    "#BFA64B",
    "#62531F",
    "#F7E7A8",
    "#927B2D",
  ];

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="dashboard-container">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>
          <h1>Kharcha Tracker</h1>

          <p>
            Manage your money smartly 💰
          </p>
        </div>

        <button onClick={logout}>
          Logout
        </button>

      </div>


      {/* ======================================
          ADD TRANSACTION
      ====================================== */}

      <AddTransaction
        onTransactionAdded={fetchDashboardData}
      />


      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="summary-grid">

        <div className="summary-card">
          <h3>Total Income</h3>

          <h2>
            ₹{summary.totalIncome}
          </h2>
        </div>


        <div className="summary-card">
          <h3>Total Expense</h3>

          <h2>
            ₹{summary.totalExpense}
          </h2>
        </div>


        <div className="summary-card">
          <h3>Balance</h3>

          <h2>
            ₹{summary.balance}
          </h2>
        </div>

      </div>


      {/* ======================================
          CATEGORY ANALYTICS
      ====================================== */}

      <div className="dashboard-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              ANALYTICS
            </span>

            <h2>
              Expense by Category
            </h2>
          </div>

          <span className="total-spent">
            ₹{summary.totalExpense} spent
          </span>

        </div>


        {categories.length === 0 ? (

          <div className="empty-state">
            <p>No expenses found.</p>
          </div>

        ) : (

          <div className="category-analytics">

            {/* ==================================
                DONUT CHART
            ================================== */}

            <div className="chart-container">

              <ResponsiveContainer
                width="100%"
                height={280}
              >

                <PieChart>

                  <Pie
                    data={categories}
                    dataKey="total"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    stroke="none"
                  >

                    {categories.map(
                      (category, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            chartColors[
                              index %
                                chartColors.length
                            ]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${value}`
                    }
                    contentStyle={{
                      background: "#11110f",
                      border:
                        "1px solid rgba(212,175,55,0.3)",
                      borderRadius: "8px",
                      color: "#f2d36b",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>


              {/* Center text */}

              <div className="chart-center">

                <span>
                  TOTAL
                </span>

                <strong>
                  ₹{summary.totalExpense}
                </strong>

              </div>

            </div>


            {/* ==================================
                CATEGORY LIST
            ================================== */}

            <div className="category-list">

              {categories.map(
                (category, index) => (

                  <div
                    className="category-card"
                    key={category._id}
                  >

                    <div className="category-name">

                      <span
                        className="category-dot"
                        style={{
                          background:
                            chartColors[
                              index %
                                chartColors.length
                            ],
                        }}
                      ></span>

                      <span>
                        {category._id}
                      </span>

                    </div>

                    <strong>
                      ₹{category.total}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        )}

      </div>


      {/* ======================================
          RECENT TRANSACTIONS
      ====================================== */}

      <div className="dashboard-section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              ACTIVITY
            </span>

            <h2>
              Recent Transactions
            </h2>
          </div>

        </div>


        {transactions.length === 0 ? (

          <div className="empty-state">
            <p>
              No transactions found.
            </p>
          </div>

        ) : (

          <div className="transaction-list">

            {transactions.map(
              (transaction) => (

                <div
                  className="transaction-card"
                  key={transaction._id}
                >

                  <div>

                    <h3>
                      {transaction.description ||
                        transaction.category}
                    </h3>

                    <p>
                      {transaction.category}
                      {" • "}
                      {new Date(
                        transaction.date
                      ).toLocaleDateString()}
                    </p>

                  </div>


                  <strong
                    className={
                      transaction.type ===
                      "income"
                        ? "income-amount"
                        : "expense-amount"
                    }
                  >

                    {transaction.type === "income"
                      ? "+"
                      : "-"}

                    ₹{transaction.amount}

                  </strong>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;