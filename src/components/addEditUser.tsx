import React, { useState } from "react";
import Navbar from "./navBar";
import {
  TextField,
  Button,
  Grid,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Switch,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { createUser } from "../service/services";
import { useDispatch } from "react-redux";
import { createUpdateUser } from "../redux/userSlice";

interface FormData {
  name: string;
  email: string;
  password: string;
  role_id: string;
  dob: string;
  profile: File | null;
  gender: string;
  status: boolean;
  user_galleries: File[];
  user_pictures: File[];
}

const AddEditUser = () => {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    role_id: "",
    dob: "",
    profile: null,
    gender: "",
    status: false,
    user_galleries: [],
    user_pictures: [],
  });

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
      const transformedData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role_id:
          data.role_id === "Admin" ? 2 : data.role_id === "Sub Admin" ? 3 : 4,
        dob: data.dob,
        gender: data.gender === "Female" ? 0 : 1,
        status: data.status ? 1 : 0,
        profile: data.profile,
        user_galleries: data.user_galleries,
        user_pictures: data.user_pictures,
      };
      const response = await createUser(transformedData);
      dispatch(createUpdateUser(response));
      console.log("User  created successfully:", response);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px", margin: "0 auto" }}>
        <Typography variant="h5" gutterBottom>
          Create Admin User
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            {/* Name */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
              />
            </Grid>

            {/* Password */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                variant="outlined"
                fullWidth
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password ? errors.password.message : ""}
              />
            </Grid>

            {/* Role */}
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Role"
                variant="outlined"
                fullWidth
                {...register("role_id", { required: "Role is required" })}
                error={!!errors.role_id}
                helperText={errors.role_id ? errors.role_id.message : ""}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Sub Admin">Sub Admin</MenuItem>
                <MenuItem value="Customer">Customer</MenuItem>
              </TextField>
            </Grid>

            {/* DOB */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="DOB"
                type="date"
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
                {...register("dob", { required: "Date of birth is required" })}
                error={!!errors.dob}
                helperText={errors.dob ? errors.dob.message : ""}
              />
            </Grid>

            {/* Profile */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">Upload Profile Photo</Typography>
              <TextField
                label="Profile"
                type="file"
                variant="standard"
                fullWidth
                {...register("profile", {
                  required: "Profile photo is required",
                })}
                error={!!errors.profile}
                helperText={errors.profile ? errors.profile.message : ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, "profile")
                }
              />
            </Grid>

            {/* Gender */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  row
                  {...register("gender", { required: "Gender is required" })}
                >
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
                {errors.gender && (
                  <Typography color="error">{errors.gender.message}</Typography>
                )}
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" fullWidth>
                <FormLabel component="legend">Status</FormLabel>
                <FormControlLabel
                  control={
                    <Switch
                      {...register("status")}
                      checked={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked,
                        })
                      }
                    />
                  }
                  label={formData.status ? "Active" : "Inactive"}
                />
              </FormControl>
            </Grid>

            {/* User Galleries */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                Upload User Galleries (0/5)
              </Typography>
              <TextField
                type="file"
                variant="standard"
                fullWidth
                {...register("user_galleries", {
                  required: "User Gallery is required",
                })}
                error={!!errors.user_galleries}
                helperText={
                  errors.user_galleries ? errors.user_galleries.message : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, "user_galleries")
                }
              />
            </Grid>

            {/* User Pictures */}
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">
                Upload User Pictures (0/5)
              </Typography>
              <TextField
                type="file"
                variant="standard"
                fullWidth
                {...register("user_pictures", {
                  required: "User Pictures is required",
                })}
                error={!!errors.user_galleries}
                helperText={
                  errors.user_galleries ? errors.user_galleries.message : ""
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleFileUpload(e, "user_pictures")
                }
              />
            </Grid>

            {/* Submit and Cancel */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                style={{ marginRight: "10px" }}
              >
                Submit
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleReset}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </>
  );
};
export default AddEditUser;
