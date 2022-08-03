import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
//Pretty much a copy of the PostsSlice 

//The url to grab the user information from a different Api
const USERS_URL = 'https://jsonplaceholder.typicode.com/users'
//Empty state
const initialState = []
//Thunk to fetch user information from api
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get(USERS_URL)
    return response.data
})

//Slice method with name of users initial state of nothing and a reducer method 
const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder) {
        //Only one addCase to check if the call is fulfilled if so then show the authors name
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            return action.payload
        })
    }
})

export const selectAllUsers = (state) => state.users
export default usersSlice.reducer