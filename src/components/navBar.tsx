import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <AppBar position="static" style={{ marginBottom: "20px" }}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          User Management
        </Typography>
        <Button
          color="inherit"
          startIcon={<LogoutOutlined />}
          onClick={logoutHandler}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
export default Navbar;
