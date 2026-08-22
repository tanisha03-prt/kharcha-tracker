import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {

  const navigate = useNavigate();

  const menuItems = [
    {
      path: "/dashboard",
      icon: "⌂",
      label: "Dashboard",
    },
    {
      path: "/transactions",
      icon: "↗",
      label: "Transactions",
    },
    {
      path: "/budget",
      icon: "₹",
      label: "Budget",
    },
    {
      path: "/goals",
      icon: "◎",
      label: "Goals",
    },
    {
      path: "/analytics",
      icon: "◒",
      label: "Analytics",
    },
    {
      path: "/notifications",
      icon: "♢",
      label: "Notifications",
    },
    {
      path: "/settings",
      icon: "⚙",
      label: "Settings",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <aside className="sidebar">

      {/* BRAND */}
      <div className="sidebar-brand">

        <div className="brand-icon">
          ₹
        </div>

        <div>
          <h2>
            Kharcha
          </h2>

          <span>
            TRACKER
          </span>
        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <p className="nav-title">
          MENU
        </p>

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${
                isActive
                  ? "nav-item-active"
                  : ""
              }`
            }
          >

            <span className="nav-icon">
              {item.icon}
            </span>

            <span>
              {item.label}
            </span>

          </NavLink>

        ))}

      </nav>


      {/* SIDEBAR BOTTOM */}
      <div className="sidebar-bottom">

        <div className="sidebar-tip">

          <span className="tip-icon">
            ✦
          </span>

          <div>
            <strong>
              Smart Money
            </strong>

            <p>
              Track. Plan. Grow.
            </p>
          </div>

        </div>


        <button
          className="logout-btn"
          onClick={handleLogout}
        >

          <span>
            ↪
          </span>

          Logout

        </button>

      </div>

    </aside>
  );
};

export default Sidebar;