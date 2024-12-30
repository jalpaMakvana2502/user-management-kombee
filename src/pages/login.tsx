import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { TextField, Typography, Box, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../redux/authSlice";
import { loginUser } from "../service/services";

const initialValue = {
  email: "",
  password: "",
};

const Login = () => {
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm({
    defaultValues: initialValue,
  });

  const onSubmit = async (data: FieldValues) => {
    const { email, password } = data;
    try {
      setSubmitting(true);
      const response = await loginUser({ email, password });
      const token = response.data.authorization;
      dispatch(loginSuccess(token));
    } catch (error) {
      setError("Invalid credentials");
      dispatch(loginFailure("Invalid credentials"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography component="h1" variant="h5">
        Sign In
      </Typography>
      <Typography color="info">Enter your username and password</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 1 }}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email is required.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email.",
            },
          }}
          render={({
            field: { value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error ? error.message : undefined}
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password is required",
          }}
          render={({
            field: { value, onBlur, onChange },
            fieldState: { error },
          }) => (
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              error={!!error}
              helperText={error ? error.message : undefined}
            />
          )}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          // disabled={!isValid || submitting}
          // loading={submitting}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
};

export default Login;
