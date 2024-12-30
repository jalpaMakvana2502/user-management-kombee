import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Autocomplete, TextField } from "@mui/material";
import { setRolesList, setRolesLoading } from "../redux/userSlice";
import { getRoles } from "../service/services";

interface IRoleSelectorProps {
  value: string | null;
  onChange: (id: string) => void;
  disableClearable?: boolean;
  error?: boolean;
}

export const RolesSelector = ({
  value,
  onChange,
  disableClearable,
  error,
}: IRoleSelectorProps) => {
  const rolesLoading = useSelector(
    (state: RootState) => state.user.rolesLoading
  );
  const rolesList = useSelector((state: RootState) => state.user.rolesList);

  const dispatch = useDispatch();

  const fetchRules = useCallback(async () => {
    try {
      dispatch(setRolesLoading(true));
      const resp = await getRoles();
      dispatch(setRolesList(resp));
    } catch (err) {
      console.log("err :>> ", err);
    } finally {
      dispatch(setRolesLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    if (!rolesList.length) {
      fetchRules();
    }
  }, [fetchRules, rolesList.length]);

  return (
    <Autocomplete
      loading={rolesLoading}
      size="small"
      disablePortal
      options={rolesList}
      disableClearable={disableClearable}
      getOptionLabel={(op) => op.name}
      getOptionKey={(op) => op.id}
      value={rolesList.find((role) => role.id === value) || null}
      onChange={(_, value) => onChange(value?.id || "")}
      renderInput={(params) => (
        <TextField {...params} label="Role" error={error} />
      )}
    />
  );
};
