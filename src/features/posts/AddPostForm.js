import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";

const AddPostForm = () => {
    //destructuring a dispatch from useDispatch 

    //Only way to update state 'triggering event' will subscribe to the store for any state changes
    const dispatch = useDispatch()

    //This is local state specific to this component it does not need to be in the store because this is the only component using it 
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [userId, setUserId] = useState('')
    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const users = useSelector(selectAllUsers)
    //Gathering info from the forms and setting them into the local state 
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    //Giving the three state items mentioned below a boolean value to see if they are filled and a status of idle if true the user can click the button to save 
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    const onSavePostClicked = () => {
        //if canSave is true then continue
        if (canSave) {
            try {
                //Set status to pending and dispatch an action to addNewPost in the store 
                setAddRequestStatus('pending')
                dispatch(addNewPost({ title, body: content, userId })).unwrap()

                //Resetting the local state to empty strings
                setTitle('')
                setContent('')
                setUserId('')
            } catch (err) {
                //Error catch 
                console.error('Failed to save the post', err)
            } finally {
                //reset the status to idle 
                setAddRequestStatus('idle')
            }
        }
    }
    //Mapping over the users to geth the author names and give the options of each other when creating a new post
    const usersOptions = users.map(user => (
        <option
            value={user.id}
            key={user.id}>

            {user.name}
        </option>
    ))

    return (
        <section>
            <h2>Add a New Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postAuthor">Author:</label>
                <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
                    <option />
                    {usersOptions}
                </select>
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Save Post</button>
            </form>
        </section>
    )

}


export default AddPostForm