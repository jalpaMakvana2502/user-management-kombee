import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableFooter,
  TablePagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  SelectChangeEvent,
} from "@mui/material";
import {
  FilterList as FilterListIcon,
  Add as AddIcon,
  SaveAlt as SaveAltIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  deleteUser,
  getUserList,
  deleteMultipleUser,
} from "../redux/userSlice";
import {
  deleteMultipleUsers,
  deleteUserById,
  fetchAllUser,
} from "../service/services";
import { useNavigate } from "react-router-dom";
import Navbar from "./navBar";

const Users = () => {
  const dispatch = useDispatch();
  const usersList = useSelector((state: RootState) => state.user.usersList);
  const navigate = useNavigate();

  const [filteredUsers, setFilteredUsers] = useState(usersList);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [totalUsers, setTotalUsers] = useState(0);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteType, setDeleteType] = useState<"single" | "multiple">("single");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    setFilteredUsers(usersList);
    setTotalUsers(usersList.length);
  }, [usersList]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetchAllUser(
          search,
          sort,
          page + 1,
          rowsPerPage
        );
        dispatch(getUserList(response.data));
        setTotalUsers(response.total);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    getUserData();
  }, [dispatch, search, sort, page, rowsPerPage]);

  const handlePageChange = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  const createOrUpdateUser = (userId: string | null) => {
    if (userId && userId !== "null") {
      navigate(`/createOrUpdateUser?id=${userId}`);
    } else {
      navigate("/createOrUpdateUser");
    }
  };

  const handleOpenDeleteDialog = (
    type: "single" | "multiple",
    userId?: string
  ) => {
    setDeleteType(type);
    // setSelectedIds(userId || []);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedIds([]);
  };

  const handleDeleteUser = async () => {
    if (deleteType === "single" && selectedIds) {
      try {
        await deleteUserById(selectedIds);
        dispatch(deleteUser(selectedIds));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else if (deleteType === "multiple") {
      const selectedIdss = usersList
        .filter((user) => user.selected)
        .map((user) => user.id);
      if (selectedIdss.length > 0) {
        try {
          await deleteMultipleUsers(selectedIdss);
          dispatch(deleteMultipleUser(selectedIdss));
        } catch (error) {
          console.error("Error deleting multiple users:", error);
        }
      } else {
        alert("No users selected for deletion.");
      }
    }
    handleCloseDeleteDialog();
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(usersList.map((item: any) => item.id));
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  const handleFilterChange = (event: SelectChangeEvent<string>) => {
    const selectedRole = event.target.value;
    setFilterOption(selectedRole);

    if (selectedRole === "") {
      // If no filter is selected, show all users
      setFilteredUsers(usersList);
      setTotalUsers(usersList.length);
    } else {
      // Filter users based on selected role
      const filtered = usersList.filter(
        (user) => user.role.name === selectedRole
      );
      setFilteredUsers(filtered);
      setTotalUsers(filtered.length);
    }
    setPage(0);
  };

  const handleExportToCSV = () => {
    exportToCSV(usersList, "exported_data.csv");
  };

  const exportToCSV = (data: any[], fileName: string) => {
    const csvRows: string[] = [];

    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(","));

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ("" + row[header]).replace(/"/g, '\\"'); //
        return `"${escaped}"`;
      });
      csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", fileName);
    a.click();
    window.URL.revokeObjectURL(url); // Clean up
  };

  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "10px 20px",
        }}
      >
        <div>
          <TextField
            size="small"
            placeholder="Search"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <FormControl
          size="small"
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sort}
            onChange={(e) => setSort(e.target.value)} // Update sort state
            label="Sort By"
            style={{ width: "150px" }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="email">Email</MenuItem>
            <MenuItem value="role">Role</MenuItem>
          </Select>
        </FormControl>
        <FormControl
          size="small"
          variant="outlined"
          style={{ marginRight: "10px" }}
        >
          <InputLabel>Filter By</InputLabel>
          <Select
            value={filterOption}
            onChange={handleFilterChange}
            label="Filter By"
            renderValue={(selected) => (selected ? selected : "Role")}
          >
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Sub Admin">Sub Admin</MenuItem>
            <MenuItem value="Customer">Customer</MenuItem>
          </Select>
        </FormControl>
        <div>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            style={{ marginRight: "10px" }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            style={{ marginRight: "10px" }}
            onClick={() => createOrUpdateUser(null)}
          >
            {"Add User"}
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveAltIcon />}
            style={{ marginRight: "10px" }}
            onClick={handleExportToCSV}
          >
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox checked={isAllSelected} onChange={handleSelectAll} />{" "}
                Name
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>DOB</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(user.id)}
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role.name}</TableCell>
                  <TableCell>{user.dob}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => createOrUpdateUser(user.id)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="secondary"
                      onClick={() => handleOpenDeleteDialog("single", user.id)}
                    >
                      <DeleteIcon />
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
                rowsPerPageOptions={[5]}
                count={totalUsers} // Total number of users
                rowsPerPage={rowsPerPage} // Current rows per page
                page={page} // Current page
                onPageChange={handlePageChange} // Handle page change
                onRowsPerPageChange={handleRowsPerPageChange} // Handle rows per page change
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            {deleteType === "multiple" ? "selected users" : "this user"}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
