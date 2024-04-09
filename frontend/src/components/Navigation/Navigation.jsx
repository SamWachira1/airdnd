// import { NavLink } from "react-router-dom"
// import { useSelector } from "react-redux"
// import { logoutThunk } from "../../store/session"
// import ProfileButton from "./ProfileButton"
// import { FaUserCircle } from "react-icons/fa";
// import { useState } from "react";
// import OpenModalButton from '../OpenModalButton/OpenModalButton';
// import LoginFormModal from '../ LoginFormModal/LoginFormModal';
// import SignupFormModal from "../SignUpFormModal/SignupFormModal";


import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import styles from './Navigation.module.css';
import logo from '../../../public/images/stayScapelogo.png'



const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user)

    // const sessionLinks = sessionUser ? (
    //     <>
    //         <li>
    //             <ProfileButton user={sessionUser} />
    //         </li>

    //     </>
    // ) : (
    //     <>
    //         <div className={styles.profileButtonContainer}>
    //             <button className={styles.profileButton} onClick={() => setShowMenu(!showMenu)}>
    //                 <FaUserCircle size={'2em'} />
    //             </button>
    //             <ul className={showMenu ? styles.profileDropdown : styles.hidden}>
    //                 <li>
    //                     <OpenModalButton
    //                         buttonText="Log In"
    //                         modalComponent={<LoginFormModal />}
    //                     />
    //                 </li>
    //                 <li>
    //                      <OpenModalButton
    //                         buttonText="Sign Up"
    //                         modalComponent={<SignupFormModal />}
    //                     />
    //                 </li>
    //             </ul>

    //         </div>


    //     </>

    // )

    return (

        <ul className={styles.homeLinkContainer}>
            <li >
                <NavLink to={'/'}>
                    <img src={logo} alt="Logo" />
                </NavLink>
            </li>
            {isLoaded && (
                <li>
                    <ProfileButton user={sessionUser} />
                </li>
            )}
        </ul>



    )

}

export default Navigation
