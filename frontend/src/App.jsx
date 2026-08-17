import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const API_URL = "http://localhost:5001/api";

function App() {
  // =========================================================
  // AUTH
  // =========================================================

  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState(
    localStorage.getItem("token") || ""
  );

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    try {
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================================================
  // TRANSACTION FORM
  // =========================================================

  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");

  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =========================================================
  // TRANSACTIONS
  // =========================================================

  const [transactions, setTransactions] = useState([]);

  const [editingTransactionId, setEditingTransactionId] =
    useState(null);

  const [isEditingTransaction, setIsEditingTransaction] =
    useState(false);

  // =========================================================
  // SEARCH / FILTER
  // =========================================================

  const [searchTerm, setSearchTerm] = useState("");

  const [transactionFilter, setTransactionFilter] =
    useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("all");

  // =========================================================
  // SUMMARY
  // =========================================================

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });

  // =========================================================
  // CATEGORY SUMMARY
  // =========================================================

  const [categorySummary, setCategorySummary] = useState([]);

  // =========================================================
  // MONTHLY ANALYTICS
  // =========================================================

  const [monthlySummary, setMonthlySummary] = useState([]);

  // =========================================================
  // BUDGET
  // =========================================================

  const currentDate = new Date();

  const [budgetMonth, setBudgetMonth] = useState(
    currentDate.getMonth() + 1
  );

  const [budgetYear, setBudgetYear] = useState(
    currentDate.getFullYear()
  );

  const [budgetAmount, setBudgetAmount] = useState("");

  const [currentBudget, setCurrentBudget] =
    useState(null);

  const [budgetMessage, setBudgetMessage] =
    useState("");

  // =========================================================
  // AUTH HEADERS
  // =========================================================

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // =========================================================
  // SIGNUP
  // =========================================================

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      setMessage("Signup successful!");

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      setMessage("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage(
        "Please enter email and password"
      );

      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setToken(data.token);
      setUser(data.user);

      setMessage("Login successful!");

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);

      setMessage("Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken("");
    setUser(null);

    setTransactions([]);
    setCategorySummary([]);
    setMonthlySummary([]);
    setCurrentBudget(null);

    setSummary({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    });

    setMessage("");
    setBudgetMessage("");
  };

  // =========================================================
  // FETCH TRANSACTIONS
  // =========================================================

  const fetchTransactions = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/transactions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setTransactions(data);
    } catch (error) {
      console.error(
        "Fetch transactions error:",
        error
      );
    }
  };

  // =========================================================
  // FETCH SUMMARY
  // =========================================================

  const fetchSummary = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/transactions/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        balance: data.balance || 0,
      });
    } catch (error) {
      console.error("Summary error:", error);
    }
  };

  // =========================================================
  // FETCH CATEGORY SUMMARY
  // =========================================================

  const fetchCategorySummary = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/transactions/category-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setCategorySummary(data);
    } catch (error) {
      console.error(
        "Category summary error:",
        error
      );
    }
  };

  // =========================================================
  // FETCH MONTHLY SUMMARY
  // =========================================================

  const fetchMonthlySummary = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/transactions/monthly-summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        return;
      }

      setMonthlySummary(data);
    } catch (error) {
      console.error(
        "Monthly summary error:",
        error
      );
    }
  };

  // =========================================================
  // FETCH BUDGET
  // =========================================================

  const fetchBudget = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/budget?month=${budgetMonth}&year=${budgetYear}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setCurrentBudget(null);
        return;
      }

      setCurrentBudget(data);
    } catch (error) {
      console.error("Budget error:", error);
    }
  };

  // =========================================================
  // REFRESH DASHBOARD
  // =========================================================

  const refreshDashboard = async () => {
    await Promise.all([
      fetchTransactions(),
      fetchSummary(),
      fetchCategorySummary(),
      fetchMonthlySummary(),
      fetchBudget(),
    ]);
  };

  // =========================================================
  // ADD TRANSACTION
  // =========================================================

  const handleAddTransaction = async () => {
    if (
      !amount ||
      !category ||
      !description ||
      !date
    ) {
      setMessage(
        "Please fill all transaction fields"
      );

      return;
    }

    if (Number(amount) < 0) {
      setMessage("Amount cannot be negative");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/transactions/add`,
        {
          method: "POST",
          headers: authHeaders,

          body: JSON.stringify({
            amount: Number(amount),
            type,
            category,
            description,
            date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Failed to add transaction"
        );

        return;
      }

      setMessage(
        "Transaction added successfully!"
      );

      setAmount("");
      setDescription("");

      await refreshDashboard();
    } catch (error) {
      console.error(error);

      setMessage(
        "Failed to connect to backend"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // EDIT TRANSACTION
  // =========================================================

  const handleEditTransaction = (
    transaction
  ) => {
    setEditingTransactionId(
      transaction._id
    );

    setIsEditingTransaction(true);

    setAmount(transaction.amount);
    setType(transaction.type);
    setCategory(transaction.category);

    setDescription(
      transaction.description || ""
    );

    if (transaction.date) {
      setDate(
        new Date(transaction.date)
          .toISOString()
          .split("T")[0]
      );
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // UPDATE TRANSACTION
  // =========================================================

  const handleUpdateTransaction =
    async () => {
      if (!editingTransactionId) return;

      if (
        !amount ||
        !category ||
        !description ||
        !date
      ) {
        setMessage(
          "Please fill all transaction fields"
        );

        return;
      }

      if (Number(amount) < 0) {
        setMessage("Amount cannot be negative");
        return;
      }

      try {
        setLoading(true);
        setMessage("");

        const response = await fetch(
          `${API_URL}/transactions/${editingTransactionId}`,
          {
            method: "PUT",
            headers: authHeaders,

            body: JSON.stringify({
              amount: Number(amount),
              type,
              category,
              description,
              date,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message ||
              "Failed to update transaction"
          );

          return;
        }

        setMessage(
          "Transaction updated successfully!"
        );

        setEditingTransactionId(null);
        setIsEditingTransaction(false);

        setAmount("");
        setDescription("");

        await refreshDashboard();
      } catch (error) {
        console.error(error);

        setMessage(
          "Failed to update transaction"
        );
      } finally {
        setLoading(false);
      }
    };

  // =========================================================
  // CANCEL EDIT
  // =========================================================

  const handleCancelEdit = () => {
    setEditingTransactionId(null);
    setIsEditingTransaction(false);

    setAmount("");
    setType("expense");
    setCategory("Food");
    setDescription("");

    setDate(
      new Date()
        .toISOString()
        .split("T")[0]
    );

    setMessage("");
  };

  // =========================================================
  // DELETE TRANSACTION
  // =========================================================

  const handleDeleteTransaction =
    async (id) => {
      try {
        const response = await fetch(
          `${API_URL}/transactions/${id}`,
          {
            method: "DELETE",

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(
            data.message || "Failed to delete"
          );

          return;
        }

        setMessage(
          "Transaction deleted successfully!"
        );

        await refreshDashboard();
      } catch (error) {
        console.error(error);

        setMessage("Delete failed");
      }
    };

  // =========================================================
  // SAVE BUDGET
  // =========================================================

  const handleSaveBudget = async () => {
    setBudgetMessage("");

    if (!budgetAmount) {
      setBudgetMessage(
        "Please enter budget amount"
      );

      return;
    }

    if (Number(budgetAmount) <= 0) {
      setBudgetMessage(
        "Budget must be greater than ₹0"
      );

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/budget`,
        {
          method: "POST",

          headers: authHeaders,

          body: JSON.stringify({
            month: Number(budgetMonth),
            year: Number(budgetYear),
            amount: Number(budgetAmount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setBudgetMessage(
          data.message ||
            "Failed to save budget"
        );

        return;
      }

      setCurrentBudget(data.budget);

      setBudgetAmount("");

      setBudgetMessage(
        "Budget saved successfully!"
      );
    } catch (error) {
      console.error(error);

      setBudgetMessage(
        "Failed to save budget"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FILTERED TRANSACTIONS
  // =========================================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter(
      (transaction) => {
        const search =
          searchTerm
            .toLowerCase()
            .trim();

        const matchesSearch =
          !search ||
          transaction.description
            ?.toLowerCase()
            .includes(search) ||
          transaction.category
            ?.toLowerCase()
            .includes(search);

        const matchesType =
          transactionFilter === "all" ||
          transaction.type ===
            transactionFilter;

        const matchesCategory =
          categoryFilter === "all" ||
          transaction.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesType &&
          matchesCategory
        );
      }
    );
  }, [
    transactions,
    searchTerm,
    transactionFilter,
    categoryFilter,
  ]);

  // =========================================================
  // CHART DATA
  // =========================================================

  const chartData = useMemo(() => {
    return monthlySummary
      .map((item) => ({
        month: item._id.month,

        income:
          item.totalIncome || 0,

        expense:
          item.totalExpense || 0,
      }))
      .sort(
        (a, b) =>
          a.month - b.month
      );
  }, [monthlySummary]);

  // =========================================================
  // SMART BUDGET STATUS
  // =========================================================

  const budgetPercentage = Math.max(
    0,
    Number(currentBudget?.percentage || 0)
  );

  const budgetProgress = Math.min(
    budgetPercentage,
    100
  );

  const isBudgetExceeded =
    budgetPercentage >= 100;

  const isBudgetWarning =
    budgetPercentage >= 80 &&
    budgetPercentage < 100;

  const isBudgetSafe =
    budgetPercentage < 80;

  const budgetStatus = isBudgetExceeded
    ? {
        title: "OVER BUDGET",
        text: "You have exceeded your monthly spending limit.",
        className: "danger",
        icon: "!",
      }
    : isBudgetWarning
    ? {
        title: "BUDGET WARNING",
        text: "You are getting close to your monthly limit.",
        className: "warning",
        icon: "!",
      }
    : {
        title: "BUDGET ON TRACK",
        text: "Your spending is within the planned limit.",
        className: "safe",
        icon: "✓",
      };

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  useEffect(() => {
    if (token) {
      refreshDashboard();
    }
  }, [token]);

  // =========================================================
  // FETCH BUDGET WHEN MONTH/YEAR CHANGES
  // =========================================================

  useEffect(() => {
    if (token) {
      fetchBudget();
    }
  }, [budgetMonth, budgetYear]);

  // =========================================================
  // LOGIN / SIGNUP SCREEN
  // =========================================================

  if (!token) {
    return (
      <div className="app-container">

        <div className="auth-container">

          <div className="auth-logo">
            ₹
          </div>

          <h1>
            Kharcha Tracker
          </h1>

          <h2>
            {isLogin
              ? "Welcome back!"
              : "Create your account"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />

          <button
            className="primary-button"
            onClick={
              isLogin
                ? handleLogin
                : handleSignup
            }
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Sign Up"}
          </button>

          {message && (
            <div className="global-message">
              {message}
            </div>
          )}

          <p className="auth-switch">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}

            <button
              className="link-button"
              onClick={() => {
                setIsLogin(!isLogin);
                setMessage("");
              }}
            >
              {isLogin
                ? "Sign Up"
                : "Login"}
            </button>
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (
    <div className="app-container">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>

          <h1>
            Kharcha Tracker
          </h1>

          <p>
            Welcome,{" "}
            {user?.name || "User"} 👋
          </p>

        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>

      {/* GLOBAL MESSAGE */}

      {message && (
        <div className="global-message dashboard-message">
          {message}
        </div>
      )}

      {/* TRANSACTION FORM */}

      <div className="transaction-form">

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          min="0"
        />

        <select
          value={type}
          onChange={(e) =>
            setType(e.target.value)
          }
        >
          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Shopping">Shopping</option>
          <option value="Bills">Bills</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Health">Health</option>
          <option value="Salary">Salary</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
        />

        <div className="transaction-buttons">

          <button
            className="primary-button"
            onClick={
              isEditingTransaction
                ? handleUpdateTransaction
                : handleAddTransaction
            }
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isEditingTransaction
              ? "Update Transaction"
              : "Add Transaction"}
          </button>

          {isEditingTransaction && (
            <button
              className="secondary-button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* SUMMARY */}

      <div className="summary-container">

        <div className="summary-card income-card">

          <div className="summary-card-top">

            <div className="summary-icon">
              ↗
            </div>

            <span className="summary-status">
              MONEY IN
            </span>

          </div>

          <div className="summary-card-content">

            <h3>
              TOTAL INCOME
            </h3>

            <p>
              ₹{summary.totalIncome}
            </p>

          </div>

          <div className="summary-glow-line" />

        </div>

        <div className="summary-card expense-card">

          <div className="summary-card-top">

            <div className="summary-icon">
              ↘
            </div>

            <span className="summary-status">
              MONEY OUT
            </span>

          </div>

          <div className="summary-card-content">

            <h3>
              TOTAL EXPENSE
            </h3>

            <p>
              ₹{summary.totalExpense}
            </p>

          </div>

          <div className="summary-glow-line" />

        </div>

        <div className="summary-card balance-card">

          <div className="summary-card-top">

            <div className="summary-icon">
              ₹
            </div>

            <span className="summary-status">
              AVAILABLE
            </span>

          </div>

          <div className="summary-card-content">

            <h3>
              BALANCE
            </h3>

            <p>
              ₹{summary.balance}
            </p>

          </div>

          <div className="summary-glow-line" />

        </div>

      </div>

      {/* ANALYTICS */}

      <div className="analytics-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              ANALYTICS
            </span>

            <h2>
              Monthly Spending
            </h2>

          </div>

          <span className="analytics-label">
            Income vs Expense
          </span>

        </div>

        {chartData.length === 0 ? (

          <div className="empty-state">
            No monthly data available.
          </div>

        ) : (

          <div
            className="chart-container"
            style={{
              height: "180px",
              minHeight: "180px",
              maxHeight: "180px",
              overflow: "hidden",
            }}
          >

            <ResponsiveContainer
              width="100%"
              height={180}
              minHeight={180}
            >

              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 8,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  opacity={0.2}
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 10 }}
                />

                <YAxis
                  width={40}
                  tick={{ fontSize: 10 }}
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${value}`
                  }
                  labelFormatter={(label) =>
                    `Month ${label}`
                  }
                  contentStyle={{
                    background: "#0b0b0b",
                    border:
                      "1px solid #d9ae27",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: "10px",
                  }}
                />

                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#e0b92f"
                  maxBarSize={28}
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#8f7422"
                  maxBarSize={28}
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>
        )}

      </div>

      {/* CATEGORY + BUDGET */}

      <div className="dashboard-grid">

        {/* CATEGORY */}

        <div className="section">

          <div className="section-heading">

            <div>

              <span className="section-label">
                ANALYTICS
              </span>

              <h2>
                Expense by Category
              </h2>

            </div>

          </div>

          {categorySummary.length === 0 ? (

            <div className="empty-state">
              No expenses found.
            </div>

          ) : (

            <div className="category-list">

              {categorySummary.map(
                (item) => (

                  <div
                    className="category-item"
                    key={item._id}
                  >

                    <span>
                      {item._id}
                    </span>

                    <strong>
                      ₹{item.total}
                    </strong>

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* SMART BUDGET */}

        <div
          className={`section budget-section budget-${budgetStatus.className}`}
        >

          <div className="section-heading">

            <div>

              <span className="section-label">
                PLANNING
              </span>

              <h2>
                Monthly Budget
              </h2>

            </div>

            {currentBudget && (
              <div
                className={`budget-mini-status ${budgetStatus.className}`}
              >
                {budgetStatus.icon}{" "}
                {budgetStatus.title}
              </div>
            )}

          </div>

          <div className="budget-form">

            <select
              value={budgetMonth}
              onChange={(e) =>
                setBudgetMonth(
                  Number(e.target.value)
                )
              }
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>

            <input
              type="number"
              placeholder="Budget amount"
              value={budgetAmount}
              onChange={(e) =>
                setBudgetAmount(
                  e.target.value
                )
              }
              min="0"
            />

            <button
              className="primary-button"
              onClick={handleSaveBudget}
              disabled={loading}
            >
              Save Budget
            </button>

          </div>

          {budgetMessage && (

            <div
              className={
                budgetMessage.includes(
                  "successfully"
                )
                  ? "budget-message success"
                  : "budget-message error"
              }
            >
              {budgetMessage}
            </div>

          )}

          {currentBudget && (

            <div className="budget-display">

              {/* STATUS */}

              <div
                className={`budget-status-card ${budgetStatus.className}`}
              >

                <div className="budget-status-icon">
                  {budgetStatus.icon}
                </div>

                <div>

                  <strong>
                    {budgetStatus.title}
                  </strong>

                  <span>
                    {budgetStatus.text}
                  </span>

                </div>

              </div>

              {/* TOP */}

              <div className="budget-top">

                <div>

                  <span className="budget-label">
                    MONTHLY BUDGET
                  </span>

                  <strong>
                    ₹{currentBudget.amount}
                  </strong>

                </div>

                <div
                  className={`budget-percentage ${budgetStatus.className}`}
                >
                  {budgetPercentage}%
                </div>

              </div>

              {/* PROGRESS */}

              <div className="budget-progress">

                <div
                  className={`budget-progress-fill ${budgetStatus.className}`}
                  style={{
                    width: `${budgetProgress}%`,
                  }}
                />

              </div>

              {/* SCALE */}

              <div className="budget-scale">

                <span>
                  ₹0
                </span>

                <span>
                  ₹{currentBudget.amount}
                </span>

              </div>

              {/* STATS */}

              <div className="budget-stats">

                <div className="budget-stat">

                  <span>
                    SPENT
                  </span>

                  <strong>
                    ₹{currentBudget.spent}
                  </strong>

                </div>

                <div className="budget-stat">

                  <span>
                    {isBudgetExceeded
                      ? "OVER BY"
                      : "REMAINING"}
                  </span>

                  <strong
                    className={
                      isBudgetExceeded
                        ? "over-budget-value"
                        : "remaining-value"
                    }
                  >
                    ₹
                    {isBudgetExceeded
                      ? Math.abs(
                          currentBudget.remaining
                        )
                      : currentBudget.remaining}
                  </strong>

                </div>

              </div>

              {/* WARNING */}

              {isBudgetExceeded && (

                <div className="budget-warning danger-warning">
                  ⚠ You have exceeded your
                  monthly budget.
                </div>

              )}

              {isBudgetWarning && (

                <div className="budget-warning soft-warning">
                  ⚠ You have used more than
                  80% of your budget.
                </div>

              )}

              {isBudgetSafe && (

                <div className="budget-success">
                  ✓ You are safely within
                  your monthly budget.
                </div>

              )}

              <small className="budget-date">
                {currentBudget.month}/
                {currentBudget.year}
              </small>

            </div>

          )}

        </div>

      </div>

      {/* RECENT TRANSACTIONS */}

      <div className="section transactions-section">

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

        <input
          className="search-input"
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

        <div className="filters">

          <button
            className={
              transactionFilter === "all"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setTransactionFilter("all")
            }
          >
            All
          </button>

          <button
            className={
              transactionFilter === "income"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setTransactionFilter(
                "income"
              )
            }
          >
            Income
          </button>

          <button
            className={
              transactionFilter === "expense"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setTransactionFilter(
                "expense"
              )
            }
          >
            Expense
          </button>

          <select
            className="category-filter"
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
          >
            <option value="all">
              All Categories
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Shopping">
              Shopping
            </option>

            <option value="Bills">
              Bills
            </option>

            <option value="Education">
              Education
            </option>

            <option value="Entertainment">
              Entertainment
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Salary">
              Salary
            </option>

            <option value="Other">
              Other
            </option>
          </select>

        </div>

        <div className="transaction-count">

          Showing{" "}

          <strong>
            {filteredTransactions.length}
          </strong>{" "}

          of{" "}

          <strong>
            {transactions.length}
          </strong>{" "}

          transactions

        </div>

        {filteredTransactions.length ===
        0 ? (

          <div className="empty-state">
            No transactions found.
          </div>

        ) : (

          <div className="transactions-list">

            {filteredTransactions.map(
              (transaction) => (

                <div
                  className="transaction-item"
                  key={transaction._id}
                >

                  <div className="transaction-info">

                    <strong>
                      {transaction.description}
                    </strong>

                    <p>
                      {transaction.category}
                    </p>

                    <small>
                      {transaction.date
                        ? new Date(
                            transaction.date
                          ).toLocaleDateString()
                        : ""}
                    </small>

                  </div>

                  <div className="transaction-right">

                    <span
                      className={
                        transaction.type ===
                        "income"
                          ? "income"
                          : "expense"
                      }
                    >

                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}

                      ₹{transaction.amount}

                    </span>

                    <div className="transaction-actions">

                      <button
                        className="edit-button"
                        onClick={() =>
                          handleEditTransaction(
                            transaction
                          )
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          handleDeleteTransaction(
                            transaction._id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default App;