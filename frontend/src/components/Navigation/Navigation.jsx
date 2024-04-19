
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import stylesNavigation from './Navigation.module.css';
import logo from '../../images/stayScapelogo.png'



const Navigation = ({ isLoaded }) => {
    const sessionUser = useSelector(state => state.session.user)
    const userLoggedIn = !!sessionUser;


    return (
        <nav>
            <ul className={stylesNavigation.homeLinkContainer}>
            
                    <li >
                        <NavLink to={'/'}>
                            <div>
                                 <img className={stylesNavigation.imgHomeNav} src={logo} alt="Logo" />
                            </div>
                        </NavLink>
                    </li>
            
         

                <div className={stylesNavigation.container} >

                {userLoggedIn && (
                   
                   

                    <li className={stylesNavigation.list}>
                        <NavLink className={stylesNavigation.link} to="/spots/new">Create a New Spot</NavLink>
                    </li>

                 

                )}

                 {isLoaded && (
                    <li >
                        <ProfileButton user={sessionUser} />
                    </li>
                        
                
                )}
                    
                </div>
         
          </ul>

        </nav>

    )

}

export default Navigation
