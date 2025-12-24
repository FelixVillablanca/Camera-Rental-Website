
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Pages/Client_Interface/Home";
import AdminPanel from "./Pages/Admin_Interface/AdminPanel";
import ManageProducts from "./Pages/Admin_Interface/ManageProducts";
import CameraGUI from "./Pages/Client_Interface/CameraGUI";
import Reservations from "./Pages/Client_Interface/Reservations";
import TransactionDetails from "./Pages/Client_Interface/TransactionDetails";
import Profile from "./Pages/Client_Interface/Profile/Profile";

export default function Root_Router_App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/AdminPanel" element={<AdminPanel />}></Route>
                <Route path="/ManageProducts" element={<ManageProducts />}></Route>
                <Route path="/Camera/:Cam_id" element={<CameraGUI />}></Route>
                <Route path="/Reservations/:user_id" element={<Reservations />}></Route>
                <Route path="/TransactionDetails/:transaction_ID" element={<TransactionDetails />} ></Route>
                <Route path="/Profile" element={<Profile />}></Route>
            </Routes>
        </BrowserRouter>
    )
}