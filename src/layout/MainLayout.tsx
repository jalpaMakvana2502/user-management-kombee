import { Outlet } from "react-router-dom";
import Navbar from "../components/navBar";
import { Container } from "@mui/material";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default MainLayout;
