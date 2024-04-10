
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import stylesNavigation from './Navigation.module.css';
import logo from '../../../public/images/stayScapelogo.png'



const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user)


    return (

        <ul className={stylesNavigation.homeLinkContainer}>
            <li >
                <NavLink to={'/'}>
                    <img className={stylesNavigation.imgHomeNav} src={logo} alt="Logo" />
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
