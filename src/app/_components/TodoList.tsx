"use client";
import { useState } from "react";
import { trpc } from "../_trpc/client";
import { serverClient } from "../_trpc/serverClient";

export default function TodoList({initialTodos,}:{initialTodos: Awaited<ReturnType<(typeof serverClient)["getTodos"]>>}) {
  const getTodos = trpc.getTodos.useQuery(undefined,{initialData: initialTodos, refetchOnMount: false, refetchOnReconnect: false,});
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const deleteTodo = trpc.deleteTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const [content, setContent] = useState("");
  return (
    <div>
      <div className = "text-black my-5 text-3xl">
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
          <input
            id={`check-${todo.id}`}
            type="checkbox"
            checked={!!todo.done}
            style={{zoom: 1.5}}
            onChange={async () => {
              setDone.mutate({
                id: todo.id,
                done: todo.done ? 0 : 1,
              });
            }}
          />
          <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          <button 
            onClick={async () => {
              deleteTodo.mutate(todo.id);
            }}
            className="text-gray-500 hover:text-red-400"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className = "flex gap-3 items-center">
        <label htmlFor="content">Content</label>
        <input
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black bg-zinc-200"
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate(content);
              setContent("");
            }
          }}
          className="bg-blue-500 hover:bg-blue-200 text-white font-bold py-2 px-4 rounded-full"
        >
          Add Todo
        </button>
      </div>
    </div>
  );
}
