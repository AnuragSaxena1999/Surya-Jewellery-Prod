
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  TextField,
  Container,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  Grow,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import logo from '../assets/Logo100.png'; 
const navLinks = [
  "rings",
  "chains",
  "kada",
  "bracelets",
  "earrings",
  "mangalsutras",
  "choker-necklace",
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems } = useCart();
  const { userInfo, logout } = useAuth();

  const [keyword, setKeyword] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [isShrunk, setIsShrunk] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const isHomePage = location.pathname === '/';

  const cartItemCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logoutHandler = () => {
    logout();
    handleClose();
    navigate("/login");
  };

  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
    setMobileSearchOpen(false);
  };

  const toggleDrawer = (open) => () => setDrawerOpen(open);

  // Shrink navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Open search bar on mobile for non-home pages
  useEffect(() => {
    if (isMobile) {
      // Open if not on homepage, close if on homepage
      setMobileSearchOpen(!isHomePage);
    }
  }, [location.pathname, isMobile]);

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          zIndex: 1200,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              py: isShrunk ? 0.5 : 1.5,
              justifyContent: "space-between",
              transition: "all 0.3s ease",
              position: "relative",
            }}
          >
            {/* Logo */}
            {/* <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                fontWeight: 700,
                letterSpacing: 1,
                fontSize: isShrunk ? "1.2rem" : "1.6rem",
                transition: "all 0.3s ease",
                "&:hover": { color: "secondary.main" },
              }}
            >
              suraj jewels
            </Typography> */}
            <Box
  component={Link}
  to="/"
  sx={{
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    height: isShrunk ? 35 : 50, // responsive shrink effect
    transition: "all 0.3s ease",
  }}
>
  <img
    src={logo}
    alt="Suraj Jewels Logo"
    style={{
      height: "80%",
      // objectFit: "contain",
      cursor: "pointer",
      transition: "all 0.3s ease",
      filter: isShrunk ? "brightness(0.9)" : "none",
    }}
  />
