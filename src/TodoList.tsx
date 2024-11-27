import React, { useState } from "react";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa";
import { Todo } from "./types";
import TodoItem from "./TodoItem";
import complete from "../public/circle-3.svg";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void; // ◀◀ 追加
  updateTodo: (id: string, todo: Todo) => void;
};

const TodoList = (props: Props) => {
  const todos = [...props.todos].sort((a, b) => a.priority - b.priority);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editedTodo, setEditedTodo] = useState({
    name: "",
    priority: 3,
    deadline: null,
  });

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  const calculateRemainingDays = (deadline: Date) => {
    const now = dayjs();
    const end = dayjs(deadline);
    return end.diff(now, "day");
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 5:
        return "!!超重要!!";
      case 4:
        return "重要!";
      case 3:
        return "";
      case 2:
        return "あまり気にせず";
      case 1:
        return "一旦忘れていい";
      default:
        return "";
    }
  };

  const handleEditClick = (todo) => {
    setEditingTodoId(todo.id);
    setEditedTodo({
      name: todo.name,
      priority: todo.priority,
      deadline: todo.deadline,
    });
  };

  const handleSaveClick = (id) => {
    props.updateTodo(id, editedTodo);
    setEditingTodoId(null);
  };

  return (
    <div className="space-y-5">
      {todos.map((todo) => {
        const remainingDays = todo.deadline
          ? calculateRemainingDays(todo.deadline)
          : null;
        const isOverdue = remainingDays !== null && remainingDays <= 0;
        const sizeFactor =
          (remainingDays !== null ? Math.max(1, 30 - remainingDays) : 1) *
          todo.priority;
        const priorityFontSize = `${1 + (todo.priority - 1) * 0.5}rem`; // 優先度に応じたフォントサイズ

        return (
          <div
            className={`relative rounded-2xl border-8 bg-gradient-to-r from-red-100 to-blue-100 p-4 shadow-xl ${isOverdue ? "border-red-500" : "border-green-500"} ${todo.isDone ? "opacity-50" : ""}`}
            key={todo.id}
          >
            {todo.isDone && (
              <img
                src={complete}
                alt="達成済み!"
                className="absolute inset-0 size-full object-cover opacity-20"
              />
            )}
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.isDone}
                onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
                className="mr-3 size-8 cursor-pointer"
              />
              <div
                className={`text-5xl font-bold ${isOverdue ? "text-red-500" : ""}`}
                style={{ fontSize: priorityFontSize }}
              >
                {isOverdue ? `***${todo.name}***` : todo.name}
              </div>
            </div>
            <div
              className="flex items-center text-2xl"
              style={{ fontSize: priorityFontSize }}
            >
              優先度{" "}
              {Array(todo.priority)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              <span className="ml-2">{getPriorityLabel(todo.priority)}</span>
            </div>
            <div className="text-2xl" style={{ fontSize: priorityFontSize }}>
              {" "}
              {todo.deadline
                ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")
                : "いつまでも"}
              まで
            </div>
            <div className="text-2xl" style={{ fontSize: priorityFontSize }}>
              あと{todo.deadline ? `${remainingDays}日` : "何日とかないよー"}
            </div>
            <button
              onClick={() => props.remove(todo.id)}
              className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
            >
              削除
            </button>
            {/* <button
              onClick={() => handleEditClick(todo)}
              className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-blue-500"
            >
              編集
            </button> */}
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
