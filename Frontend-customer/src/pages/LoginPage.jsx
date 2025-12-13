import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSnackbar } from "notistack";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import signupImage from '../assets/login.webp';

// ---- Styled Components ----

const PageContainer = styled(Box)({
  display: 'flex',
  minHeight: "84vh",
  background: "#ffffff",
});

const LeftPanel = styled(Box)({
  flex: 1,
  backgroundImage: `url(${signupImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundBlendMode: 'overlay',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '60px',
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 900px)': {
    display: 'none',
  },
});

const RightPanel = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  '@media (max-width: 900px)': {
    padding: '24px 18px',
    flex: 'none',
    width: '100%',
    minHeight: '100vh',
    justifyContent: 'flex-start',
    gap: '20px',
  },
});

const FormContainer = styled(Box)({
  width: '100%',
  maxWidth: '420px',
  '@media (max-width: 900px)': {
    maxWidth: '360px',
    background: '#ffffff',
    padding: '24px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.07)',
  },
});

const Title = styled(Typography)({
  fontSize: '2rem',
  fontWeight: 700,
  color: '#1a1a1a',
  marginBottom: '8px',
  '@media (max-width: 900px)': {
    textAlign: 'center',
    fontSize: '1.7rem',
  },
});

const Subtitle = styled(Typography)({
  fontSize: '0.95rem',
  color: '#666',
  marginBottom: '32px',
  '@media (max-width: 900px)': {
    textAlign: 'center',
    marginBottom: '20px',
  },
});

const StyledTextField = styled(TextField)({
  marginBottom: '20px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: '#fff',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: '#e0e0e0',
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: '#bdbdbd',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1a1a1a',
      borderWidth: '2px',
    },
  },
  '@media (max-width: 900px)': {
    '& input': {
      padding: '12px 14px',
      fontSize: '0.9rem',
    },
  },
});

const LoginButton = styled(Button)({
  marginTop: '8px',
  padding: '14px',
  borderRadius: '8px',
  fontSize: '0.95rem',
  fontWeight: 600,
  backgroundColor: '#1a1a1a',
  color: '#fff',
  textTransform: 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#2d2d2d',
  },
  '@media (max-width: 900px)': {
    fontSize: '1rem',
    borderRadius: '12px',
  },
});

const StyledDivider = styled(Divider)({
  margin: '32px 0',
  '@media (max-width: 900px)': {
    margin: '24px 0',
  },
});

const RegisterLink = styled(Link)({
  color: '#1a1a1a',
  fontWeight: 600,
  textDecoration: 'none',
  borderBottom: '1px solid transparent',
  '&:hover': {
    borderBottomColor: '#1a1a1a',
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login, userInfo } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (userInfo) navigate("/");
  }, [userInfo, navigate]);

  

  const validate = () => {
    const temp = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) temp.email = "Enter a valid email";
    if (!password) temp.password = "Password required";
    return temp;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setApiError("");

    const formErrors = validate();
    if (Object.keys(formErrors).length) {
      setErrors(formErrors);
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      navigate("/");
    } catch (err) {
      setApiError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <LeftPanel />

      <RightPanel>
        <FormContainer>
          <Title>Sign in</Title>
          <Subtitle>Welcome back — please login to continue</Subtitle>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={submitHandler} noValidate>
            <StyledTextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                ),
              }}
            />

            <LoginButton type="submit" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={22} sx={{ color: "#fff" }} /> : "Sign in"}
            </LoginButton>

            <StyledDivider>or</StyledDivider>

            <Typography align="center">
              Don't have an account?{" "}
              <RegisterLink to="/register">
                Create account
              </RegisterLink>
            </Typography>
          </Box>
        </FormContainer>
      </RightPanel>
    </PageContainer>
  );
};

export default LoginPage;
