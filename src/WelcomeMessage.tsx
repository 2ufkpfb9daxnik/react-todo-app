import React from "react";
import "./styles.css";
import { Todo } from "./types";

// 引数の型を定義
// Propsという名前で定義することが一般的です。
type Props = {
  name: string;
  uncompletedCount: number;
  textShadow?: string;
  todos: Todo[];
};

// WelcomeMessage という関数コンポーネントの定義
// 関数コンポーネントはパスカルケースで名前を設定します。
const WelcomeMessage = (props: Props) => {
  // いわゆる普通のロジックを記述する
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? "おはよう！" : "こんにちは、";

  const allTasksCompleted = props.todos.every((todo) => todo.isDone);

  //【重要!】JSX構文で描いた「JSX要素」を return で返す
  return (
    <div className="text-outline text-4xl text-white">
      {allTasksCompleted ? (
        <div>{props.name}さん、お疲れ様！</div>
      ) : (
        <div>
          {greeting}
          {props.name}さん。 まだ終わってないのが
          {props.uncompletedCount}
          個あるからね！
        </div>
      )}
    </div>
  );
};

// 他のファイルで WelcomeMessage を import できるようにする
export default WelcomeMessage;
