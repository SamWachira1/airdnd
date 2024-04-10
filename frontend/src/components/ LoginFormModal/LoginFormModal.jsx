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


  useEffect(() => {
    if (submitted) {
      const newErrors = {};
      if (credential.length < 4) {
        newErrors.credential = "Username or email must be at least 4 characters long";
      }
      if (password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long";
      }
      setErrors(newErrors);
    }
  }, [credential, password, submitted]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
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
      history.push('/')
    })
  
    
  }



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

          <button disabled={submitted && Object.values(errors).length > 0} className={styles.buttonLoginForm} type="submit">Log In</button>
          <button
            className={styles.buttonLoginForm}
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
