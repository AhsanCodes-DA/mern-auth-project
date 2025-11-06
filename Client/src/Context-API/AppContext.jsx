import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios';

export const AppContent = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedIn, setIsLoggedIn] = useState(false); // Fixed typo
  const [userData, setUserData] = useState(false); // Initialize with null

// Function to check authentication state

  const getAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
        withCredentials: true, // Ensure cookies are sent
      });

      if (data.success) {
        setIsLoggedIn(true);
        await getUserData(); // Fetch user data after confirming authentication
      } else {
        setIsLoggedIn(false); // Ensure the state is updated if not authenticated
        toast.error(data.message || "Not authorized. Please log in.");
      }
    } catch (error) {
      setIsLoggedIn(false); // Ensure the state is updated on error
      toast.error(error.response?.data?.message || "Not authorized. Please log in.");
    }
  };  

  // Function to fetch user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/user/data', {
        withCredentials: true, // Ensure cookies are sent
      });
  
      if (data.success) {
        setUserData(data.userData); // Update userData state
      } else {
        toast.error(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch user data.");
    }
  };


  // Provide context values
  
  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  // Check authentication state on component mount
  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContent.Provider value={value}>
      {props.children}
    </AppContent.Provider>
  );

};      