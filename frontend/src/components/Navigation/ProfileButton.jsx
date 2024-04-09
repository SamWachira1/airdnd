import { FaUserCircle } from "react-icons/fa";
import { VscThreeBars } from "react-icons/vsc";

import { useDispatch } from "react-redux";
import { logoutThunk } from "../../store/session";
import { useEffect, useState, useRef } from "react";
import styles from './Navigation.module.css';
import LoginFormModal from "../ LoginFormModal/LoginFormModal"
import SignupFormModal from "../SignUpFormModal/SignupFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";


const ProfileButton = ({ user }) => {
    const dispatch = useDispatch()
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
    }

    return (

        <>
            <button className={styles.profileButton} onClick={toggleMenu}>
                <VscThreeBars size={'2em'} />
                <FaUserCircle size={'2em'} />
            </button>
            <ul className={showMenu ? styles.profileDropdown : styles.hidden} ref={ulRef}>
                {user ? (
                    <>
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <li>
                            <button onClick={handleLogout}>Log Out</button>
                        </li>
                    </>
                ) : (
                    <>
                        <OpenModalMenuItem  // do not nest under an li
                            itemText="Log In"
                            modalComponent={<LoginFormModal />}
                        />
                        <OpenModalMenuItem
                            itemText="Sign Up"
                            modalComponent={<SignupFormModal />}
                        />
                    </>
                )}
            </ul>


        </>

    )

}

export default ProfileButton
