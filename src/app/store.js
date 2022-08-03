import { configureStore } from "@reduxjs/toolkit";
import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';
// Controls global state a single location for all state in this one application 
export const store = configureStore({
    reducer: {
        //Whenever the posts/users state is changed then their corresponding reducer methods go off in their corresponding slice files

        //This is what actually changes the state
        posts: postsReducer,
        users: usersReducer
    }
})