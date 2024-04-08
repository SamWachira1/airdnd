import { FaUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../../store/session";
import { useEffect, useState, useRef} from "react";
import styles from './Navigation.module.css';



const ProfileButton = ({user})=> {
    const dispatch = useDispatch()
    const [showMenu, setShowMenu] = useState(false)
    const ulRef = useRef();

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(logoutThunk())
    }

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        setShowMenu(!showMenu);
      };

    useEffect(()=>{
        if (!showMenu) return;

        const closeMenu = (e)=> {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
             }
        }
      
        document.addEventListener('click', closeMenu)
        return () => document.removeEventListener('click', closeMenu);
    },[showMenu])

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden")

    return (

        <>
        <div className={styles.profileButtonContainer}>
            <button className={styles.profileButton} onClick={toggleMenu}>
                <FaUserCircle size={'2em'}/>
            </button>
            <ul className={`${ulClassName} ${showMenu ? '' : styles.hidden}`} ref={ulRef}>
                <li>{user.username}</li>
                <li>{user.firstName} {user.lastName}</li>
                <li>{user.email}</li>
                <li>
                    <button onClick={handleLogout}>Log Out</button>
                </li>
            </ul>
        </div>
      

        </>

    )

}

export default ProfileButton
