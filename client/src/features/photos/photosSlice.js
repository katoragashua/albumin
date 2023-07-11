import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getData } from "../../utils/axios";

const url = `https://api.unsplash.com/photos?page=1&client_id=hjRE5t2RVXBqp561CfadH4aoW5oMSuEhDXsDxFJJ_nU`;
const url2 = `https://course-api.com/react-useReducer-cart-project`;
const url3 = `http://localhost:5000/api/v1/photos`;

const initialState = {
  isLoading: false,
  photos: [],
};

// export const getPhotos = createAsyncThunk(
//   "photos/getPhotos",
//   async (name, thunkAPI) => {
//     try {
//       const res = await getData.get("/photos");
//       return await res.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         "Could now fetch data from resource. Check the url."
//       );
//     }
//   }
// );

const photosSlice = createSlice({
  name: "photos",
  initialState,
  reducers: {},
  // extraReducers: (builder) => {
  //   builder.addCase(getPhotos.pending, (state, action) => {
  //     state.isLoading = true;
  //   });
  //   builder.addCase(getPhotos.fulfilled, (state, action) => {
  //     console.log(action.payload);
  //     state.isLoading = false;
  //     state.photos = action.payload;
  //   });
  //   builder.addCase(getPhotos.rejected, (state, action) => {
  //     // console.log(action);
  //     state.isLoading = false;
  //   });
  // },
});

export default photosSlice;
