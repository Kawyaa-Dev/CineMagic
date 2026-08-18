import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/movies/');
      // Handle paginated response
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFeaturedMovies = createAsyncThunk(
  'movies/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/movies/featured/');
      return response.data.results || response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    featured: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeaturedMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.featured = action.payload;
      })
      .addCase(fetchFeaturedMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;