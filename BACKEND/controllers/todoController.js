const Todo = require("../models/todo");
const { createTodo, updateTodo } = require("../types"); // Zod schemas

// Create a new todo
exports.createTodo = async (req, res) => {
  try {
    const { title, description, deadline } = req.body;
    const parsedPayload = createTodo.safeParse({ title, description, deadline });

    if (!parsedPayload.success) {
      return res.status(400).json({ error: parsedPayload.error.issues });
    }

    const todo = await Todo.create({
      title,
      description,
      deadline,
      status: "ACTIVE",
      user: req.user.id,
    });

    res.status(201).json({ message: "Todo created", todo });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update todo status
exports.updateTodoStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const parsedPayload = updateTodo.safeParse({ status });

    if (!parsedPayload.success) {
      return res.status(400).json({ error: parsedPayload.error.issues });
    }

    const todo = await Todo.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { status },
      { new: true }
    );

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo updated", todo });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await Todo.findOneAndDelete({ _id: id, user: req.user.id });

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get all todos with filters
exports.getTodos = async (req, res) => {
  try {
    const { status, search, sort } = req.query;
    const query = { user: req.user.id };

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = sort === "asc" ? 1 : -1;
    const todos = await Todo.find(query).sort({ deadline: sortOrder });

    res.json({ todos });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};