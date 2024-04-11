import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreUserThunk } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage ";
import SpotDetail from "./components/SpotDetail";

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
  
      <Navigation isLoaded={isLoaded}/>
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
        element: <LandingPage/>
      },

      {
        path: '/spots/:spotId',
        element: <SpotDetail/>
      }
      
    ]

  }


])


function App() {
  return <RouterProvider router={router} />
}

export default App;
