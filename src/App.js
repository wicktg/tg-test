import React, { useEffect, useState } from "react";

// Main App Component
const App = () => {
  const [telegramUser, setTelegramUser] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState(null);

  // Load Telegram Web App Script on mount
  useEffect(() => {
    const loadTelegramScript = () => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => {
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          const user = window.Telegram.WebApp.initDataUnsafe?.user;

          if (user) {
            setTelegramUser({
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              isPremium: user.is_premium,
              languageCode: user.language_code,
              photoUrl: user.photo_url,
            });
          }
        }
      };
      document.body.appendChild(script);
    };

    loadTelegramScript();
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const checkUserStatus = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/get_user_status?username=${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user status");
      }
      const data = await response.json();
      setUserStatus(data);
      setError(null); // Clear previous errors
    } catch (error) {
      setError(error.message);
      setUserStatus(null); // Clear previous status
    }
  };

  return (
    <div>
      <h1>Telegram Mini App</h1>
      {telegramUser ? (
        <div>
          <p>First Name: {telegramUser.firstName}</p>
          <p>Last Name: {telegramUser.lastName}</p>
          <p>Username: {telegramUser.username}</p>
          <p>Premium User: {telegramUser.isPremium ? "Yes" : "No"}</p>
          <p>Language: {telegramUser.languageCode}</p>
          {telegramUser.photoUrl && (
            <img
              src={telegramUser.photoUrl}
              alt={`${telegramUser.firstName}'s Profile`}
              style={{ borderRadius: "50%", width: "100px", height: "100px" }}
            />
          )}
          <div>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={handleUsernameChange}
            />
            <button onClick={checkUserStatus}>Check User Status</button>
          </div>
          {userStatus && (
            <div>
              <p>User Status for @{userStatus.username}:</p>
              <p>Last Seen: {userStatus.last_seen}</p>
              <p>First Name: {userStatus.first_name}</p>
              <p>Last Name: {userStatus.last_name}</p>
              <p>Premium User: {userStatus.is_premium ? "Yes" : "No"}</p>
              <p>Language Code: {userStatus.language_code}</p>
            </div>
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default App;
