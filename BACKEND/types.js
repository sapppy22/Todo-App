const { z } = require("zod");

const createTodo = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    deadline: z.string().refine((val) => !isNaN(Date.parse(val)), {
        message: "Deadline must be a valid date",
    }),
});


const updateTodo = z.object({
    id: z.string().min(1, { message: "Todo ID is required" }),
    status: z.enum(["ACTIVE", "COMPLETE", "EXPIRED"], { message: "Invalid status" }),
});

module.exports = {
    createTodo,
    updateTodo,
};
