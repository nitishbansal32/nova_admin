import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          username,
          password,
        }
      );
      if (response.data.success) {
        localStorage.setItem("token", response.data.token); // Save token
        setIsLoggedIn(true); // Update login state
        navigate("/dashboard"); // Redirect to dashboard
      }
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Nova Admin Login
      </Typography>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <TextField
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          required
        />
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ padding: "10px", fontWeight: "bold" }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
