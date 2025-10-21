import './App.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import RootLayout from "./layout/RootLayout";

//pages
import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import AddDestination from "./pages/AddDestination";
import AddEntry from "./pages/AddEntry";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout/>,
        children: [
            {index: true, element: <Home/>},
            {path: "destinations", element: <Destinations />},
            {path: "destinations/:id", element: <DestinationDetail/>},
            {path: "add-destination", element:<AddDestination/>},
            {path: "add-entry", element:<AddEntry/>},
            {path: "login", element:<Login/>},
            {path: "*", element: <NotFound/>},
        ],
    },
])

export default function App() {
    return <RouterProvider router = {router} />
}
