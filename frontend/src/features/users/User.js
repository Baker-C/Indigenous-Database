import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectUserById } from './usersApiSlice'

const User = ({ userId }) => {
    const navigate = useNavigate()
    console.log(userId)
    const user = useSelector(state => selectUserById(state, userId))
    console.log(user)
    if (user) {
        const handleEdit = () => navigate('/')
        return (
            <tr>
                <td>{ user.username }</td>
                <td>{ userId }</td>
                <td>
                    <button onClick={ handleEdit }>
                        Edit User
                    </button>
                </td>
            </tr>
        )
    } else return null

}

export default User