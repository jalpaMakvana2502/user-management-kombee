import { Stack } from "@mui/material";
import UsersTable from "./UsersTable";
import UsersFilters from "./UsersFilters";

const Users = () => {
  return (
    <div>
      <Stack gap={2} p={2}>
        <UsersFilters />
        {/* Table */}
        <UsersTable />
      </Stack>
    </div>
  );
};

export default Users;
