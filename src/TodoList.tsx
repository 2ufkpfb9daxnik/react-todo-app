import React, { useState } from "react";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa";
import { Todo } from "./types";
import complete from "../public/circle-3.svg";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void;
  updateTodo: (id: string, updatedTodo: Partial<Todo>) => void;
};

const TodoList = (props: Props) => {
  const todos = [...props.todos].sort((a, b) => a.priority - b.priority);
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editedTodo, setEditedTodo] = useState<Partial<Todo>>({
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

  const handleEditClick = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditedTodo({
      name: todo.name,
      priority: todo.priority,
      deadline: todo.deadline,
    });
  };

  const handleSaveClick = (id: string) => {
    props.updateTodo(id, editedTodo);
    setEditingTodoId(null);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {todos.map((todo: Todo) => {
        const remainingDays = todo.deadline
          ? calculateRemainingDays(todo.deadline)
          : null;
        const isOverdue = remainingDays !== null && remainingDays <= 0;
        const isDueSoon =
          remainingDays !== null && remainingDays <= 7 && remainingDays > 0;
        const sizeFactor =
          (remainingDays !== null ? Math.max(1, 30 - remainingDays) : 1) *
          todo.priority;
        const priorityFontSize = `${1 + (todo.priority - 1) * 0.5}rem`; // 優先度に応じたフォントサイズ

        // 優先度に応じたグリッドのクラスを設定
        let gridClass = "";
        switch (todo.priority) {
          case 1:
            gridClass = "col-span-1";
            break;
          case 2:
          case 3:
            gridClass = "col-span-2";
            break;
          case 4:
            gridClass = "col-span-3";
            break;
          case 5:
            gridClass = "col-span-4 row-span-2";
            break;
          default:
            gridClass = "col-span-1";
        }

        return (
          <div
            className={`relative rounded-2xl border-8 bg-gradient-to-r from-red-100 to-blue-100 p-4 shadow-xl ${isOverdue ? "border-red-500" : isDueSoon ? "border-yellow-500" : "border-green-500"} ${todo.isDone ? "opacity-50" : ""} ${gridClass} ${editingTodoId === todo.id ? "bg-yellow-100" : ""}`}
            key={todo.id}
          >
            {editingTodoId === todo.id ? (
              <div>
                <input
                  type="text"
                  value={editedTodo.name}
                  onChange={(e) =>
                    setEditedTodo({ ...editedTodo, name: e.target.value })
                  }
                />
                <input
                  type="number"
                  value={editedTodo.priority}
                  onChange={(e) =>
                    setEditedTodo({
                      ...editedTodo,
                      priority: parseInt(e.target.value),
                    })
                  }
                />
                <input
                  type="datetime-local"
                  value={
                    editedTodo.deadline
                      ? dayjs(editedTodo.deadline).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setEditedTodo({
                      ...editedTodo,
                      deadline: e.target.value
                        ? new Date(e.target.value)
                        : null,
                    })
                  }
                />
                <button onClick={() => handleSaveClick(todo.id)}>保存</button>
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={todo.isDone}
                    onChange={(e) =>
                      props.updateIsDone(todo.id, e.target.checked)
                    }
                    className="mr-3 size-8 cursor-pointer"
                  />
                  <div
                    className={`text-5xl font-bold ${isOverdue ? "text-red-500" : isDueSoon ? "text-yellow-500" : ""}`}
                    style={{ fontSize: priorityFontSize }}
                  >
                    {isOverdue || isDueSoon ? `*${todo.name}*` : todo.name}
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
                  <span className="ml-2">
                    {getPriorityLabel(todo.priority)}
                  </span>
                </div>
                <div
                  className="text-2xl"
                  style={{ fontSize: priorityFontSize }}
                >
                  {" "}
                  {todo.deadline
                    ? dayjs(todo.deadline).format("YYYY/MM/DD HH:mm")
                    : "期限なし"}
                </div>
                <button
                  onClick={() => props.remove(todo.id)}
                  className="rounded-md bg-red-400 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
                >
                  削除
                </button>
                <button
                  onClick={() => handleEditClick(todo)}
                  className="rounded-md bg-slate-400 px-2 py-1 text-sm font-bold text-white hover:bg-blue-500"
                >
                  編集
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
