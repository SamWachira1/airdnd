import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loginThunk } from "../../store/session"
import { Navigate } from 'react-router-dom';

const LoginFormPage = () => {
    const [credential, setCredential] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({})
    const dispatch = useDispatch()
    const sessionUser = useSelector(state => state.session.user)
    const [submitted, setSubmitted] = useState(false)

    if (sessionUser) return <Navigate to="/" replace={true} />;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitted(true)
        const user = {credential, password}
        setErrors({});
        return dispatch(loginThunk({ user})).catch(
          async (res) => {
            const data = await res.json();
            if (data?.message) setErrors({credential: data.message});
         
          }
     
        );
      };


      return (
        <>
          <h1>Log In</h1>
          <form onSubmit={handleSubmit}>
            <label>
              Username or Email
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {errors.credential && submitted && <p>{errors.credential}</p>}
            <button type="submit">Log In</button>
          </form>
        </>
      );

}

export default LoginFormPage
