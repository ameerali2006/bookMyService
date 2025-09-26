import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  name: string;
  email: string;
  image?: string;
  location:{
    lat: number
    lng: number
    address?: string
  }
}

interface UserState {
  user: UserData | null;
}

const initialState: UserState = {
  user: JSON.parse(localStorage.getItem("userData") || "null"),
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserData>) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload));
    },
    removeUser: (state) => {
      state.user = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { addUser, removeUser } = userSlice.actions;
export default userSlice.reducer;