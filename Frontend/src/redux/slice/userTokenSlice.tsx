import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


interface UserTokenState {
  userToken: string | null;
}

const initialState: UserTokenState = {
  userToken: JSON.parse(localStorage.getItem("userAccessToken") || "null"),
};

const userTokenSlice = createSlice({
  name: "userTokenSlice", 
  initialState,
  reducers: {
    addUserToken: (state, action: PayloadAction<string>) => {
      state.userToken = action.payload;
      localStorage.setItem("userAccessToken", JSON.stringify(action.payload));
    },
    removeUserToken: (state) => {
      state.userToken = null;
      localStorage.removeItem("userAccessToken");
    },
  },
});

export const { addUserToken, removeUserToken } = userTokenSlice.actions;
export default userTokenSlice.reducer;