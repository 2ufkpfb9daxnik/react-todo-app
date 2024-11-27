import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import background from "../public/background.jpg";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");

  const [initialized, setInitialized] = useState(false);
  const localStorageKey = "TodoApp";

  // App コンポーネントの初回実行時のみLocalStorageからTodoデータを復元
  useEffect(() => {
    const todoJsonStr = localStorage.getItem(localStorageKey);
    if (todoJsonStr && todoJsonStr !== "[]") {
      const storedTodos: Todo[] = JSON.parse(todoJsonStr);
      const convertedTodos = storedTodos.map((todo) => ({
        ...todo,
        deadline: todo.deadline ? new Date(todo.deadline) : null,
      }));
      setTodos(convertedTodos);
    } else {
      // LocalStorage にデータがない場合は initTodos をセットする
      setTodos(initTodos);
    }
    setInitialized(true);
  }, []);

  // 状態 todos または initialized に変更があったときTodoデータを保存
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(localStorageKey, JSON.stringify(todos));
    }
  }, [todos, initialized]);

  const uncompletedCount = todos.filter((todo: Todo) => !todo.isDone).length;

  console.log(JSON.stringify(todos, null, 2));

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoDeadline(e.target.value ? new Date(e.target.value) : null);
  };

  const addNewTodo = () => {
    if (newTodoNameError) return;

    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };

    setTodos([...todos, newTodo]);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
  };

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const removeCompletedTodos = () => {
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    setTodos(updatedTodos);
  };

  const remove = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const sortTodosByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => b.priority - a.priority);
    setTodos(sortedTodos);
  };

  const sortTodosByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (a.deadline && b.deadline) {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (a.deadline) {
        return -1;
      } else if (b.deadline) {
        return 1;
      } else {
        return 0;
      }
    });
    setTodos(sortedTodos);
  };
  const updateTodo = (id: string, updatedTodo: Partial<Todo>) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, ...updatedTodo } : todo
      )
    );
  };

  const currentDate = dayjs().format("YYYY年MM月DD日 HH時mm分");

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-start bg-gray-500"
      style={{ backgroundImage: `url(${background})`, backgroundSize: "cover" }}
    >
      <div className="mx-4 w-full max-w-7.5xl md:mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="flex flex-col">
            <h1 className="mb-4 text-7xl font-bold">やること管理</h1>
            <div className="mb-4 font-bold">今は{currentDate}です</div>
            <div className="mb-4">
              <WelcomeMessage
                name="寝屋川タヌキ"
                uncompletedCount={uncompletedCount}
                todos={todos}
              />
              <button
                type="button"
                onClick={removeCompletedTodos}
                className="mb-4 mt-5 rounded-md bg-red-500 px-3 py-1 text-2xl font-bold text-white hover:bg-red-600"
              >
                完了済みのタスクを削除
              </button>
              <div className="flex w-1/2 flex-col items-center justify-center space-y-2">
                {/* <button
            type="button"
            onClick={sortTodosByPriority}
            className="rounded-md bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
          >
            優先度順ソート
          </button>
          <button
            type="button"
            onClick={sortTodosByDeadline}
            className="rounded-md bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600"
          >
            期日順ソート
          </button> */}
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-col justify-between space-y-2 rounded-md border bg-white p-3 md:ml-4 md:mt-0 md:w-1/2">
            <h2 className="text-lg font-bold">新しいタスクの追加</h2>
            <div>
              <div className="flex items-center space-x-2">
                <label className="font-bold" htmlFor="newTodoName">
                  名前
                </label>
                <input
                  id="newTodoName"
                  type="text"
                  value={newTodoName}
                  onChange={(e) => setNewTodoName(e.target.value)}
                  className={twMerge(
                    "grow rounded-md border p-2",
                    newTodoNameError && "border-red-500 outline-red-500"
                  )}
                  placeholder="2文字以上32文字以内"
                />
              </div>
              {newTodoNameError && (
                <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500">
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  <span>{newTodoNameError}</span>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <label className="font-bold" htmlFor="newTodoPriority">
                  優先度
                </label>
                <input
                  id="newTodoPriority"
                  type="number"
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(parseInt(e.target.value))}
                  className="grow rounded-md border p-2"
                  min="1"
                  max="5"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="font-bold" htmlFor="newTodoDeadline">
                  期限
                </label>
                <input
                  id="newTodoDeadline"
                  type="datetime-local"
                  value={
                    newTodoDeadline
                      ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm")
                      : ""
                  }
                  onChange={(e) =>
                    setNewTodoDeadline(
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  className="grow rounded-md border p-2"
                />
              </div>
              <button
                onClick={addNewTodo}
                className="mt-2 w-full rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600"
              >
                追加
              </button>
            </div>
          </div>
        </div>
        <TodoList
          todos={todos}
          updateIsDone={updateIsDone}
          remove={remove}
          updateTodo={updateTodo}
        />
      </div>
      {/* タスク追加関連のUI実装 ここまで */}
      <a href="https://www.vecteezy.com/free-vector/summer">
        Summer Vectors by Vecteezy
      </a>
    </div>
  );
};

export default App;
