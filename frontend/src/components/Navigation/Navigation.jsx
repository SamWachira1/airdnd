import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logoutThunk } from "../../store/session"
import ProfileButton from "./ProfileButton"


const Navigation = ({ isLoaded }) => {

    const sessionUser = useSelector(state => state.session.user)
    const dispatch = useDispatch()

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logoutThunk())
    }


    const sessionLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>
            <li>
                <button onClick={handleLogout}>Log Out</button>
            </li>
        </>
    ) : (
        <>
            <li>
                <NavLink to="/login">Log In</NavLink>
            </li>
            <li>
                <NavLink to="/signup">Sign Up</NavLink>
            </li>

        </>

    )

    return (
        <ul>
            <li>
                <NavLink to={'/'}>Home</NavLink>
            </li>
            {isLoaded && sessionLinks}
        </ul>
    )

}

export default Navigation
