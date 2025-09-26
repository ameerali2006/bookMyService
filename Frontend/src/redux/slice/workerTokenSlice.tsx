import { createSlice,type PayloadAction } from "@reduxjs/toolkit";


interface WorkerData {
  name: string;
  email: string;
  image?: string;
   
}
interface WorkerState {
  worker: WorkerData | null;
}

const initialState: WorkerState = {
  worker: JSON.parse(localStorage.getItem("WorkerData") || "null"),
};

const workerTokenSlice = createSlice({
  name: "workerTokenSlice",
  initialState,
  reducers: {
    addWorker: (state, action: PayloadAction<WorkerData>) => {
      state.worker = action.payload;
      localStorage.setItem("WorkerData", JSON.stringify(action.payload));
    },
    removeWorker: (state) => {
      state.worker = null;
      localStorage.removeItem("WorkerData");
    },
  },
});

export const { addWorker, removeWorker } = workerTokenSlice.actions;
export default workerTokenSlice.reducer;