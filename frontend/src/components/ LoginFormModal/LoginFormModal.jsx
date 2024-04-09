import { useState } from "react"
import { useDispatch } from "react-redux"
import { loginThunk } from "../../store/session"
import { useModal } from '../../context/Modal';
import styles from './LoginForm.module.css'

const LoginFormModal = () => {
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const [submitted, setSubmitted] = useState(false)


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitted(true)
        const user = {credential, password}
   
        return dispatch(loginThunk({ user}))
        .then(closeModal)
        .catch(
          async (res) => {
            const data = await res.json();
            if (data?.message) setErrors({credential: data.message});
         
          }
     
        );
      };


      return (
        <>
        <div className={styles.container}>
        <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
          {errors.credential && submitted && <p>{errors.credential}</p>}
            <label>
  
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                placeholder="Username or Email"
              />
            </label>
            <label>
       
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="password"

              />
            </label>
            
            <button className={styles.buttonLoginForm} type="submit">Log In</button>
          </form>


        </div>
       
        </>
      );

}

export default LoginFormModal
