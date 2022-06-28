import express from "express";
import fs from "fs";
import { Todo } from "../store/Todo";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	return res.send("This is a TODO Node.js app");
});

app.get("/todos", (req, res) => {
	const showPending = req.query.showpending;
	fs.readFile("./store/todos.json", "utf-8", (err, data) => {
		if (err) return res.status(500).send("Something went wrong");

		const todos: Todo[] = JSON.parse(data);
		if (!showPending) return res.json({ todos: todos });
		if (showPending === "1")
			return res.json({
				todos: todos.filter((todo) => {
					return todo.isCompleted === false;
				}),
			});
		if (showPending === "0")
			return res.json({
				todos: todos.filter((todo) => {
					return todo.isCompleted === true;
				}),
			});
	});
});

app.post("/todos", (req, res) => {
	fs.readFile("./store/todos.json", "utf-8", (err, data) => {
		if (err) return res.status(500).send("Something went wrong");
		const todos: Todo[] = JSON.parse(data);
		const newId = todos.length;
		todos.push({
			id: newId,
			name: req.body.name,
			isCompleted: false,
		});
		fs.writeFile("./store/todos.json", JSON.stringify(todos), () => {
			return res.json({ status: "ok" });
		});
	});
});

app.put("/todos/:id/complete", (req, res) => {
	const id = parseInt(req.params.id);
	if (id < 1 || typeof id !== "number") return res.send("Incorrect id");

	fs.readFile("./store/todos.json", "utf-8", (err, data) => {
		if (err) return res.status(500).send("Something went wrong");
		const todos: Todo[] = JSON.parse(data);
		const updatedTodos = todos.map((todo) => {
			if (todo.id === id) return { ...todo, isCompleted: true };
			return todo;
		});
		fs.writeFile("./store/todos.json", JSON.stringify(updatedTodos), () => {
			return res.json({ status: "ok" });
		});
	});
});

app.listen(3000, () => {
	console.log("App running on http://localhost:3000");
});
