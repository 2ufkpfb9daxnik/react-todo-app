import React from "react";
import "./styles.css";
import { Todo } from "./types";

// 引数の型を定義
type Props = {
  name: string;
  uncompletedCount: number;
  textShadow?: string;
  todos: Todo[];
};

// WelcomeMessage という関数コンポーネントの定義
const WelcomeMessage = (props: Props) => {
  // const currentTime = new Date();
  // const greeting = currentTime.getHours() < 12 ? "おはよう！" : "こんにちは、";

  const allTasksCompleted = props.todos.every((todo) => todo.isDone);

  return (
    <div className="text-outline text-4xl text-white">
      {allTasksCompleted ? (
        <div>お疲れ様！</div>
      ) : (
        <div>
          まだ終わってないのが
          {props.uncompletedCount}
          個あるからね！
        </div>
      )}
    </div>
  );
};

// 他のファイルで WelcomeMessage を import できるようにする
export default WelcomeMessage;
