import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  styled,
  Table,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { IUser } from "../types/user";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const ViewUserDetails = ({
  user,
  onClose,
}: {
  user: IUser | null;
  onClose: () => void;
}) => {
  return user ? (
    <Dialog open={!!user} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>View User: {user.name}</DialogTitle>
      <DialogContent dividers>
        <TableContainer>
          <Table size="small">
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Name</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{user.name}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Email</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{user.email}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Role</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{user.role.name}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">DOB</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>{user.dob}</Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Profile</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>
                  <Link href={user.profile} target="_blank" rel="noreferrer">
                    View
                  </Link>
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Gender</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>
                  {user.gender === "0" ? "Female" : "Male"}
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
            <StyledTableRow>
              <StyledTableCell>
                <Typography fontWeight="bold">Status</Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Typography>
                  {user.status === "1" ? (
                    <Chip label="Active" color="success" size="small" />
                  ) : (
                    <Chip label="Inactive" color="error" size="small" />
                  )}
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  ) : (
    <></>
  );
};
