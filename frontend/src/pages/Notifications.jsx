import React, { useEffect, useState } from "react";

const API_URL =
  "http://localhost:5001/api/notifications";

const Notifications = () => {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // =====================================================
  // TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH NOTIFICATIONS
  // =====================================================

  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch notifications"
        );
      }

      setNotifications(
        Array.isArray(data)
          ? data
          : data.notifications || []
      );

    } catch (error) {
      console.error(
        "Fetch notifications error:",
        error
      );

      setNotifications([]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // =====================================================
  // MARK AS READ
  // =====================================================

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}/read`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to mark notification as read"
        );
      }

      setNotifications((previous) =>
        previous.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                read: true,
              }
            : notification
        )
      );

    } catch (error) {
      console.error(
        "Mark read error:",
        error
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${getToken()}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to delete notification"
        );
      }

      setNotifications((previous) =>
        previous.filter(
          (notification) =>
            notification._id !== id
        )
      );

    } catch (error) {
      console.error(
        "Delete notification error:",
        error
      );
    }
  };

  // =====================================================
  // MARK ALL READ
  // =====================================================

  const markAllAsRead = async () => {
    const unread =
      notifications.filter(
        (notification) =>
          !notification.read
      );

    for (const notification of unread) {
      await markAsRead(
        notification._id
      );
    }
  };

  // =====================================================
  // DELETE ALL
  // =====================================================

  const deleteAll = async () => {
    const confirmed =
      window.confirm(
        "Delete all notifications?"
      );

    if (!confirmed) return;

    for (const notification of notifications) {
      await deleteNotification(
        notification._id
      );
    }
  };

  // =====================================================
  // TIME FORMAT
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    const notificationDate =
      new Date(date);

    const now = new Date();

    const difference =
      now.getTime() -
      notificationDate.getTime();

    const minutes = Math.floor(
      difference / 60000
    );

    if (minutes < 1) {
      return "Just now";
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d ago`;
    }

    return notificationDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  const getIcon = (type) => {
    const value =
      String(type || "").toLowerCase();

    if (
      value.includes("complete") ||
      value.includes("success")
    ) {
      return "✓";
    }

    if (
      value.includes("deadline") ||
      value.includes("warning")
    ) {
      return "!";
    }

    if (
      value.includes("budget")
    ) {
      return "₹";
    }

    return "✦";
  };

  // =====================================================
  // NOTIFICATION TITLE
  // =====================================================

  const getTitle = (notification) => {
    if (notification.title) {
      return notification.title;
    }

    const type =
      String(
        notification.type || ""
      ).toLowerCase();

    if (
      type.includes("complete")
    ) {
      return "Goal Completed";
    }

    if (
      type.includes("deadline")
    ) {
      return "Goal Deadline";
    }

    if (
      type.includes("budget")
    ) {
      return "Budget Alert";
    }

    return "Notification";
  };

  // =====================================================
  // UNREAD COUNT
  // =====================================================

  const unreadCount =
    notifications.filter(
      (notification) =>
        !notification.read
    ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="page notifications-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <p className="eyebrow">
            ALERT CENTER
          </p>

          <h1>
            Notifications
          </h1>

          <p className="page-subtitle">
            Important updates about your
            finances and goals.
          </p>

        </div>

        <div className="notification-header-actions">

          {unreadCount > 0 && (
            <button
              className="secondary-btn"
              onClick={markAllAsRead}
            >
              ✓ Mark all read
            </button>
          )}

          {notifications.length > 0 && (
            <button
              className="secondary-btn"
              onClick={deleteAll}
            >
              Clear all
            </button>
          )}

        </div>

      </div>


      {/* =================================================
          STATS
      ================================================= */}

      <div className="notification-stats">

        <div className="notification-stat">

          <span>
            TOTAL
          </span>

          <strong>
            {notifications.length}
          </strong>

        </div>


        <div className="notification-stat">

          <span>
            UNREAD
          </span>

          <strong className="notification-unread-number">
            {unreadCount}
          </strong>

        </div>


        <div className="notification-stat">

          <span>
            STATUS
          </span>

          <strong>
            {unreadCount === 0
              ? "CLEAR"
              : "ATTENTION"}
          </strong>

        </div>

      </div>


      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="notifications-empty">

          <div className="loading-spinner"></div>

          <p>
            Loading notifications...
          </p>

        </div>

      ) : notifications.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="notifications-empty">

          <div className="notification-empty-icon">
            ✦
          </div>

          <h2>
            All clear
          </h2>

          <p>
            You don't have any notifications.
          </p>

        </div>

      ) : (

        /* =================================================
           NOTIFICATION LIST
        ================================================= */

        <div className="notification-list">

          {notifications.map(
            (notification) => {

              const isUnread =
                !notification.read;

              return (

                <div
                  key={notification._id}
                  className={
                    isUnread
                      ? "notification-card unread"
                      : "notification-card"
                  }
                >

                  {/* ICON */}

                  <div
                    className={
                      "notification-icon " +
                      (
                        String(
                          notification.type || ""
                        )
                          .toLowerCase()
                          .includes(
                            "complete"
                          )
                          ? "success-icon"
                          : String(
                              notification.type || ""
                            )
                              .toLowerCase()
                              .includes(
                                "deadline"
                              )
                          ? "warning-icon"
                          : ""
                      )
                    }
                  >
                    {getIcon(
                      notification.type
                    )}
                  </div>


                  {/* CONTENT */}

                  <div className="notification-content">

                    <div className="notification-title-row">

                      <h3>
                        {getTitle(
                          notification
                        )}
                      </h3>

                      {isUnread && (
                        <span className="unread-dot"></span>
                      )}

                    </div>


                    <p>
                      {notification.message ||
                        notification.description ||
                        "You have a new notification."}
                    </p>


                    <span className="notification-time">
                      {formatTime(
                        notification.createdAt
                      )}
                    </span>

                  </div>


                  {/* ACTIONS */}

                  <div className="notification-actions">

                    {isUnread && (
                      <button
                        className="notification-action"
                        onClick={() =>
                          markAsRead(
                            notification._id
                          )
                        }
                        title="Mark as read"
                      >
                        ✓
                      </button>
                    )}

                    <button
                      className="notification-action delete-notification"
                      onClick={() =>
                        deleteNotification(
                          notification._id
                        )
                      }
                      title="Delete"
                    >
                      ×
                    </button>

                  </div>

                </div>

              );
            }
          )}

        </div>

      )}

    </div>
  );
};

export default Notifications;