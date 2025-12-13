
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import './ProductCard.css';
import { useSnackbar } from 'notistack';

const ProductCard = ({ product }) => {
  const { userInfo, wishlist, addToWishlistCtx, removeFromWishlistCtx } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const isWishlisted = userInfo && wishlist.some(item => item._id === product._id);

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (isWishlisted) {
        await removeFromWishlistCtx(product._id);
        enqueueSnackbar(`${product.title} removed from wishlist`, { variant: 'info' });
      } else {
        await addToWishlistCtx(product._id);
        enqueueSnackbar(`${product.title} added to wishlist`, { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Could not update wishlist', { variant: 'error' });
    }
  };

  return (
    <motion.div
      className="product-card-container"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          boxShadow: '0 3px 15px rgba(0,0,0,0.08)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          '&:hover': {
            boxShadow: '0 6px 25px rgba(0,0,0,0.12)'
          }
        }}
      >
        {/* Wishlist Button */}
        {userInfo && (
          <IconButton
            onClick={toggleWishlist}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              zIndex: 10,
              backgroundColor: 'rgba(255,255,255,0.9)',
              boxShadow: 1,
              width: 30,
              height: 30,
              '&:hover': {
                backgroundColor: '#fff',
                transform: 'scale(1.1)'
              }
            }}
          >
            {isWishlisted ? (
              <FavoriteIcon sx={{ fontSize: 18, color: '#ff0000ff' }} />
            ) : (
              <FavoriteBorderIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        )}

        {/* Image */}
        <CardActionArea
          component={Link}
          to={`/product/slug/${product.slug}`}
          sx={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <CardMedia
            component="img"
            image={product.images[0]?.url || "/placeholder.png"}
            alt={product.title}
            sx={{
              height: { xs: 130, sm: 140, md: 150 },
              objectFit: 'cover',
              transition: 'transform 0.4s ease'
            }}
          />

          <CardContent
            sx={{
              textAlign: 'center',
              py: 1,
              px: 1.2,
            }}
          >
            <Typography
              variant="subtitle1"
              noWrap
              sx={{
                fontWeight: 600,
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.85rem' },
                mb: 0.5
              }}
            >
              {product.title}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '0.8rem', sm: '0.9rem' }
              }}
            >
              ₹{product.price?.toLocaleString('en-IN')}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
