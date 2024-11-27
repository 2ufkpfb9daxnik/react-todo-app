import { useState, useEffect } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid"; // ◀◀ 追加
import dayjs from "dayjs"; // ◀◀ 追加
import { twMerge } from "tailwind-merge"; // ◀◀ 追加
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // ◀◀ 追加
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"; // ◀◀ 追加

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // ◀◀ 編集
  const [newTodoName, setNewTodoName] = useState(""); // ◀◀ 追加
  const [newTodoPriority, setNewTodoPriority] = useState(3); // ◀◀ 追加
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null); // ◀◀ 追加
  const [newTodoNameError, setNewTodoNameError] = useState("");

  const [initialized, setInitialized] = useState(false); // ◀◀ 追加
  const localStorageKey = "TodoApp"; // ◀◀ 追加

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
  
    const uncompletedCount = todos.filter(
      (todo: Todo) => !todo.isDone
    ).length;
  
    console.log(JSON.stringify(todos, null, 2));

  // ▼▼ 追加
  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  // ▼▼ 追加
  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value)); // ◀◀ 追加
    setNewTodoName(e.target.value);
  };

  // ▼▼ 追加
  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value)); // 数値型に変換
  };
  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value; // UIで日時が未設定のときは空文字列 "" が dt に格納される
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    // ▼▼ 編集
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName, // ◀◀ 編集
      isDone: false,
      priority: newTodoPriority, // ◀◀ 追加
      deadline: newTodoDeadline, // ◀◀ 追加
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName(""); // ◀◀ 追加
    setNewTodoPriority(3); // ◀◀ 追加
    setNewTodoDeadline(null); // ◀◀ 追加
  };
  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value }; // スプレッド構文
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
  const currentDate = dayjs().format("YYYY年MM月DD日 H時m分");

  return (
    <div className="bg-gray-500">
      <div className="mx-4 max-w-2xl md:mx-auto">
        <h1 className="mb-4 text-7xl font-bold">やること管理</h1>
        <div className="mb-4 font-bold">今は{currentDate}です</div>
        <div className="mb-4">
          <WelcomeMessage
            name="寝屋川タヌキ"
            uncompletedCount={uncompletedCount}
            todos={todos}
          />
        </div>

        {/* タスク追加関連のUI実装 ここから... */}
        <div className="mt-5 space-y-2 rounded-md border bg-white p-3">
          <h2 className="text-lg font-bold">新しいタスクの追加</h2>
          {/* 編集: ここから... */}
          <div>
            <div className="flex items-center space-x-2">
              <label className="font-bold" htmlFor="newTodoName">
                名前
              </label>
              <input
                id="newTodoName"
                type="text"
                value={newTodoName}
                onChange={updateNewTodoName}
                className={twMerge(
                  "grow rounded-md border p-2",
                  newTodoNameError && "border-red-500 outline-red-500"
                )}
                placeholder="2文字以上32文字以内"
              />
            </div>
            {newTodoNameError && (
              <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="mr-0.5"
                />
                <div>{newTodoNameError}</div>
              </div>
            )}
          </div>
          {/* ...ここまで */}

          {/* ラジオボタンの実装 ここから... */}
          <div className="flex gap-5">
            <div className="font-bold">優先度</div>
            {[1, 2, 3].map((value) => (
              <label key={value} className="flex items-center space-x-1">
                <input
                  id={`priority-${value}`}
                  name="priorityGroup"
                  type="radio"
                  value={value}
                  checked={newTodoPriority === value}
                  onChange={updateNewTodoPriority}
                />
                <span>{value}</span>
              </label>
            ))}
          </div>
          {/* ...ここまで */}
          {/* DateTimeUIの実装 ここから... */}
          <div className="flex items-center gap-x-2">
            <label htmlFor="deadline" className="font-bold">
              期限
            </label>
            <input
              type="datetime-local"
              id="deadline"
              value={
                newTodoDeadline
                  ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                  : ""
              }
              onChange={updateDeadline}
              className="rounded-md border border-gray-400 px-2 py-0.5"
            />
          </div>
          {/* ...ここまで */}

          <button
            type="button"
            onClick={addNewTodo} // ボタンを押下したときの処理
            className="rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600"
          >
            追加
          </button>
        </div>
        <button
          type="button"
          onClick={removeCompletedTodos}
          className={
            "mt-5 rounded-md bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
          }
        >
          完了済みのタスクを削除
        </button>
        <TodoList todos={todos} updateIsDone={updateIsDone} remove={remove} />
        {/* ...ここまで */}
      </div>
    </div>
  );
};

export default App;
