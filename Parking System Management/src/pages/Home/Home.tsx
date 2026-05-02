import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../hooks/redux-hooks";
import { getUser, logout } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);
  const userProfileInfo = useAppSelector((state) => state.auth.userProfileData);

  useEffect(() => {
    if (basicUserInfo) {
      dispatch(getUser(basicUserInfo.user_id));
    }
  }, [basicUserInfo]);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <h1>Home</h1>
      <h4>ID: {userProfileInfo?.user_id}</h4>
      <Button variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogout}>
        Logout
      </Button>
    </>
  );
};

export default Home;    