import React, { useCallback, useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid2,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Switch,
  FormHelperText,
  Stack,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { createUser, fetchUserById, updateUserById } from "../service/services";
import { useNavigate, useParams } from "react-router-dom";
import { RolesSelector } from "../components/RolesSelector";
import LoadingButton from "../components/LoadingButton";

interface FormData {
  name: string;
  email: string;
  password?: string;
  role_id: string;
  dob: string;
  profile: File | null;
  gender: string;
  status: string;
  user_galleries: File[];
  user_pictures: File[];
}

const initialValue = {
  name: "",
  email: "",
  password: "",
  role_id: "",
  dob: "",
  profile: null,
  gender: "",
  status: "0",
  user_galleries: [],
  user_pictures: [],
};

const AddEditUser = () => {
  const navigate = useNavigate();

  const { userId } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control,
  } = useForm<FormData>({ defaultValues: initialValue });

  const [formData, setFormData] = useState<FormData>(initialValue);
  const [loading, setLoading] = useState(false);

  const fetchUserData = useCallback(
    async (id: string) => {
      try {
        const data = await fetchUserById(id);
        setValue("name", data.data.name, { shouldValidate: true });
        setValue("email", data.data.email, { shouldValidate: true });
        setValue("role_id", data.data.role.id, { shouldValidate: true });
        setValue("dob", data.data.dob, { shouldValidate: true });
        setValue("gender", data.data.gender === "0" ? "0" : "1", {
          shouldValidate: true,
        });
        setValue("status", data.data.status, {
          shouldValidate: true,
        });
      } catch (err) {
        navigate("/users");
      }
    },
    [navigate, setValue]
  );

  useEffect(() => {
    if (userId) fetchUserData(userId);
  }, [fetchUserData, userId]);

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "user_galleries" | "user_pictures" | "profile"
  ) => {
    const files = event.target.files;
    if (files) {
      if (field === "profile") {
        setFormData((prev) => ({
          ...prev,
          profile: files[0], // Only one file for profile photo
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [field]: [...prev[field], ...Array.from(files)],
        }));
      }
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const transformedData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id: data.role_id,
        dob: data.dob,
        gender: data.gender,
        status: data.status,
        profile: formData.profile,
        "user_galleries[]": data.user_galleries,
        "user_pictures[]": data.user_pictures,
      };
      if (userId) {
        delete transformedData?.password;
        await updateUserById(userId, transformedData);
      } else {
        await createUser(transformedData);
      }
      navigate("/users");
    } catch (error) {
      console.error("Error creating user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <div style={{ padding: "20px", margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          {userId ? "Edit" : "Create"} Admin User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={3}>
            {/* Name */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: "Name is required",
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Name"
                    variant="outlined"
                    fullWidth
                    size="small"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid2>

            {/* Email */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email.",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    size="small"
                    type="email"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid2>

            {/* Password */}
            {!userId && (
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                  }}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      label="Password"
                      variant="outlined"
                      type="password"
                      size="small"
                      fullWidth
                      {...field}
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid2>
            )}

            {/* Role */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name="role_id"
                control={control}
                rules={{
                  required: "Role is required",
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <RolesSelector
                      value={field.value}
                      onChange={(id: string) => field.onChange(id)}
                      disableClearable
                      error={!!error}
                    />
                    {error && (
                      <FormHelperText error>{error.message}</FormHelperText>
                    )}
                  </>
                )}
              />
            </Grid2>

            {/* DOB */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Controller
                name="dob"
                control={control}
                rules={{
                  required: "DOB is required",
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    label="DOB"
                    variant="outlined"
                    fullWidth
                    type="date"
                    size="small"
                    {...field}
                    error={!!error}
                    helperText={error?.message}
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                )}
              />
            </Grid2>

            {/* Profile */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">Upload Profile Photo</Typography>
              <Controller
                name="profile"
                control={control}
                rules={{
                  required: {
                    value: !userId,
                    message: "Profile is required",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <>
                    <TextField
                      // label="Profile"
                      variant="standard"
                      fullWidth
                      type="file"
                      size="small"
                      {...field}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        handleFileUpload(e, "profile");
                        field.onChange(e);
                      }}
                      error={!!error}
                      helperText={error?.message}
                    />
                  </>
                )}
              />
            </Grid2>

            {/* Gender */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Gender</FormLabel>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Gender is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <RadioGroup
                        row
                        value={field.value}
                        onChange={(_, value) => {
                          field.onChange(value);
                        }}
                      >
                        <FormControlLabel
                          value="0"
                          control={<Radio />}
                          label="Female"
                        />
                        <FormControlLabel
                          value="1"
                          control={<Radio />}
                          label="Male"
                        />
                      </RadioGroup>
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid2>

            {/* Status */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Status</FormLabel>
                <Controller
                  name="status"
                  control={control}
                  rules={{ required: "Status is required" }}
                  render={({ field, fieldState: { error } }) => (
                    <>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={field.value === "1"}
                            onChange={(e) =>
                              field.onChange(e.target.checked ? "1" : "0")
                            }
                          />
                        }
                        label={formData.status ? "Active" : "Inactive"}
                      />
                      {error && (
                        <FormHelperText error>{error.message}</FormHelperText>
                      )}
                    </>
                  )}
                />
              </FormControl>
            </Grid2>

            {/* User Galleries */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">
                Upload User Galleries (0/5)
              </Typography>
              <TextField
                type="file"
                variant="standard"
                fullWidth
                slotProps={{
                  htmlInput: {
                    type: "file",
                    multiple: true,
                    max: 5,
                  },
                }}
                {...register("user_galleries", {
                  required: {
                    value: !userId,
                    message: "User Gallery is required",
                  },
                })}
                error={!!errors.user_galleries}
                helperText={
                  errors.user_galleries ? errors.user_galleries.message : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, "user_galleries")
                }
              />
            </Grid2>

            {/* User Pictures */}
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Typography variant="body2">
                Upload User Pictures (0/5)
              </Typography>
              <TextField
                type="file"
                variant="standard"
                fullWidth
                {...register("user_pictures", {
                  required: {
                    value: !userId,
                    message: "User Pictures is required",
                  },
                })}
                error={!!errors.user_galleries}
                helperText={
                  errors.user_galleries ? errors.user_galleries.message : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, "user_pictures")
                }
              />
            </Grid2>

            {/* Submit and Cancel */}
            <Grid2 size={{ xs: 12 }}>
              <Stack direction="row" alignItems="center" gap={2}>
                <LoadingButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  loading={loading}
                >
                  Submit
                </LoadingButton>
                <Button
                  type="reset"
                  variant="outlined"
                  color="primary"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </Button>
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </div>
    </>
  );
};
export default AddEditUser;
