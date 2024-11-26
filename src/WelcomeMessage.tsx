import React from "react";
import "./styles.css";

// 引数の型を定義
// Propsという名前で定義することが一般的です。
type Props = {
  name: string;
  uncompletedCount: number;
  textShadow?: string;
};

// WelcomeMessage という関数コンポーネントの定義
// 関数コンポーネントはパスカルケースで名前を設定します。
const WelcomeMessage = (props: Props) => {
  // いわゆる普通のロジックを記述する
  const currentTime = new Date();
  const greeting = currentTime.getHours() < 12 ? "おはよう！" : "こんにちは、";

  //【重要!】JSX構文で描いた「JSX要素」を return で返す
  return (
    <div className="text-outline text-4xl text-white">
      {greeting}
      {props.name}さん。 まだ終わってないのが
      {props.uncompletedCount}
      個あるからね！
    </div>
  );
};

// 他のファイルで WelcomeMessage を import できるようにする
export default WelcomeMessage;
