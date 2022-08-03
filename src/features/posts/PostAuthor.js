import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice"

const PostAuthor = ({ userId }) => {
    const users = useSelector(selectAllUsers)
    const author = users.find(user => user.id === userId)
    // shows the authors name in each post
    return <span>by {author ? author.name : 'Unknown author'}</span>
}

export default PostAuthor