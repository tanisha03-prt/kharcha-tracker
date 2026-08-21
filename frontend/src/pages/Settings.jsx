import React, { useEffect, useState } from "react";

const Settings = () => {
  const [name, setName] = useState(
    localStorage.getItem("userName") || ""
  );

  const [email, setEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );

  const [currency, setCurrency] = useState(
    localStorage.getItem("currency") || "INR"
  );

  const [saved, setSaved] = useState(false);

  // =====================================================
  // LOAD USER DATA
  // =====================================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);

        setName(
          user.name ||
          user.username ||
          localStorage.getItem("userName") ||
          ""
        );

        setEmail(
          user.email ||
          localStorage.getItem("userEmail") ||
          ""
        );
      } catch (error) {
        console.error(
          "User data error:",
          error
        );
      }
    }
  }, []);

  // =====================================================
  // SAVE SETTINGS
  // =====================================================

  const handleSave = () => {
    localStorage.setItem(
      "userName",
      name
    );

    localStorage.setItem(
      "userEmail",
      email
    );

    localStorage.setItem(
      "currency",
      currency
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  // =====================================================
  // DELETE LOCAL DATA
  // =====================================================

  const handleClearData = () => {
    const confirmed =
      window.confirm(
        "This will remove your saved local preferences. Continue?"
      );

    if (!confirmed) return;

    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("currency");

    setName("");
    setEmail("");
    setCurrency("INR");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page settings-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            PREFERENCES
          </p>

          <h1>
            Settings
          </h1>

          <p className="page-subtitle">
            Manage your profile and app preferences.
          </p>

        </div>

        {saved && (
          <div className="settings-saved">
            ✓ Changes saved
          </div>
        )}

      </div>


      {/* =================================================
          PROFILE
      ================================================= */}

      <div className="settings-section">

        <div className="settings-section-header">

          <div>

            <p className="eyebrow">
              ACCOUNT
            </p>

            <h2>
              Profile
            </h2>

          </div>

          <div className="settings-avatar">
            {name
              ? name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>

        </div>


        <div className="settings-form">

          <div className="settings-field">

            <label>
              NAME
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Your name"
            />

          </div>


          <div className="settings-field">

            <label>
              EMAIL
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Your email"
            />

          </div>

        </div>

      </div>


      {/* =================================================
          PREFERENCES
      ================================================= */}

      <div className="settings-section">

        <div className="settings-section-header">

          <div>

            <p className="eyebrow">
              APP
            </p>

            <h2>
              Preferences
            </h2>

          </div>

        </div>


        <div className="settings-option">

          <div>

            <strong>
              Currency
            </strong>

            <span>
              Choose how amounts are displayed.
            </span>

          </div>

          <select
            value={currency}
            onChange={(e) =>
              setCurrency(e.target.value)
            }
          >
            <option value="INR">
              ₹ INR
            </option>

            <option value="USD">
              $ USD
            </option>

            <option value="EUR">
              € EUR
            </option>

            <option value="GBP">
              £ GBP
            </option>
          </select>

        </div>

      </div>


      {/* =================================================
          SAVE
      ================================================= */}

      <div className="settings-save-area">

        <button
          className="primary-btn"
          onClick={handleSave}
        >
          Save Changes
        </button>

      </div>


      {/* =================================================
          ACCOUNT ACTIONS
      ================================================= */}

      <div className="settings-section danger-section">

        <div className="settings-section-header">

          <div>

            <p className="eyebrow">
              ACCOUNT ACTIONS
            </p>

            <h2>
              Security
            </h2>

          </div>

        </div>


        <div className="settings-actions">

          <div className="settings-action-row">

            <div>

              <strong>
                Logout
              </strong>

              <span>
                Sign out from this device.
              </span>

            </div>

            <button
              className="settings-outline-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>


          <div className="settings-action-row">

            <div>

              <strong>
                Clear Local Preferences
              </strong>

              <span>
                Remove locally saved profile preferences.
              </span>

            </div>

            <button
              className="settings-outline-btn"
              onClick={handleClearData}
            >
              Clear
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Settings;