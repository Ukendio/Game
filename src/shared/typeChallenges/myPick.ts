export type MyPick<T, K extends keyof T> = { [index in K]: T[index] };
interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = MyPick<Todo, "title">;

const todo: TodoPreview = {
	title: "hello",
};
