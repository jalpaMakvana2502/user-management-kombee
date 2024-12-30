import {
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { RootState } from "../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteOutline,
  EditOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { deleteUserById, fetchAllUser } from "../service/services";
import {
  setSelectedUsers,
  setUsersList,
  setUserPagination,
  setUserSort,
} from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { IUser } from "../types/user";
import LoadingButton from "../components/LoadingButton";
import { ViewUserDetails } from "./ViewUserDetails";

const tableColumns = [
  {
    id: "name",
    label: "Name",
    sortable: true,
    render: (row: IUser) => row.name,
  },
  {
    id: "email",
    label: "Email",
    sortable: true,
    render: (row: IUser) => row.email,
  },
  {
    id: "role",
    label: "Role",
    render: (row: IUser) => row.role.name,
  },
  {
    id: "dob",
    label: "DOB",
    render: (row: IUser) => row.dob,
  },
  {
    id: "gender",
    label: "Gender",
    render: (row: IUser) => (row.gender === "0" ? "Female" : "Male"),
  },
  {
    id: "status",
    label: "Status",
    render: (row: IUser) =>
      row.status === "1" ? (
        <Chip label="Active" color="success" size="small" />
      ) : (
        <Chip label="Inactive" color="error" size="small" />
      ),
  },
];

function UsersTable() {
  const navigate = useNavigate();
  const [tableLoading, setTableLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const [userToView, setUserToView] = useState<IUser | null>(null);

  const usersList = useSelector((state: RootState) => state.user.usersList);
  const userTableSearch = useSelector(
    (state: RootState) => state.user.userTableSearch
  );
  const userTableFilter = useSelector(
    (state: RootState) => state.user.userTableFilter
  );
  const userTablePagination = useSelector(
    (state: RootState) => state.user.userTablePagination
  );
  const userTableSort = useSelector(
    (state: RootState) => state.user.userTableSort
  );
  const selectedUsers = useSelector(
    (state: RootState) => state.user.selectedUsers
  );
  const refreshRef = useSelector((state: RootState) => state.user.refreshRef);

  const dispatch = useDispatch();

  const getUsersList = useCallback(async () => {
    try {
      dispatch(setSelectedUsers([]));
      setTableLoading(true);
      dispatch(setUsersList([]));
      const response = await fetchAllUser(
        userTableSearch,
        userTableFilter,
        userTableSort.sort,
        userTableSort.orderBy,
        userTablePagination.page,
        userTablePagination.rowsPerPage
      );
      dispatch(setUsersList(response.data));
      dispatch(
        setUserPagination({
          total: response.total,
        })
      );
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setTableLoading(false);
    }
  }, [
    dispatch,
    userTableFilter,
    userTablePagination.page,
    userTablePagination.rowsPerPage,
    userTableSearch,
    userTableSort.orderBy,
    userTableSort.sort,
  ]);

  useEffect(() => {
    getUsersList();
  }, [getUsersList, refreshRef]);

  const handlePageChange = (event: unknown, newPage: number) => {
    dispatch(
      setUserPagination({
        page: newPage + 1,
      })
    );
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      setUserPagination({
        rowsPerPage: event.target.value,
        page: 1,
      })
    );
  };

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      let orderBy = "asc";
      if (userTableSort.sort === property) {
        orderBy = userTableSort.orderBy === "asc" ? "desc" : "asc";
      }
      dispatch(
        setUserSort({
          orderBy,
          sort: property,
        })
      );
    };

  const handleCheckboxChange = (id: string) => {
    const newSelectedUsers = selectedUsers.includes(id)
      ? selectedUsers.filter((selectedId) => selectedId !== id)
      : [...selectedUsers, id];
    dispatch(setSelectedUsers(newSelectedUsers));
  };

  const handleOpenDeleteDialog = (userId: string) => {
    setShowDeleteConfirmation(true);
    setUserToDelete(userId ?? null);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) setShowDeleteConfirmation(false);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await deleteUserById(userToDelete);
      getUsersList();
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setDeleting(false);
    }

    handleCloseDeleteDialog();
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={
                    usersList.length > 0 &&
                    selectedUsers.length === usersList.length
                  }
                  indeterminate={
                    usersList.length > 0 &&
                    selectedUsers.length > 0 &&
                    selectedUsers.length < usersList.length
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      dispatch(
                        setSelectedUsers(usersList.map((user) => user.id))
                      );
                    } else {
                      dispatch(setSelectedUsers([]));
                    }
                  }}
                />
              </TableCell>
              {tableColumns.map((column) => (
                <TableCell key={column.id}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={userTableSort.sort === column.id}
                      direction={
                        userTableSort.sort === column.id
                          ? userTableSort.orderBy
                          : "asc"
                      }
                      onClick={createSortHandler(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : usersList.length > 0 ? (
              usersList.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  {tableColumns.map((column) => (
                    <TableCell key={column.id}>{column.render(user)}</TableCell>
                  ))}
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => setUserToView(user)}
                    >
                      <VisibilityOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="warning"
                      onClick={() => navigate(`/users/${user.id}`)}
                    >
                      <EditOutlined />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleOpenDeleteDialog(user.id)}
                    >
                      <DeleteOutline />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 20]}
                count={userTablePagination.total} // Total number of users
                rowsPerPage={userTablePagination.rowsPerPage} // Current rows per page
                page={userTablePagination.page - 1} // Current page
                onPageChange={handlePageChange} // Handle page change
                onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Dialog open={!!showDeleteConfirmation} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <LoadingButton
            onClick={handleDeleteUser}
            color="secondary"
            loading={deleting}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>

      <ViewUserDetails user={userToView} onClose={() => setUserToView(null)} />
    </>
  );
}

export default UsersTable;
