import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../axiosInstance";

const API_URL: string = 'http://localhost:8000/api';

type User = {
    user_id: string;
    password: string;
}

type NewUser = {
    user_id: string;
    password: string;
}

type UserBasicInfo = {
  user_id: string;
};

type UserProfileData = {
  user_id: string;
};


type AuthApiState = {
  basicUserInfo?: UserBasicInfo | null;
  userProfileData?: UserProfileData | null;
  status: "idle" | "loading" | "failed";
  error: string | null;
};

const initialState: AuthApiState = {
  basicUserInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
  userProfileData: undefined,
  status: "idle",
  error: null,
};

export const login = createAsyncThunk("login", async (data: User) => {
  const response = await axiosInstance.post(
    "/api/login",
    data
  );
  const resData = response.data;

  localStorage.setItem("userInfo", JSON.stringify(resData));

  window.location.reload

  return resData;
});

export const register = createAsyncThunk("register", async (data: NewUser) => {
  const response = await axiosInstance.post(
    "/api/register",
    data
  );
  const resData = response.data;

  localStorage.setItem("userInfo", JSON.stringify(resData));

  window.location.reload

  return resData;
});

export const logout = createAsyncThunk("logout", async () => {
  localStorage.removeItem("userInfo");

  window.location.reload
  
  return "logged out";
});

export const getUser = createAsyncThunk(
  "users/profile",
  async (userId: string) => {
    const response = await axiosInstance.get(
      `/getUser`, {'params': {'user_id': userId}}
    );
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Login failed";
      })

      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<UserBasicInfo>) => {
          state.status = "idle";
          state.basicUserInfo = action.payload;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Registration failed";
      })

      .addCase(logout.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.status = "idle";
        state.basicUserInfo = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Logout failed";
      })

      .addCase(getUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.status = "idle";
        state.userProfileData = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Get user profile data failed";
      });
  },
});

export default authSlice.reducer;