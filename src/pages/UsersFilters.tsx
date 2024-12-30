import {
  AddOutlined,
  DeleteOutline,
  SaveAltOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  refreshUserTable,
  setUserFilter,
  setUserPagination,
  setUserSearch,
} from "../redux/userSlice";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import LoadingButton from "../components/LoadingButton";
import { deleteMultipleUsers, exportUsers } from "../service/services";
import { useCallback, useEffect, useState } from "react";
import useDebouncedValue from "../hooks/useDeboucedValue";
import { RolesSelector } from "../components/RolesSelector";

function UsersFilters() {
  const userTableSearch = useSelector(
    (state: RootState) => state.user.userTableSearch
  );
  const userTableFilter = useSelector(
    (state: RootState) => state.user.userTableFilter
  );

  const userTableSort = useSelector(
    (state: RootState) => state.user.userTableSort
  );

  const selectedUsers = useSelector(
    (state: RootState) => state.user.selectedUsers
  );

  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState(userTableSearch);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const debouncedSearch = useDebouncedValue({ value: searchTerm, timer: 300 });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const resetPagination = useCallback(
    () =>
      dispatch(
        setUserPagination({
          page: 1,
        })
      ),
    [dispatch]
  );

  useEffect(() => {
    dispatch(setUserSearch(debouncedSearch));
    resetPagination();
  }, [debouncedSearch, dispatch, resetPagination]);

  const exportHandler = async () => {
    try {
      setLoading(true);
      const resp = await exportUsers(
        userTableSearch,
        userTableFilter,
        userTableSort.sort,
        userTableSort.orderBy
      );
      const blob = new Blob([resp], { type: "text/csv" });

      // Create a download link
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "users.csv";

      // Trigger the download
      link.click();
      link.remove();
    } catch (err) {
      console.log("err :>> ", err);
    } finally {
      setLoading(false);
    }
  };

  const filterChangeHandler = (id: string) => {
    dispatch(setUserFilter(id));
    resetPagination();
  };

  const handleOpenDeleteDialog = () => {
    setShowDeleteConfirmation(true);
  };

  const handleCloseDeleteDialog = () => {
    if (!deleting) setShowDeleteConfirmation(false);
  };

  const handleDeleteUser = async () => {
    if (selectedUsers.length > 0) {
      try {
        setDeleting(true);
        await deleteMultipleUsers(selectedUsers);
        dispatch(refreshUserTable());
      } catch (error) {
        console.error("Error deleting multiple users:", error);
      } finally {
        setDeleting(false);
      }
    } else {
      alert("No users selected for deletion.");
    }
    handleCloseDeleteDialog();
  };

  return (
    <>
      <Stack direction={{ xs: "column", sm: "row" }} width="100%" gap={2}>
        <Box flex={1}>
          <Box>
            <TextField
              fullWidth
              size="small"
              placeholder="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>
        <Stack flex={1} direction="row" width="100%" gap={2}>
          <Box flexGrow={1}>
            <RolesSelector
              value={userTableFilter}
              onChange={(id: string) => filterChangeHandler(id)}
            />
          </Box>
          {selectedUsers.length > 1 && (
            <Box>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleOpenDeleteDialog()}
              >
                <DeleteOutline />
              </IconButton>
            </Box>
          )}
          <Box>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddOutlined />}
              onClick={() => navigate("/users/add")}
              sx={{ textWrap: "nowrap" }}
            >
              Add User
            </Button>
          </Box>
          <Box>
            <LoadingButton
              variant="contained"
              startIcon={<SaveAltOutlined />}
              onClick={exportHandler}
              loading={loading}
            >
              Export
            </LoadingButton>
          </Box>
        </Stack>
      </Stack>
      <Dialog open={!!showDeleteConfirmation} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deleteselected users?
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
    </>
  );
}

export default UsersFilters;
