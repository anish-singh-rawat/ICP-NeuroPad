import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../auth/useAuthClient";

const UserProfileContext = createContext();

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const { backendActor } = useAuth();

  useEffect(() => {
    if (backendActor) {
      fetchUserProfile();
    }
  }, [backendActor]);

  const fetchUserProfile = async () => {
    try {
      const userProfileResponse = await backendActor.get_user_profile();
      const userProfile = userProfileResponse.Ok;
      if (userProfile) {
        setUserProfile(userProfile);
        localStorage.setItem('username', userProfile.username);
        localStorage.setItem('userImageId', userProfile.profile_img);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  return (
    <UserProfileContext.Provider value={{ userProfile, fetchUserProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => useContext(UserProfileContext);

