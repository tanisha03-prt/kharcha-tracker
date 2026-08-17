import { useState } from "react";

function AddTransaction({ onTransactionAdded }) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("Food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!amount || Number(amount) <= 0) {
      setMessage("Please enter a valid amount.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5001/api/transactions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
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
        throw new Error(
          data.message || "Failed to add transaction"
        );
      }

      setMessage("Transaction added successfully! ✓");

      // Clear form
      setAmount("");
      setDescription("");

      // Refresh dashboard
      if (onTransactionAdded) {
        onTransactionAdded();
      }
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction">

      <div className="transaction-header">
        <div>
          <span className="eyebrow">
            NEW ACTIVITY
          </span>

          <h2>Add Transaction</h2>

          <p>
            Keep track of your income and expenses.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        {/* Amount */}
        <div className="form-group">
          <label>Amount</label>

          <div className="amount-input">
            <span>₹</span>

            <input
              type="number"
              placeholder="0.00"
              value={amount}
              min="1"
              step="0.01"
              onChange={(e) =>
                setAmount(e.target.value)
              }
              required
            />
          </div>
        </div>

        {/* Type */}
        <div className="form-group">
          <label>Transaction Type</label>

          <select
            className={type}
            value={type}
            onChange={(e) =>
              setType(e.target.value)
            }
          >
            <option value="expense">
              Expense
            </option>

            <option value="income">
              Income
            </option>
          </select>
        </div>

        {/* Category */}
        <div className="form-group">
          <label>Category</label>

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
            <option value="Entertainment">
              Entertainment
            </option>
            <option value="Health">Health</option>
            <option value="Education">
              Education
            </option>
            <option value="Salary">Salary</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div className="form-group">
          <label>Description</label>

          <input
            type="text"
            placeholder="e.g. Dinner with friends"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date</label>

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            required
          />
        </div>

        {/* Submit */}
        <button
          className="transaction-submit"
          type="submit"
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Adding...
            </>
          ) : (
            <>
              <span>＋</span>
              Add Transaction
            </>
          )}
        </button>

      </form>

      {/* Message */}
      {message && (
        <div
          className={`transaction-message ${
            message.includes("successfully")
              ? "success"
              : "error"
          }`}
        >
          {message}
        </div>
      )}

    </div>
  );
}

export default AddTransaction;