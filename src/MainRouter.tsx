import { Navigate, Route, Routes } from "react-router-dom";
import Users from "./pages/user";
import AddEditUser from "./pages/add-edit-user";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import Login from "./pages/login";
import AuthLayout from "./layout/AuthLayout";
import MainLayout from "./layout/MainLayout";

const MainRouter = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  return (
    <Routes>
      {!token ? (
        <>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Login />} />
          </Route>
          <Route path="*" element={<Navigate to={"/"} />} />
        </>
      ) : (
        <>
          <Route element={<MainLayout />}>
            <Route path="/users" element={<Users />} />
            <Route path="/users/add" element={<AddEditUser />} />
            <Route path="/users/:userId" element={<AddEditUser />} />
          </Route>
          <Route path="*" element={<Navigate to={"/users"} />} />
        </>
      )}
      <Route path="*" element={<>Not Found</>} />
    </Routes>
  );
};

export default MainRouter;
