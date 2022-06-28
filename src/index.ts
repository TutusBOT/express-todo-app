import express from "express";
import fs from "fs";
import { Todo } from "../store/Todo";
const app = express();

app.get("/", (req, res) => {
	return res.send("elo");
});

app.get("/todos", (req, res) => {
	fs.readFile("./store/todos.json", "utf-8", (err, data) => {
		if (err) return res.status(500).send("Something went wrong");

		const todos = JSON.parse(data);
		return res.json({ todos: todos });
	});
});

app.put("/todos/:id/complete", (req, res) => {
	const id = req.params.id;
	const findTodoById = ({ todos, id }: { todos: Todo[]; id: number }) => {
		todos.filter((todo) => {
			return todo.id === id;
		});
	};
	fs.readFile("./store/todos.json", "utf-8", (err, data) => {
		if (err) return res.status(500).send("Something went wrong");

		const todos = JSON.parse(data);
		return res.json({ todos: todos });
	});
});

app.listen(3000, () => {
	console.log("App running on http://localhost:3000");
});
