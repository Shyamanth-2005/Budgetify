import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

export const useUserAuth = () => {
  const { user, updateUser, clearUser } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) return;
    let isMounted = true;
    const fectchUserInfo = async () => {
      try {
        const response = await axiosInstance.get(API_PATHS.AUTH.GET_INFO);
        if (isMounted && response.data) {
          updateUser(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch user info:", err);
        if (isMounted) {
          clearUser();
          navigate("/login");
        }
      }
    };
    fectchUserInfo();
    return () => {
      isMounted = false;
    };
  }, [updateUser, clearUser, navigate]);
};
