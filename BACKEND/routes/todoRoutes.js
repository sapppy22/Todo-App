const express = require("express");
const router = express.Router();
const authenticateUser = require("../middlewares/auth");
const {
  createTodo,
  updateTodoStatus,
  deleteTodo,
  getTodos,
} = require("../controllers/todoController");

router.post("/", authenticateUser, createTodo);
router.put("/:id", authenticateUser, updateTodoStatus);
router.delete("/:id", authenticateUser, deleteTodo);
router.get("/", authenticateUser, getTodos);

module.exports = router;