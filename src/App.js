import React, { useEffect, useState } from "react";

// Main App Component
const App = () => {
  const [telegramUser, setTelegramUser] = useState(null);

  // Load Telegram Web App Script on mount
  useEffect(() => {
    const loadTelegramScript = () => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => {
        // Once the script is loaded, initialize the Telegram WebApp
        if (window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          const user = window.Telegram.WebApp.initDataUnsafe?.user;

          // Log the user object to check if `photo_url` exists
          console.log("Telegram User Data:", user);

          if (user) {
            // Set the user data in state
            setTelegramUser({
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              isPremium: user.is_premium,
              languageCode: user.language_code,
              photoUrl: user.photo_url, // Attempt to fetch the profile picture URL
            });
          }
        }
      };
      document.body.appendChild(script);
    };

    loadTelegramScript();
  }, []);

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
          {telegramUser.photoUrl ? (
            <img
              src={telegramUser.photoUrl}
              alt={`${telegramUser.firstName}'s Profile`}
              style={{ borderRadius: "50%", width: "100px", height: "100px" }}
            />
          ) : (
            <p>No Profile Picture Available</p>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default App;
