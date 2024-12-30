import { Grid2, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <Grid2 container component="main" sx={{ height: "100vh" }}>
      <Grid2
        size={{
          xs: false,
          sm: 4,
          md: 7,
        }}
        sx={{
          backgroundImage: "url(/assets/Image/bg-4.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundColor: (t) =>
            t.palette.mode === "light"
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <Grid2
        size={{
          xs: 12,
          sm: 8,
          md: 5,
        }}
        component={Paper}
        elevation={0}
        square
        margin="auto"
      >
        <Outlet />
      </Grid2>
    </Grid2>
  );
};

export default AuthLayout;
