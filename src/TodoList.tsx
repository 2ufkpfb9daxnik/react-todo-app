import React from "react";
import dayjs from "dayjs";
import { FaStar } from "react-icons/fa";
import { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  remove: (id: string) => void; // ◀◀ 追加
};

const TodoList = (props: Props) => {
  const todos = [...props.todos].sort((a, b) => a.priority - b.priority);

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

  return (
    <div className="space-y-5">
      {todos.map((todo) => {
        const remainingDays = todo.deadline
          ? calculateRemainingDays(todo.deadline)
          : null;
        const isOverdue = remainingDays !== null && remainingDays <= 0;

        return (
          <div
            className={`relative rounded-2xl border-8 bg-gradient-to-r from-red-100 to-blue-100 p-4 shadow-xl ${isOverdue ? "border-red-500" : "border-green-500"} ${todo.isDone ? "opacity-50" : ""}`}
            key={todo.id}
          >
            {todo.isDone && (
              <img
                src="/circle-3.svg"
                alt="Completed"
                className="absolute inset-0 size-full object-cover opacity-20"
              />
            )}
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
              className="mr-1.5 cursor-pointer"
            />
            <div
              className={`text-5xl font-bold ${isOverdue ? "text-red-500" : ""}`}
            >
              {isOverdue ? `***${todo.name}***` : todo.name}
            </div>
            <div className="flex items-center text-2xl">
              優先度{" "}
              {Array(todo.priority)
                .fill(0)
                .map((_, i) => (
                  <FaStar key={i} className="text-yellow-500" />
                ))}
              <span className="ml-2">{getPriorityLabel(todo.priority)}</span>
            </div>
            <div className="text-2xl">
              {" "}
              {todo.deadline
                ? dayjs(todo.deadline).format("YYYY年MM月DD日 H時m分")
                : "いつまでも"}
              まで
            </div>
            <div className="text-2xl">
              あと{todo.deadline ? `${remainingDays}日` : "何日とかないよー"}
            </div>
            <button
              onClick={() => props.remove(todo.id)}
              className="rounded-md bg-slate-200 px-2 py-1 text-sm font-bold text-white hover:bg-red-500"
            >
              削除
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TodoList;
