// frontend/src/App.jsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";

import Home from "./pages/Home";
import Destinations from "./pages/Destinations";
import DestinationDetail from "./pages/DestinationDetail";
import AddDestination from "./pages/AddDestination";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Moderation from "./pages/Moderation";
import UsersAdmin from "./pages/UsersAdmin";
import Tags from "./pages/Tags";
import Journals from "./pages/Journals";
import JournalEditor from "./pages/JournalEditor";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { index: true, element: <Home /> },
            { path: "destinations", element: <Destinations /> },
            { path: "destinations/:id", element: <DestinationDetail /> },
            { path: "add-destination", element: <AddDestination /> },

            { path: "login", element: <Login /> },
            { path: "register", element: <Register /> },
            { path: "profile", element: <Profile /> },

            { path: "moderation", element: <Moderation /> },
            { path: "users", element: <UsersAdmin /> },
            { path: "tags", element: <Tags /> },

            { path: "journals", element: <Journals /> },
            { path: "journals/new", element: <JournalEditor mode="create" /> },
            { path: "journals/:id/edit", element: <JournalEditor mode="edit" /> },

            { path: "*", element: <NotFound /> },
        ],
    },
]);

export default function App() {
    return <RouterProvider router={router} />;
}
