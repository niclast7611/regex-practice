import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts } from "./postsSlice";
import PostsExcerpt from "./PostsExcerpt";

const PostsList = () => {
    //destructuring a dispatch from useDispatch 

    //Only way to update state 'triggering event' will subscribe to the store for any state changes
    const dispatch = useDispatch()
    //getting all the posts status and errors 
    const posts = useSelector(selectAllPosts)
    const postsStatus = useSelector(getPostsStatus)
    const error = useSelector(getPostsError)

    //Calls this method after rendering and DOM updates are finished
    useEffect(() => {
        if (postsStatus === 'idle') {
            //if status is idle creating an action call to store for fetchPosts 
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch])

    let content
    if (postsStatus === 'loading') {
        //If the promise is not fulfilled then show a loading screen untill it is done
        content = <p>Loading...</p>
    } else if (postsStatus === 'succeeded') {
        //Reverse sorting the posts from most recent to oldest
        const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPosts.map(post => <PostsExcerpt key={post.id} post={post} />)
    } else if (postsStatus === 'failed') {
        content = <p>{error}</p>
    }

    return (
        <section>
            <h2>Posts</h2>
            {content}
        </section>
    )
}
export default PostsList