</Box>


            {/* Desktop Search */}
            {!isMobile && (
              <Box
                component="form"
                onSubmit={searchHandler}
                sx={{ flexGrow: 1, mx: 4, maxWidth: 500 }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    sx: {
                      borderRadius: "50px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                      fontSize: isShrunk ? "0.85rem" : "1rem",
                      height: isShrunk ? 36 : 44,
                      transition: "all 0.3s ease",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            )}

            {/* Right Actions */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {/* Mobile Search Toggle */}
              {isMobile && (
                <IconButton
                  onClick={isHomePage ? () => setMobileSearchOpen((prev) => !prev) : undefined}
                  sx={{
                    color: "text.primary",
                    "&:hover": { transform: "scale(1.1)" },
                    zIndex: 140, // Higher than drawer
                    cursor: isHomePage ? 'pointer' : 'default',
                  }}
                >
                  {isHomePage && mobileSearchOpen ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
              )}

              {/* Cart */}
              <IconButton
                component={Link}
                to="/cart"
                size="large"
                sx={{
                  color: "text.primary",
                  transition: "transform 0.2s ease",
                  "&:hover": { transform: "scale(1.1)" },
                }}
              >
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              {!isMobile && userInfo ? (
                <>
                  <Button
                    onClick={handleMenu}
                    startIcon={<AccountCircle />}
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "30px",
                      px: 2,
                      color: "text.primary",
                    }}
                  >
                    {userInfo.name}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem component={Link} to="/profile" onClick={handleClose}>
                      Mera sapna
                    </MenuItem>
                    <MenuItem component={Link} to="/wishlist" onClick={handleClose}>
                      My Wishlist
                    </MenuItem>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                !isMobile && (
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: "30px",
                      px: 2,
                      color: "text.primary",
                    }}
                  >
                    Sign In
                  </Button>
                )
              )}

              {/* Mobile Menu */}
              {isMobile && (
                <IconButton
                  onClick={toggleDrawer(true)}
                  sx={{ color: "text.primary", zIndex: 14000 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {/* Mobile Search Animated */}
          {isMobile && (
            <Grow in={mobileSearchOpen}>
              <Box
                component="form"
                onSubmit={searchHandler}
                sx={{
                  position: "fixed",
                  top: "100%",
                  left: 0,
                  width: "100%",
                  backgroundColor: "#fff",
                  borderTop: "1px solid rgba(0,0,0,0.05)",
                  p: 1.5,
                  zIndex: 1200, // Below header, above content
                }}
              >
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  placeholder="Search products..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  InputProps={{
                    sx: {
                      borderRadius: "30px",
                      backgroundColor: "#fff",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                    },
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grow>
          )}
        </Container>

        {/* Desktop Navigation */}
        {/* {!isMobile && (
          <Box
            sx={{
              width: "100%",
              bgcolor: "rgba(255,255,255,0.95)",
              borderTop: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <Container maxWidth="lg">
              <Toolbar
                component="nav"
                variant="dense"
                sx={{
                  justifyContent: "center",
                  gap: 4,
                  minHeight: isShrunk ? 38 : 48,
                  transition: "all 0.3s ease",
                }}
              >
                {navLinks.map((link) => (
                  <Button
                    key={link}
                    component={Link}
                    to={`/category/${link}`}
                    sx={{
                      color: "text.primary",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      fontSize: isShrunk ? "0.75rem" : "0.85rem",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: 0,
                        height: "2px",
                        left: 0,
                        bottom: -2,
                        bgcolor: "primary.main",
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": { width: "100%" },
                    }}
                  >
                    {link}
                  </Button>
                ))}
              </Toolbar>
            </Container>
          </Box>
        )} */}

        {/* ✅ Desktop Navigation (Only visible on large screens) */}
{!isMobile && (
  <Box
  sx={{
    display: { xs: "none", md: "block" }, // hide on small screens
    width: "100%",
    bgcolor: "rgba(255,255,255,0.95)",
    borderTop: "1px solid rgba(0,0,0,0.05)",
  }}
>
   <Container maxWidth="lg">
    <Toolbar
      component="nav"
      variant="dense"
      sx={{
        justifyContent: "center",
        gap: 4,
        minHeight: isShrunk ? 38 : 48,
        transition: "all 0.3s ease",
      }}
    >
      {navLinks.map((link) => (
        <Button
          key={link}
          component={Link}
          to={`/category/${link}`}
          sx={{
            position: "relative",
            color: "text.primary",
            fontWeight: 600,
            textTransform: "uppercase",
            fontSize: isShrunk ? "0.75rem" : "0.85rem",
            "&::after": {
              content: '""',
              position: "absolute",
              width: 0,
              height: "2px",
              left: 0,
              bottom: -2,
              bgcolor: "primary.main",
              transition: "width 0.3s ease",
            },
            "&:hover::after": { width: "100%" },
          }}
        >
          {link}
        </Button>
      ))}
    </Toolbar>
  </Container>
  </Box>
)}

      </AppBar>

      {/* ✅ Fixed Mobile Drawer Menu */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 280,
            backgroundColor: "#fff",
            zIndex: 2000,
            position: "fixed",
      boxShadow: " -2px 0 20px rgba(0,0,0,0.2)", // Always above everything
          },
        }}
      >
        <Box sx={{ p: 2, height: "100%", position: "relative" }}>
          {/* Drawer Header */}
          <Box
            sx={{
              // display: "flex",
              // justifyContent: "space-between",
              // alignItems: "center",
              // mb: 2,
              display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 2,
        position: "sticky",
        top: 0,
        backgroundColor: "#fff",
        zIndex: 2100,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Menu
            </Typography>
            <IconButton onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <List>
            {navLinks.map((link) => (
              <ListItem key={link} disablePadding>
                <ListItemButton
                  component={Link}
                  to={`/category/${link}`}
                  onClick={toggleDrawer(false)}
                >
                  <ListItemText primary={link.toUpperCase()} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {userInfo ? (
            <>
              <ListItemButton component={Link} to="/profile" onClick={toggleDrawer(false)}>
                <ListItemText primary="My Orders" />
              </ListItemButton>
              <ListItemButton component={Link} to="/wishlist" onClick={toggleDrawer(false)}>
                <ListItemText primary="My Wishlist" />
              </ListItemButton>
              {/* <ListItemButton
                onClick={() => {
                  logoutHandler();
                  setDrawerOpen(false);
                }}
              >
                <ListItemText primary="Logout" />
              </ListItemButton> */}
               <Box sx={{ mt: 3, textAlign: "center" }}>
      <Button
        onClick={() => {
          logoutHandler();
          setDrawerOpen(false);
        }}
        variant="contained"
        fullWidth
        sx={{
          background: "linear-gradient(90deg, #b8860b, #daa520)",
          color: "#fff",
          fontWeight: 600,
          textTransform: "none",
          borderRadius: "10px",
          py: 1,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          "&:hover": {
            background: "linear-gradient(90deg, #daa520, #ffd700)",
          },
        }}
      >
        Logout
      </Button>
    </Box>
            </>
          ) : (
            // <ListItemButton
            //   component={Link}
            //   to="/login"
            //   onClick={toggleDrawer(false)}
            // >
            //   <ListItemText primary="Sign In" />
            // </ListItemButton>
            <Box sx={{ mt: 3, textAlign: "center" }}>
    <Button
      component={Link}
      to="/login"
      onClick={toggleDrawer(false)}
      variant="contained"
      fullWidth
      sx={{
        background: "linear-gradient(90deg, #b8860b, #daa520)",
        color: "#fff",
        fontWeight: 600,
        textTransform: "none",
        borderRadius: "10px",
        py: 1,
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        "&:hover": {
          background: "linear-gradient(90deg, #daa520, #ffd700)",
        },
      }}
    >
      Sign In
    </Button>
  </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
};

export default Header;
