import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { sub } from 'date-fns';
import axios from "axios";

//URL for the API call we used
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

//Initial statefor the posts array is empty because we will push things into it
const initialState = {
    posts: [],
    status: 'idle', //idle | loading | succeeded | failed
    error: null
}

//This is the post slice method that contains reducer methods for the posts state

//It accepts initial state a name and reducer functions, and automatically generates actions to correspond with the state

//Immer tech behind the scenes makes it so you dont need to ...
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            //Pushing the blog information from the api into a the posts empty array 
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    //Structuring the data that will be sent to the array. 
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        //Another reducer function that adds one to the specific reaction when its clicked on 
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    //All this is is assigning values to each part of the loading statge waiting for the promise to get fulfilled
    extraReducers(builder) {
        builder
            //if the fetchPosts method is pending state changes to loading instead of idle 
            .addCase(fetchPosts.pending, (state) => {
                state.status = 'loading'
            })
            //if fulfilled changes state to succeeded and adds more features to the blog post that the api does not have in it like a time stamp and reactions 
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                let min = 1
                const loadedPosts = action.payload.map(post => {
                    //Mapping over the loadedPosts from the api and adding features mentioned above
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                })
                //Because we are in a createSlice we do not need to ... or make a copy fo the state because Immer does it in the background this only works in the createSlice method 

                //So all we are doing is concatting the loadedPosts with the new features into the posts state
                state.posts = state.posts.concat(loadedPosts)
            })
            //Has a failure status just incase
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            //creates a new post through the api formatting
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
    }
});
//exporting all of this state, two of the reducer methods and both thunks 
export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const { postAdded, reactionAdded } = postsSlice.actions
export default postsSlice.reducer;

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})