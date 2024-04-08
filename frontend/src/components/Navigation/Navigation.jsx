import { NavLink } from "react-router-dom"
import { useSelector} from "react-redux"
// import { logoutThunk } from "../../store/session"
import ProfileButton from "./ProfileButton"
import { FaUserCircle } from "react-icons/fa";
import styles from './Navigation.module.css';
import { useState } from "react";

const Navigation = ({ isLoaded }) => {
    const [showMenu, setShowMenu] = useState(false)
    const sessionUser = useSelector(state => state.session.user)

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden")



    const sessionLinks = sessionUser ? (
        <>
            <li>
                <ProfileButton user={sessionUser} />
            </li>

        </>
    ) : (
        <>
            <div className={styles.profileButtonContainer}>
                <button className={styles.profileButton} onClick={() => setShowMenu(!showMenu)}>
                    <FaUserCircle size={'2em'} />
                </button>
                <ul className={`${ulClassName} ${showMenu ? '' : styles.hidden}`}>
                    <li className={styles.navLi}>
                        <NavLink className={styles.NavLink} to="/login">Log In</NavLink>
                    </li>
                    <li>
                        <NavLink className={styles.NavLink} to="/signup">Sign Up</NavLink>
                    </li>
                </ul>

            </div>


        </>

    )

    return (
        <div className={styles.homeLinkContainer}>
            <ul>
                <li className={styles.homeLink}>
                    <NavLink to={'/'}>Home</NavLink>
                </li>
                {isLoaded && sessionLinks}
            </ul>

        </div>

    )

}

export default Navigation
