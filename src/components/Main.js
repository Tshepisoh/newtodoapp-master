import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import CreateTodo from "./CreateTodos";
import LinearProgress from "@mui/material/LinearProgress";
import {
  Box,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  Checkbox,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useQueryClient } from "@tanstack/react-query";

const Main = () => {
  const [open, setOpen] = useState(false);
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const queryClient = useQueryClient();
  const theme = useTheme();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getTodos = useQuery({
    queryKey: ['todos'],
    queryFn: () => axios.get("http://localhost:5000/todos"),
  });

  const todos = getTodos.data?.data?.data;

  const createTodos = useMutation({
    mutationFn: (todos) => axios.post("http://localhost:5000/todos", todos),
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setSnackbar({
        open: true,
        message: "Task created successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to create task.",
        severity: "error",
      });
    },
  });

  const toggleTodos = useMutation({
    mutationFn: (todo) =>
      axios.patch(`http://localhost:5000/todos/${todo.id}`, {
        isCompleted: !todo.isCompleted,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setSnackbar({
        open: true,
        message: "Task updated successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to update task.",
        severity: "error",
      });
    },
  });

  const deleteTodo = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:5000/todos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setSnackbar({
        open: true,
        message: "Task deleted successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to delete task.",
        severity: "error",
      });
    },
  });

  const editTodos = useMutation({
    mutationFn: ({ id, text }) =>
      axios.patch(`http://localhost:5000/todos/${id}`, { text }),
    onSuccess: () => {
      queryClient.invalidateQueries("todos");
      setOpen(true);
      setEditText("");
      setEditId(null);
      setSnackbar({
        open: true,
        message: "Task edited successfully!",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Failed to edit task.",
        severity: "error",
      });
    },
  });

  const handleEdit = () => {
    editTodos.mutate({ id: editId, text: editText });
  };

  const handleClickOpen = (id, text) => {
    setEditId(id);
    setEditText(text);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = (data) => createTodos.mutate(data);

  const handleComplete = (todo) => toggleTodos.mutate(todo);

  const handleDelete = (id) => deleteTodo.mutate(id);

  return (
    <Container maxWidth="md" sx={{ pt: 0 }}>
      <Paper sx={{ p: 4, backgroundColor: theme.palette.background.paper }}>
        <CreateTodo handleSubmit={handleSubmit} />
        <Typography variant="h4" align="center" gutterBottom>
          TO-DO LIST
        </Typography>
        <Box
          sx={{
            overflowY: "auto",
            maxHeight: "50vh",
            mt: 2,
            scrollbarWidth:'none'
          }}
        >
          {getTodos.isLoading ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            todos?.map((todo) => (
              <Box
                key={todo.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  mb: 2,
                  background: todo.isCompleted ? "#7ae582" : "#dbd8e3",
                  borderRadius: 1,
                }}
              >
                <Checkbox
                  checked={todo.isCompleted}
                  onChange={() => handleComplete(todo)}
                  sx={{color: todo.isCompleted ? "orange" : "black"}}
                />
                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      textDecoration: todo.isCompleted
                        ? "line-through"
                        : "none",
                      color: "black",
                    }}
                  >
                    {todo.text}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.dark ? "black" : "black" }}
                  >
                    {new Date(todo.createdAt).toLocaleString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
                <Box>
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => handleClickOpen(todo.id, todo.text)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    size="small"
                    color="secondary"
                    onClick={() => handleDelete(todo.id)}
                  >
                    <DeleteIcon />
                  </Fab>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (e) => {
            e.preventDefault();
            handleEdit();
          },
        }}
      >
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Edit Task"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ width: 500 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" >OK</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%",  }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Main;
