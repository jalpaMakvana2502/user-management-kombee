import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Users from "./components/users";
import ProtectedRoute from "./components/protectedRoute";
import "./App.css";
import AddEditUser from "./components/addEditUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<Users />} />
          <Route path="/createOrUpdateUser" element={<AddEditUser />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
