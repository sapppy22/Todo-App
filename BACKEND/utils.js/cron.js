const cron = require("node-cron");
const Todo = require("../models/todo");

const checkExpiredTasks = async () => {
  const currentDate = new Date();
  const expiredTodos = await Todo.updateMany(
    { deadline: { $lt: currentDate }, status: { $ne: "COMPLETE" } },
    { $set: { status: "EXPIRED" } }
  );
  console.log(`${expiredTodos.modifiedCount} tasks marked as EXPIRED`);
};

// Run daily at midnight
cron.schedule("0 0 * * *", checkExpiredTasks);