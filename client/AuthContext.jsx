import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "./Firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify"; // assuming you use toast notifications

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  const getUserDetails = async (userId) => {
    try {
      // Check the "users" collection first
      const userDocRef = doc(db, "users", userId);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        return userDocSnapshot.data();
      }

      // Then check the "admins" collection
      const adminDocRef = doc(db, "admins", userId);
      const adminDocSnapshot = await getDoc(adminDocRef);
      if (adminDocSnapshot.exists()) {
        return adminDocSnapshot.data();
      }

      // If neither exists, throw an error
      throw new Error("User data not found in the database.");
    } catch (error) {
      console.error("Error fetching user or admin details: ", error);
      throw error; // rethrow the error to be handled upstream
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setLoading(true);
      if (user) {
        try {
          const data = await getUserDetails(user.uid);
          // If data is found, update the user details
          setUserType(data.userType);
          // Using the value from Firebase auth to set email verification status
          setIsEmailVerified(user.emailVerified);
          setIsEmailVerified(true);

          const allDetails = {
            ...user,
            data,
            isEmailVerified: user.emailVerified,
          };

          setCurrentUser(allDetails);
          localStorage.setItem("currentUser", JSON.stringify(allDetails));
          localStorage.setItem("userType", JSON.stringify(data.userType));
          localStorage.setItem(
            "isEmailVerified",
            JSON.stringify(user.emailVerified)
          );
        } catch (error) {
          // Handle the case where user data is not found in Firestore
          toast.error("Account details not found. Please contact support.");
          // Optionally, sign the user out to avoid the app staying in an error state
          await auth.signOut();
          setCurrentUser(null);
          localStorage.removeItem("currentUser");
          localStorage.removeItem("userType");
          localStorage.removeItem("isEmailVerified");
        }
      } else {
        // If the user is not authenticated
        setCurrentUser(null);
        setUserType("");
        setIsEmailVerified(false);
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userType");
        localStorage.removeItem("isEmailVerified");
      }
      setLoading(false);
    });

    // Load from localStorage if available
    const storedUser = localStorage.getItem("currentUser");
    const storedUserType = localStorage.getItem("userType");
    const storedEmailVerified = localStorage.getItem("isEmailVerified");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setUserType(JSON.parse(storedUserType));
      setIsEmailVerified(JSON.parse(storedEmailVerified));
    }
    // Ensure loading is set to false regardless of outcome
    setLoading(false);

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setUserType("");
      setIsEmailVerified(false);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("userType");
      localStorage.removeItem("isEmailVerified");
    } catch (error) {
      console.error("Error logging out: ", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        logout,
        userType,
        isEmailVerified,
        setIsEmailVerified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
