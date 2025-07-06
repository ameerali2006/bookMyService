import {createSlice , type PayloadAction} from  '@reduxjs/toolkit';

interface AdminTokenState{
    adminToken :string |null;

}
const initialState:AdminTokenState={
    adminToken : JSON.parse(localStorage.getItem('adminAccessTocken')||"null")
};
const adminTokenSlice = createSlice({
  name: "admintokenSlice", // Updated to match the store
  initialState,
  reducers: {
    addAdminToken: (state, action: PayloadAction<string>) => {
      state.adminToken = action.payload;
      localStorage.setItem("adminAccessToken", JSON.stringify(action.payload));
    },
    removeAdminToken: (state) => {
      state.adminToken = null;
      localStorage.removeItem("adminAccessToken");
    },
  },
});
export const { addAdminToken, removeAdminToken } = adminTokenSlice.actions;
export default adminTokenSlice.reducer;

