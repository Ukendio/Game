export type MyReadOnly<T> = { readonly [K in keyof T]: T[K] };
interface Todo {
	title: string;
	description: string;
	completed: boolean;
}

type TodoPreview = MyReadOnly<Todo>;

const todo: TodoPreview = {
	title: "hello",
	description: "foo",
	completed: false,
};
