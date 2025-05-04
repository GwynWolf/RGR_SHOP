"use client";

import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

import { useRouter } from "next/navigation";
import { useCart } from "../contetx/cartContext";

type CartProps = {
  open: boolean;
  onClose: () => void;
};

export default function Cart({ open, onClose }: CartProps) {
  const { cart, setCart } = useCart();
  const router = useRouter(); // Використовуємо useRouter для навігації

  // Збільшити кількість
  const increaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Зменшити кількість
  const decreaseQuantity = (id: number) => {
    setCart(
      cart.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Видалити товар із кошика
  const removeItem = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Підраховуємо загальну суму
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Стилі для списку, якщо товарів > 3
  const listStyle = {
    maxHeight: cart.length > 3 ? 300 : "auto",
    overflowY: cart.length > 3 ? "auto" : "visible",
    paddingRight: cart.length > 3 ? "8px" : 0,
  };

  // Обробник оформлення замовлення
  const handleOrder = () => {
    // Формуємо об'єкт з масивом товарів та загальною сумою
    const orderData = {
      items: cart,
      totalPrice: totalPrice.toFixed(2),
    };

    // Збережемо об'єкт замовлення в Local Storage
    localStorage.setItem("order", JSON.stringify(orderData));

    // Очистити кошик
    setCart([]);

    // Закрити модальне вікно
    onClose();

    // Перехід на сторінку /order
    router.push("/order");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}>
        🛒 Кошик
      </DialogTitle>

      <DialogContent dividers>
        {cart.length === 0 ? (
          <Typography variant="body1" color="textSecondary" align="center">
            Кошик порожній.
          </Typography>
        ) : (
          <List sx={listStyle}>
            {cart.map((item) => (
              <Box key={item.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {item.name}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="textPrimary">
                          Ціна: {item.price} ₴
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Кількість: {item.quantity}
                        </Typography>
                      </>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton
                      onClick={() => decreaseQuantity(item.id)}
                      edge="end"
                      size="small"
                    >
                      <RemoveIcon />
                    </IconButton>

                    <Typography
                      variant="body1"
                      sx={{
                        mx: 1,
                        display: "inline-block",
                        minWidth: "20px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}
                    </Typography>

                    <IconButton
                      onClick={() => increaseQuantity(item.id)}
                      edge="end"
                      size="small"
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => removeItem(item.id)}
                      edge="end"
                      sx={{ ml: 2 }}
                      size="small"
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </Box>
            ))}
          </List>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          Загальна сума: {totalPrice.toFixed(2)} ₴
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            sx={{ mr: 1, textTransform: "none", fontWeight: "bold" }}
            onClick={handleOrder}
            disabled={cart.length === 0}
          >
            Оформити замовлення
          </Button>
          <Button onClick={onClose} color="secondary" variant="outlined">
            Закрити
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
