import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const createBooking = createAsyncThunk(
  'bookings/create',
  async ({ showId, seats }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:8000/api/shows/${showId}/book_seats/`, { seats });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    currentBooking: null,
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentBooking: (state) => {
      state.currentBooking = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBooking } = bookingSlice.actions;
export default bookingSlice.reducer;