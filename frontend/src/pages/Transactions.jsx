import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5001/api/transactions";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: "",
  });

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH TRANSACTIONS
  // =====================================================

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Fetch transactions error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // =====================================================
  // FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    setForm({
      amount: "",
      type: "expense",
      category: "",
      description: "",
      date: "",
    });

    setEditingId(null);
    setShowForm(false);
  };

  // =====================================================
  // ADD / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.amount || !form.category) {
      alert("Amount and category are required");
      return;
    }

    try {
      const url = editingId
        ? `${API_URL}/${editingId}`
        : `${API_URL}/add`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },

        body: JSON.stringify({
          amount: Number(form.amount),
          type: form.type,
          category: form.category,
          description: form.description,
          date: form.date || new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Transaction failed"
        );
      }

      await fetchTransactions();

      resetForm();

    } catch (error) {
      console.error("Transaction error:", error);

      alert(error.message);
    }
  };

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = (transaction) => {
    setEditingId(transaction._id);

    setForm({
      amount: transaction.amount || "",
      type: transaction.type || "expense",
      category: transaction.category || "",
      description: transaction.description || "",
      date: transaction.date
        ? new Date(transaction.date)
            .toISOString()
            .split("T")[0]
        : "",
    });

    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete transaction"
        );
      }

      await fetchTransactions();

    } catch (error) {
      console.error("Delete error:", error);

      alert(error.message);
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTransactions = transactions.filter(
    (transaction) => {
      const matchesSearch =
        transaction.category
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        transaction.description
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ||
        transaction.type === filter;

      return matchesSearch && matchesFilter;
    }
  );

  // =====================================================
  // TOTALS
  // =====================================================

  const totalIncome = transactions
    .filter(
      (transaction) =>
        transaction.type === "income"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  const totalExpense = transactions
    .filter(
      (transaction) =>
        transaction.type === "expense"
    )
    .reduce(
      (total, transaction) =>
        total + Number(transaction.amount || 0),
      0
    );

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page transactions-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            MONEY FLOW
          </p>

          <h1>
            Transactions
          </h1>

          <p className="page-subtitle">
            Track and manage your income and expenses.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => {
            setEditingId(null);

            setForm({
              amount: "",
              type: "expense",
              category: "",
              description: "",
              date: "",
            });

            setShowForm(true);
          }}
        >
          + Add Transaction
        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="transaction-summary">

        <div className="transaction-stat">

          <span>
            TOTAL TRANSACTIONS
          </span>

          <strong>
            {transactions.length}
          </strong>

        </div>


        <div className="transaction-stat">

          <span>
            TOTAL INCOME
          </span>

          <strong className="income-text">
            ₹{totalIncome.toLocaleString("en-IN")}
          </strong>

        </div>


        <div className="transaction-stat">

          <span>
            TOTAL EXPENSE
          </span>

          <strong className="expense-text">
            ₹{totalExpense.toLocaleString("en-IN")}
          </strong>

        </div>

      </div>


      {/* =================================================
          FORM
      ================================================= */}

      {showForm && (
        <div className="transaction-form-card">

          <div className="form-card-header">

            <div>
              <p className="eyebrow">
                {editingId
                  ? "UPDATE"
                  : "NEW ENTRY"}
              </p>

              <h2>
                {editingId
                  ? "Edit Transaction"
                  : "Add Transaction"}
              </h2>
            </div>

            <button
              className="close-form-btn"
              onClick={resetForm}
            >
              ×
            </button>

          </div>


          <form
            onSubmit={handleSubmit}
            className="transaction-form"
          >

            {/* TYPE */}

            <div className="form-group">

              <label>
                Type
              </label>

              <div className="type-buttons">

                <button
                  type="button"
                  className={
                    form.type === "expense"
                      ? "type-btn active-expense"
                      : "type-btn"
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      type: "expense",
                    })
                  }
                >
                  Expense
                </button>

                <button
                  type="button"
                  className={
                    form.type === "income"
                      ? "type-btn active-income"
                      : "type-btn"
                  }
                  onClick={() =>
                    setForm({
                      ...form,
                      type: "income",
                    })
                  }
                >
                  Income
                </button>

              </div>

            </div>


            {/* AMOUNT */}

            <div className="form-group">

              <label>
                Amount
              </label>

              <div className="input-with-symbol">
                <span>₹</span>

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Food, Shopping, Salary..."
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <input
                type="text"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Optional description"
              />

            </div>


            {/* DATE */}

            <div className="form-group">

              <label>
                Date
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />

            </div>


            {/* BUTTONS */}

            <div className="form-actions">

              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-btn"
              >
                {editingId
                  ? "Update"
                  : "Save Transaction"}
              </button>

            </div>

          </form>

        </div>
      )}


      {/* =================================================
          SEARCH + FILTER
      ================================================= */}

      <div className="transaction-toolbar">

        <div className="search-box">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        <div className="filter-buttons">

          <button
            className={
              filter === "all"
                ? "filter-btn active-filter"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("all")
            }
          >
            All
          </button>

          <button
            className={
              filter === "income"
                ? "filter-btn active-filter"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("income")
            }
          >
            Income
          </button>

          <button
            className={
              filter === "expense"
                ? "filter-btn active-filter"
                : "filter-btn"
            }
            onClick={() =>
              setFilter("expense")
            }
          >
            Expense
          </button>

        </div>

      </div>


      {/* =================================================
          TRANSACTIONS TABLE
      ================================================= */}

      <div className="transactions-card">

        <div className="transactions-card-header">

          <div>
            <p className="eyebrow">
              RECORDS
            </p>

            <h2>
              All Transactions
            </h2>
          </div>

          <span className="record-count">
            {filteredTransactions.length} records
          </span>

        </div>


        {loading ? (

          <div className="empty-transactions">
            <div className="loading-spinner"></div>

            <p>
              Loading transactions...
            </p>
          </div>

        ) : filteredTransactions.length === 0 ? (

          <div className="empty-transactions">

            <div className="empty-icon">
              ₹
            </div>

            <h3>
              No transactions found
            </h3>

            <p>
              Add your first transaction to start
              tracking your money.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setShowForm(true)
              }
            >
              + Add Transaction
            </button>

          </div>

        ) : (

          <div className="transactions-list">

            {filteredTransactions.map(
              (transaction) => (

                <div
                  className="transaction-item"
                  key={transaction._id}
                >

                  {/* LEFT */}

                  <div className="transaction-left">

                    <div
                      className={
                        transaction.type ===
                        "income"
                          ? "transaction-category income-category"
                          : "transaction-category"
                      }
                    >
                      {transaction.category
                        ?.charAt(0)
                        ?.toUpperCase() || "₹"}
                    </div>


                    <div className="transaction-details">

                      <strong>
                        {transaction.category}
                      </strong>

                      <span>
                        {transaction.description ||
                          "No description"}
                      </span>

                      <small>
                        {formatDate(
                          transaction.date
                        )}
                      </small>

                    </div>

                  </div>


                  {/* RIGHT */}

                  <div className="transaction-right">

                    <strong
                      className={
                        transaction.type ===
                        "income"
                          ? "income-text"
                          : "expense-text"
                      }
                    >
                      {transaction.type ===
                      "income"
                        ? "+"
                        : "-"}
                      ₹
                      {Number(
                        transaction.amount
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>


                    <div className="transaction-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          handleEdit(
                            transaction
                          )
                        }
                        title="Edit"
                      >
                        ✎
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(
                            transaction._id
                          )
                        }
                        title="Delete"
                      >
                        ×
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
};

export default Transactions;