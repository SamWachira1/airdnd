import { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { signUpThunk } from "../../store/session"
import { useModal } from '../../context/Modal';
import styles from './SignupForm.module.css'


const SignupFormModal = () => {

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmedPassword, setConfirmedPassword] = useState("")
    const [errors, setErrors] = useState({})
    const { closeModal } = useModal();
    const [submitted, setSubmitted] = useState(false)
    const dispatch = useDispatch()

    useEffect(()=>{
        const newErrors = {};

        if (!username || username.length < 4) {
            newErrors.username = "Username must be at least 4 characters long";
        }

        if (!password || password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long";
        }
        
        if (password !== confirmedPassword){
             newErrors.confirmPassword = 'Passwords must match'
        }

        if (!email) {
            newErrors.email = "Email is required";
        }

        if(!firstName){
            newErrors.firstName = 'First Name is required'
        }

        if (!lastName){
            newErrors.lastName = 'Last Name is required'
        }

        setErrors(newErrors);
      
    },[submitted, username, firstName, lastName, email, password, confirmedPassword])

   

    const handleSubmit = async (e) => {
        e.preventDefault()

        setSubmitted(true)

        if (Object.keys(errors).length === 0 && password === confirmedPassword) {
            setErrors({})
            const user = { username, firstName, lastName, email, password }
            return dispatch(signUpThunk({ user }))
            .then(closeModal)
            .catch(
                async (res) => {
                    const data = await res.json()
                    if (data?.errors) {
                        setErrors(data.errors);
                    }

                }

            )

        } 
    }


    return (
        <>
            <div className={styles.container}>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    {errors.username && submitted && <p className={styles.error}>{errors.username}</p>}
                    <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="username"
                        />
                    </label>

                    {errors.firstName && submitted && <p className={styles.error}>{errors.firstName}</p>}
                    <label>
                        First Name
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            placeholder="first name"
                        />
                    </label>
                    {errors.lastName && submitted && <p className={styles.error}>{errors.lastName}</p>}
                    <label>
                        Last Name
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            placeholder="last name"
                        />
                    </label>
                    {errors.email && submitted && <p className={styles.error}>{errors.email}</p>}
                    <label>
                        Email
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email"
                        />
                    </label>
                    {errors.password && submitted && <p className={styles.error}>{errors.password}</p>}
                    <label>
                        Password
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="password"
                        />
                    </label>
                    {errors.confirmPassword && submitted && <p className={styles.error}>{errors.confirmPassword}</p>}
                    <label>
                        Confirm Password
                        <input
                            type="password"
                            value={confirmedPassword}
                            onChange={(e) => setConfirmedPassword(e.target.value)}
                            required
                            placeholder="confirm password"
                        />
                    </label>

                    <button disabled={submitted && Object.values(errors).length > 0} className={styles.buttonSignUpForm} type="submit">Sign Up!</button>

                </form>

            </div>

        </>
    )
}

export default SignupFormModal
