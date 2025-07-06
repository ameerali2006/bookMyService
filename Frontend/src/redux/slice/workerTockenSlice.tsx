import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


interface WorkerTokenState {
  WorkerToken: string | null;
}

const initialState: WorkerTokenState = {
  WorkerToken: JSON.parse(localStorage.getItem("workerAccessToken") || "null"),
};

const workerTokenSlice = createSlice({
  name: "workerTokenSlice",
  initialState,
  reducers: {
    addWorkerToken: (state, action: PayloadAction<string>) => {
      state.WorkerToken = action.payload;
      localStorage.setItem("workerAccessToken", JSON.stringify(action.payload));
    },
    removeWorkerToken: (state) => {
      state.WorkerToken = null;
      localStorage.removeItem("workerAccessToken");
    },
  },
});

export const { addWorkerToken, removeWorkerToken } = workerTokenSlice.actions;
export default workerTokenSlice.reducer;