import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/pages/user/register";
import { Toaster } from "react-hot-toast";
import Home from "./components/pages/home";
import Login from "./components/pages/user/login";
import socketIO from "socket.io-client";
import { useEffect } from "react";
import ProtectedRoutes from "./utils/protectedRoutes";
const socket = socketIO.connect("http://localhost:9000");

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedRoutes admin={false} />}>
            <Route path="/home" element={<Home socket={socket} />} />
          </Route>
        </Routes>
        <Toaster />
      </Router>
    </>
  );
}

export default App;
