import { useDispatch } from "react-redux";
import { reactionAdded } from "./postsSlice";

const reactionEmoji = {
    //Assigns the reactions 
    thumbsUp: '👍',
    wow: '😳',
    heart: '💗',
    rocket: '🚀',
    coffee: '☕️'

}

const ReactionButtons = ({ post }) => {
    const dispatch = useDispatch()


    const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {

        return (
            <button
                type="button"
                key={name}
                className='reactionButton'
                onClick={() =>
                    //everytime the reactions are clicked it is creating an action to update the value next to the reactions
                    dispatch(reactionAdded({ postId: post.id, reaction: name }))
                }
            >
                {emoji} {post.reactions[name]}
            </button>
        )
    })
    return <div>{reactionButtons}</div>

}

export default ReactionButtons