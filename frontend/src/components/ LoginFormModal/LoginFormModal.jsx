import { useState, useEffect } from "react"
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
  const disabled = credential.length < 4 || password.length < 6;



  useEffect(() => {
    if (submitted) {
      const newErrors = {};
      if (credential === ""){
        newErrors.credential = "Please provide username or email"
      }

      if (credential.length < 4 ) {
        newErrors.credential = "Username or email must be at least 4 characters long";
      }



      setErrors(newErrors);
    }
  }, [credential, submitted]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(true)

    const user = { credential, password }

    return dispatch(loginThunk({ user }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data?.message) setErrors({ credential: data.message });

        }

      );


  };

  const handleDemoUser = ()=> {
    const user = {
      credential: 'demo@user.io',
      password: 'password'
    }

    dispatch(loginThunk({user})).then(()=>{
      closeModal()
    })
  
    
  }



  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.h1}>Log In</h1>
        <form onSubmit={handleSubmit}>
          { submitted && errors.credential && <p className={styles.errors}>{errors.credential}</p>}
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

          <button disabled={disabled} className={styles.buttonLoginForm} type="submit">Log In</button>
          <button
            className={styles.demoButton}
            onClick={handleDemoUser}
          >
            Demo Login
          </button>

        </form>


      </div>

    </>
  );

}

export default LoginFormModal
