import { useState, useEffect } from "react";
import axios from "axios";

export default function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState(""); // renamed task to title
    const [description, setDescription] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (user) {
            fetchTodos();
        }
    }, [user]);

    const fetchTodos = async () => {
        if (!user) return;
        const response = await axios.get("http://localhost:5000/todos", {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setTodos(response.data.todos); // adjust to match the response structure
    };

    const addTodo = async () => {
        if (!title || !description || !user) return;
        const response = await axios.post("http://localhost:5000/todo", { 
            title, 
            description, 
            status: "ACTIVE", 
            deadline: new Date().toISOString() 
        }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setTodos([...todos, response.data.todo]); // adjust to match response structure
        setTitle(""); // reset title
        setDescription(""); // reset description
    };

    const deleteTodo = async (id) => {
        if (!user) return;
        await axios.delete(`http://localhost:5000/todo/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        setTodos(todos.filter(todo => todo._id !== id));
    };

    const updateStatus = async (id, newStatus) => {
        if (!user) return;
        await axios.put(`http://localhost:5000/todo/status`, { id, status: newStatus }, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchTodos();
    };

    const handleAuth = async (endpoint) => {
        const response = await axios.post(`http://localhost:5000/${endpoint}`, { username, password });
        setUser(response.data); // response should contain user data with token
        setUsername(""); // reset username
        setPassword(""); // reset password
    };

    const logout = () => {
        setUser(null);
        setTodos([]);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4 border rounded-lg shadow-lg">
            {!user ? (
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-center mb-4">Login / Register</h1>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="border p-2 w-full rounded mb-2" 
                        placeholder="Username" 
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="border p-2 w-full rounded mb-2" 
                        placeholder="Password" 
                    />
                    <button onClick={() => handleAuth("login")} className="bg-blue-500 text-white p-2 rounded w-full mb-2">Login</button>
                    <button onClick={() => handleAuth("register")} className="bg-green-500 text-white p-2 rounded w-full">Register</button>
                </div>
            ) : (
                <div>
                    <h1 className="text-2xl font-bold text-center mb-4">TODO App</h1>
                    <button onClick={logout} className="bg-red-500 text-white p-2 rounded w-full mb-4">Logout</button>
                    <div className="flex gap-2 mb-4">
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="border p-2 w-full rounded" 
                            placeholder="Enter a title" 
                        />
                        <input 
                            type="text" 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="border p-2 w-full rounded" 
                            placeholder="Enter a description" 
                        />
                        <button onClick={addTodo} className="bg-blue-500 text-white p-2 rounded">Add</button>
                    </div>
                    <ul>
                        {todos.map(todo => (
                            <li key={todo._id} className="flex justify-between items-center p-2 border-b">
                                <div>
                                    <span className={`font-bold ${todo.status === 'COMPLETE' ? 'line-through text-gray-500' : ''}`}>{todo.title}</span>
                                    <p className="text-sm text-gray-600">{todo.description}</p>
                                </div>
                                <div className="flex gap-2">
                                    <select onChange={(e) => updateStatus(todo._id, e.target.value)} value={todo.status} className="border p-1 rounded">
                                        <option value="ACTIVE">Active</option>
                                        <option value="IN_PROGRESS">In Progress</option>
                                        <option value="COMPLETE">Complete</option>
                                        <option value="EXPIRED">Expired</option>
                                    </select>
                                    <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
