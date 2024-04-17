import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreUserThunk } from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage ";
import SpotDetail from "./components/SpotDetail";
import SpotForm from "./components/NewSpot/NewSpotForm";
import ManageSpots from "./components/ManageSpots";
import UpdateSpotForm from "./components/UpdateForm";

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
      },

      {
        path: '/spots/new',
        element: <SpotForm/>
      },

      {
        path: '/spots/current',
        element: <ManageSpots/>
      },

      {
        path: '/spots/:spotId/edit',
        element: <UpdateSpotForm/>
      },


      
    ]

  }


])


function App() {
  return <RouterProvider router={router} />
}

export default App;
