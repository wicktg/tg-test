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

          if (user) {
            // Set the user data in state
            setTelegramUser({
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              isPremium: user.is_premium,
              languageCode: user.language_code,
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
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default App;
