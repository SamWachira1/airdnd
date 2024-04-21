import { FaUserCircle } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";

import { useDispatch } from "react-redux";
import { logoutThunk } from "../../store/session";
import { useEffect, useState, useRef } from "react";
import styles from './Navigation.module.css';
import LoginFormModal from "../ LoginFormModal/LoginFormModal"
import SignupFormModal from "../SignUpFormModal/SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { NavLink} from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const ProfileButton = ({ user }) => {
    const dispatch = useDispatch()
    const nav = useNavigate()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef();

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu])

    const closeMenu = () => setShowMenu(false);


    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logoutThunk())
        closeMenu()

       nav('/')
    }


    return (

        <>
            <nav className={styles.mainContainer}>
            <button className={styles.loginIcons} onClick={toggleMenu}>
                <VscThreeBars size={'2em'} />
                <FaUserCircle size={'2em'} />
            </button>

          
            <ul className={showMenu ? styles.profileDropdown : styles.hidden} ref={ulRef}>
                {user ? (
                    <>
                        <div className={styles.menuItem1}>
                        <li>Hello, {user.firstName}</li>
                        </div>

                        <div className={styles.menuItem2}>
                            <li>{user.email}</li>
                        </div>

                        <div className={styles.menuItem3}>
                            <li>
                                <NavLink className={styles.manageSpotTitle} to={'/spots/current'}>Manage Spots</NavLink>
                           </li>
                        </div>

                        <li >
                            <button className={styles.buttonContainer}  onClick={handleLogout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <div className={styles.menuItem}>

                        <OpenModalMenuItem  // do not nest under an li
                            itemText="Log In"
                            modalComponent={<LoginFormModal />}
                          
                        />
                        </div>

                        <div className={styles.menuItem}>

                        <OpenModalMenuItem
                            itemText="Sign Up"
                            modalComponent={<SignupFormModal />}
                        />
                        </div>
                    </>
                )}
            </ul>

           </nav>

        </>

    )

}

export default ProfileButton
