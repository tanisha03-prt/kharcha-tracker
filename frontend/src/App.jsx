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

  const [categorySummary, setCategorySummary] = useState([]);
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
  const [currentBudget, setCurrentBudget] = useState(null);
  const [budgetMessage, setBudgetMessage] = useState("");

  // =========================================================
  // FINANCIAL GOALS
  // =========================================================

  const [goals, setGoals] = useState([]);

  const [goalName, setGoalName] = useState("");
  const [goalTargetAmount, setGoalTargetAmount] =
    useState("");
  const [goalSavedAmount, setGoalSavedAmount] =
    useState("");
  const [goalTargetDate, setGoalTargetDate] =
    useState("");

  const [goalMessage, setGoalMessage] = useState("");

  const [updatingGoalId, setUpdatingGoalId] =
    useState(null);

  const [goalUpdateAmount, setGoalUpdateAmount] =
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
      setMessage("Please enter email and password");
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
    setGoals([]);

    setSummary({
      totalIncome: 0,
      totalExpense: 0,
      balance: 0,
    });

    setMessage("");
    setBudgetMessage("");
    setGoalMessage("");
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
      console.error("Fetch transactions error:", error);
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
  // FETCH GOALS
  // =========================================================

  const fetchGoals = async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `${API_URL}/goals`,
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

      setGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Goals error:", error);
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
      fetchGoals(),
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

    setMessage("Editing transaction...");
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
    setDescription("");

    setType("expense");
    setCategory("Food");

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
      const confirmed = window.confirm(
        "Are you sure you want to delete this transaction?"
      );

      if (!confirmed) return;

      try {
        setLoading(true);
        setMessage("");

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
            data.message ||
              "Failed to delete"
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
      } finally {
        setLoading(false);
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
  // CREATE GOAL
  // =========================================================

  const handleCreateGoal = async () => {
    setGoalMessage("");

    if (
      !goalName ||
      !goalTargetAmount ||
      !goalTargetDate
    ) {
      setGoalMessage(
        "Please fill all goal fields"
      );
      return;
    }

    if (Number(goalTargetAmount) <= 0) {
      setGoalMessage(
        "Target amount must be greater than 0"
      );
      return;
    }

    if (Number(goalSavedAmount || 0) < 0) {
      setGoalMessage(
        "Saved amount cannot be negative"
      );
      return;
    }

    if (
      Number(goalSavedAmount || 0) >
      Number(goalTargetAmount)
    ) {
      setGoalMessage(
        "Saved amount cannot exceed target amount"
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/goals`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            name: goalName,
            targetAmount:
              Number(goalTargetAmount),
            savedAmount:
              Number(goalSavedAmount || 0),
            targetDate: goalTargetDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGoalMessage(
          data.message ||
            "Failed to create goal"
        );
        return;
      }

      setGoalMessage(
        "Goal created successfully!"
      );

      setGoalName("");
      setGoalTargetAmount("");
      setGoalSavedAmount("");
      setGoalTargetDate("");

      await fetchGoals();
    } catch (error) {
      console.error(error);

      setGoalMessage(
        "Failed to create goal"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE GOAL PROGRESS
  // =========================================================

  const handleUpdateGoal = async (
    goalId
  ) => {
    if (goalUpdateAmount === "") {
      return;
    }

    const amountValue =
      Number(goalUpdateAmount);

    if (amountValue < 0) {
      setGoalMessage(
        "Saved amount cannot be negative"
      );
      return;
    }

    try {
      setLoading(true);
      setGoalMessage("");

      const response = await fetch(
        `${API_URL}/goals/${goalId}`,
        {
          method: "PUT",
          headers: authHeaders,
          body: JSON.stringify({
            savedAmount: amountValue,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGoalMessage(
          data.message ||
            "Failed to update goal"
        );
        return;
      }

      setUpdatingGoalId(null);
      setGoalUpdateAmount("");

      if (data.completed) {
        setGoalMessage(
          "🎉 Goal achieved! Amazing work!"
        );
      } else {
        setGoalMessage(
          "Goal progress updated!"
        );
      }

      await fetchGoals();
    } catch (error) {
      console.error(error);

      setGoalMessage(
        "Failed to update goal"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE GOAL
  // =========================================================

  const handleDeleteGoal = async (
    goalId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this goal?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setGoalMessage("");

      const response = await fetch(
        `${API_URL}/goals/${goalId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGoalMessage(
          data.message ||
            "Failed to delete goal"
        );
        return;
      }

      setGoalMessage(
        "Goal deleted successfully!"
      );

      await fetchGoals();
    } catch (error) {
      console.error(error);

      setGoalMessage(
        "Failed to delete goal"
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
          searchTerm.toLowerCase().trim();

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
  // SMART INSIGHTS
  // =========================================================

  const highestSpendingCategory =
    useMemo(() => {
      if (categorySummary.length === 0) {
        return null;
      }

      return [...categorySummary].sort(
        (a, b) =>
          Number(b.total || 0) -
          Number(a.total || 0)
      )[0];
    }, [categorySummary]);

  const savings = Math.max(
    0,
    Number(summary.totalIncome || 0) -
      Number(summary.totalExpense || 0)
  );

  const savingsRate =
    Number(summary.totalIncome || 0) > 0
      ? Math.round(
          (savings /
            Number(summary.totalIncome)) *
            100
        )
      : 0;

  const expenseShare =
    Number(summary.totalIncome || 0) > 0
      ? Math.round(
          (Number(summary.totalExpense) /
            Number(summary.totalIncome)) *
            100
        )
      : 0;

  const smartInsight = useMemo(() => {
    if (transactions.length === 0) {
      return {
        title: "START TRACKING",
        text:
          "Add your first transaction to unlock personalized spending insights.",
        className: "insight-neutral",
        icon: "✦",
      };
    }

    if (
      currentBudget &&
      Number(currentBudget.percentage || 0) >=
        100
    ) {
      return {
        title: "BUDGET ALERT",
        text:
          "You have exceeded your monthly budget.",
        className: "insight-danger",
        icon: "!",
      };
    }

    if (highestSpendingCategory) {
      return {
        title: "SMART INSIGHT",
        text:
          `${highestSpendingCategory._id} is your highest spending category at ₹${highestSpendingCategory.total}.`,
        className: "insight-gold",
        icon: "✦",
      };
    }

    return {
      title: "GOOD GOING",
      text:
        "Keep tracking your transactions to understand your spending habits.",
      className: "insight-safe",
      icon: "✓",
    };
  }, [
    transactions.length,
    currentBudget,
    highestSpendingCategory,
  ]);

  // =========================================================
  // BUDGET STATUS
  // =========================================================

  const budgetPercentage = Math.max(
    0,
    Number(
      currentBudget?.percentage || 0
    )
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

  const budgetStatus =
    isBudgetExceeded
      ? {
          title: "OVER BUDGET",
          text:
            "You have exceeded your monthly spending limit.",
          className: "danger",
          icon: "!",
        }
      : isBudgetWarning
      ? {
          title: "BUDGET WARNING",
          text:
            "You are getting close to your monthly limit.",
          className: "warning",
          icon: "!",
        }
      : {
          title: "BUDGET ON TRACK",
          text:
            "Your spending is within the planned limit.",
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
  // BUDGET MONTH CHANGE
  // =========================================================

  useEffect(() => {
    if (token) {
      fetchBudget();
    }
  }, [
    budgetMonth,
    budgetYear,
  ]);

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

      {message && (
        <div className="global-message dashboard-message">
          {message}
        </div>
      )}

      {/* =====================================================
          TRANSACTION FORM
      ====================================================== */}

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
              onClick={
                handleCancelEdit
              }
            >
              Cancel
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          SUMMARY
      ====================================================== */}

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

      {/* =====================================================
          SMART INSIGHTS
      ====================================================== */}

      <div className="insights-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              INTELLIGENCE
            </span>

            <h2>
              Smart Insights
            </h2>

          </div>

          <span className="analytics-label">
            Your money at a glance
          </span>

        </div>


        <div className="insights-grid">

          <div className="insight-card">

            <div className="insight-card-icon">
              ★
            </div>

            <span className="insight-card-label">
              TOP CATEGORY
            </span>

            <strong>
              {highestSpendingCategory
                ? highestSpendingCategory._id
                : "—"}
            </strong>

            <p>
              {highestSpendingCategory
                ? `₹${highestSpendingCategory.total} spent`
                : "No expense data yet"}
            </p>

          </div>


          <div className="insight-card">

            <div className="insight-card-icon">
              ₹
            </div>

            <span className="insight-card-label">
              SAVINGS
            </span>

            <strong>
              ₹{savings}
            </strong>

            <p>
              {savingsRate}% of income saved
            </p>

          </div>


          <div className="insight-card">

            <div className="insight-card-icon">
              %
            </div>

            <span className="insight-card-label">
              EXPENSE RATIO
            </span>

            <strong>
              {expenseShare}%
            </strong>

            <p>
              Income used on expenses
            </p>

          </div>


          <div
            className={`smart-insight-box ${smartInsight.className}`}
          >

            <div className="smart-insight-icon">
              {smartInsight.icon}
            </div>

            <div>

              <span>
                {smartInsight.title}
              </span>

              <p>
                {smartInsight.text}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MONTHLY ANALYTICS
      ====================================================== */}

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

          <div className="premium-chart">

            <ResponsiveContainer
              width="100%"
              height={220}
            >

              <BarChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 8,
                  left: -15,
                  bottom: 0,
                }}
                barCategoryGap="28%"
              >

                <CartesianGrid
                  vertical={false}
                  stroke="#24231f"
                  strokeDasharray="4 5"
                  opacity={0.5}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#68645c",
                    fontSize: 8,
                  }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#68645c",
                    fontSize: 7,
                  }}
                  tickFormatter={(value) =>
                    `₹${value}`
                  }
                />

                <Tooltip
                  cursor={{
                    fill:
                      "rgba(217,174,39,0.035)",
                  }}
                  contentStyle={{
                    background: "#0b0b0a",
                    border:
                      "1px solid rgba(217,174,39,0.25)",
                    borderRadius: "7px",
                    boxShadow:
                      "0 8px 25px rgba(0,0,0,0.5)",
                    fontSize: "8px",
                  }}
                  labelStyle={{
                    color: "#f3ce55",
                    fontSize: "8px",
                    marginBottom: "4px",
                  }}
                  formatter={(
                    value,
                    name
                  ) => [
                    `₹${value}`,
                    name === "income"
                      ? "Income"
                      : "Expense",
                  ]}
                />

                <Bar
                  dataKey="income"
                  name="income"
                  fill="#d9ae27"
                  radius={[
                    5,
                    5,
                    2,
                    2,
                  ]}
                  maxBarSize={16}
                />

                <Bar
                  dataKey="expense"
                  name="expense"
                  fill="#70571b"
                  radius={[
                    5,
                    5,
                    2,
                    2,
                  ]}
                  maxBarSize={16}
                />

              </BarChart>

            </ResponsiveContainer>

            <div className="chart-legend">

              <div>
                <span className="legend-dot income-dot" />
                Income
              </div>

              <div>
                <span className="legend-dot expense-dot" />
                Expense
              </div>

            </div>

          </div>

        )}

      </div>

      {/* =====================================================
          CATEGORY + BUDGET
      ====================================================== */}

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


        {/* BUDGET */}

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

              <option value="1">
                January
              </option>

              <option value="2">
                February
              </option>

              <option value="3">
                March
              </option>

              <option value="4">
                April
              </option>

              <option value="5">
                May
              </option>

              <option value="6">
                June
              </option>

              <option value="7">
                July
              </option>

              <option value="8">
                August
              </option>

              <option value="9">
                September
              </option>

              <option value="10">
                October
              </option>

              <option value="11">
                November
              </option>

              <option value="12">
                December
              </option>

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
              onClick={
                handleSaveBudget
              }
              disabled={loading}
            >
              Save Budget
            </button>

          </div>


          {budgetMessage && (
            <div className="budget-message">
              {budgetMessage}
            </div>
          )}


          {currentBudget && (

            <div className="budget-display">

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


              <div className="budget-progress">

                <div
                  className={`budget-progress-fill ${budgetStatus.className}`}
                  style={{
                    width:
                      `${budgetProgress}%`,
                  }}
                />

              </div>


              <div className="budget-scale">

                <span>
                  ₹0
                </span>

                <span>
                  ₹{currentBudget.amount}
                </span>

              </div>


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

                  <strong>
                    ₹
                    {isBudgetExceeded
                      ? Math.abs(
                          currentBudget.remaining
                        )
                      : currentBudget.remaining}
                  </strong>

                </div>

              </div>


              {isBudgetExceeded && (
                <div className="budget-warning">
                  ⚠ You have exceeded your
                  monthly budget.
                </div>
              )}

              {isBudgetWarning && (
                <div className="budget-warning">
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


      {/* =====================================================
          FINANCIAL GOALS
      ====================================================== */}

      <div className="section goals-section">

        <div className="section-heading">

          <div>

            <span className="section-label">
              FUTURE PLANNING
            </span>

            <h2>
              Financial Goals 🎯
            </h2>

          </div>

          <span className="analytics-label">
            Turn plans into progress
          </span>

        </div>


        {/* CREATE GOAL */}

        <div className="goal-create-form">

          <input
            type="text"
            placeholder="Goal name e.g. New Laptop"
            value={goalName}
            onChange={(e) =>
              setGoalName(e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Target amount"
            value={goalTargetAmount}
            onChange={(e) =>
              setGoalTargetAmount(
                e.target.value
              )
            }
            min="0"
          />

          <input
            type="number"
            placeholder="Already saved"
            value={goalSavedAmount}
            onChange={(e) =>
              setGoalSavedAmount(
                e.target.value
              )
            }
            min="0"
          />

          <input
            type="date"
            value={goalTargetDate}
            onChange={(e) =>
              setGoalTargetDate(
                e.target.value
              )
            }
          />

          <button
            className="primary-button"
            onClick={
              handleCreateGoal
            }
            disabled={loading}
          >
            + Create Goal
          </button>

        </div>


        {goalMessage && (
          <div className="goal-message">
            {goalMessage}
          </div>
        )}


        {/* GOALS LIST */}

        {goals.length === 0 ? (

          <div className="goal-empty">

            <div className="goal-empty-icon">
              🎯
            </div>

            <strong>
              No financial goals yet
            </strong>

            <p>
              Create a goal and start building
              your future.
            </p>

          </div>

        ) : (

          <div className="goals-grid">

            {goals.map((goal) => {

              const percentage =
                Number(
                  goal.percentage || 0
                );

              const completed =
                goal.completed ||
                Number(
                  goal.savedAmount || 0
                ) >=
                  Number(
                    goal.targetAmount || 0
                  );

              const remaining =
                Math.max(
                  Number(
                    goal.targetAmount || 0
                  ) -
                    Number(
                      goal.savedAmount || 0
                    ),
                  0
                );

              return (

                <div
                  className={`goal-card ${
                    completed
                      ? "goal-completed"
                      : ""
                  }`}
                  key={goal._id}
                >

                  {/* TOP */}

                  <div className="goal-card-top">

                    <div>

                      <span className="goal-small-label">
                        SAVINGS GOAL
                      </span>

                      <h3>
                        {goal.name}
                      </h3>

                    </div>

                    {completed ? (

                      <div className="goal-achieved">
                        ✓ ACHIEVED
                      </div>

                    ) : (

                      <div className="goal-percent">
                        {percentage}%
                      </div>

                    )}

                  </div>


                  {/* AMOUNTS */}

                  <div className="goal-amounts">

                    <div>

                      <span>
                        SAVED
                      </span>

                      <strong>
                        ₹
                        {Number(
                          goal.savedAmount || 0
                        ).toLocaleString()}
                      </strong>

                    </div>


                    <div>

                      <span>
                        TARGET
                      </span>

                      <strong>
                        ₹
                        {Number(
                          goal.targetAmount || 0
                        ).toLocaleString()}
                      </strong>

                    </div>

                  </div>


                  {/* PROGRESS */}

                  <div className="goal-progress">

                    <div
                      className="goal-progress-fill"
                      style={{
                        width:
                          `${Math.min(
                            percentage,
                            100
                          )}%`,
                      }}
                    />

                  </div>


                  {/* BOTTOM INFO */}

                  <div className="goal-bottom">

                    <span>

                      {completed
                        ? "Goal completed 🎉"
                        : `₹${remaining.toLocaleString()} remaining`}

                    </span>

                    <span>

                      {goal.targetDate
                        ? new Date(
                            goal.targetDate
                          ).toLocaleDateString()
                        : "No date"}

                    </span>

                  </div>


                  {/* UPDATE */}

                  {!completed && (

                    <div className="goal-update">

                      {updatingGoalId ===
                      goal._id ? (

                        <>

                          <input
                            type="number"
                            placeholder="New saved amount"
                            value={
                              goalUpdateAmount
                            }
                            onChange={(e) =>
                              setGoalUpdateAmount(
                                e.target.value
                              )
                            }
                            min="0"
                            max={
                              goal.targetAmount
                            }
                          />

                          <button
                            className="primary-button"
                            onClick={() =>
                              handleUpdateGoal(
                                goal._id
                              )
                            }
                            disabled={loading}
                          >
                            Save
                          </button>

                          <button
                            className="secondary-button"
                            onClick={() => {
                              setUpdatingGoalId(
                                null
                              );

                              setGoalUpdateAmount(
                                ""
                              );
                            }}
                          >
                            Cancel
                          </button>

                        </>

                      ) : (

                        <button
                          className="goal-update-button"
                          onClick={() => {
                            setUpdatingGoalId(
                              goal._id
                            );

                            setGoalUpdateAmount(
                              goal.savedAmount || 0
                            );
                          }}
                        >
                          Update Progress
                        </button>

                      )}

                    </div>

                  )}


                  {/* DELETE */}

                  <button
                    className="goal-delete-button"
                    onClick={() =>
                      handleDeleteGoal(
                        goal._id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              );
            })}

          </div>

        )}

      </div>


      {/* =====================================================
          TRANSACTIONS
      ====================================================== */}

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
                      {
                        transaction.description
                      }
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