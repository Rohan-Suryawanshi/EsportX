// src/context/UserContext.js
import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
   const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
   });

   const [isLoggedIn, setIsLoggedIn] = useState(() => {
      return localStorage.getItem("isLoggedIn") === "true";
   });

   useEffect(() => {
      // This runs once on load to sync localStorage with context
      const storedUser = localStorage.getItem("user");
      const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";

      if (storedUser) setUser(JSON.parse(storedUser));
      setIsLoggedIn(loggedInStatus);
   }, []);

   const logout = () => {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoggedIn");
      setUser(null);
      setIsLoggedIn(false);
   };

   return (
      <UserContext.Provider
         value={{ user, setUser, isLoggedIn, setIsLoggedIn, logout }}
      >
         {children}
      </UserContext.Provider>
   );
};
