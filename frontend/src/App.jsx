import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignUpForm";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreUserThunk } from "./store/session";

function Layout() {
  const [isLoaded, setIsLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(restoreUserThunk()).then(() => {
      setIsLoaded(true)
    })
  }, [dispatch])


  return (
    <>
      {isLoaded && <Outlet />}

    </>
  )

}

const router = createBrowserRouter([

  {
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <h1>Welcome!</h1>
      },

      {
        path: '/login',
        element: <LoginFormPage />
      },

      {
        path: '/signup',
        element: <SignupFormPage />
      }
    ]

  }


])


function App() {
  return <RouterProvider router={router} />
}

export default App;
