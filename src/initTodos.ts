import { Todo } from "./types";
import { v4 as uuid } from "uuid"; // v4 を uuid という名前でインポート

export const initTodos: Todo[] = [
  {
    id: uuid(), // UUID v4 を生成してIDにセット
    name: "解析2の宿題",
    isDone: false,
    priority: 2,
    deadline: new Date(2024, 10, 2, 17, 30),
  },
  {
    id: uuid(),
    name: "TypeScriptの勉強 (復習)",
    isDone: true,
    priority: 3,
    deadline: null, // このTodoには期限を設定しない
  },
  {
    id: uuid(),
    name: "基礎物理学3の宿題",
    isDone: false,
    priority: 4,
    deadline: new Date(2024, 10, 11),
  },
  {
    id: uuid(),
    name: "データ構造とアルゴリズム",
    isDone: true,
    priority: 1,
    deadline: new Date(2024, 10, 30, 17, 30),
  },
  {
    id: uuid(),
    name: "データベースの勉強",
    isDone: false,
    priority: 2,
    deadline: new Date(2024, 10, 30, 22, 30),
  },
  {
    id: uuid(),
    name: "Reactの勉強",
    isDone: false,
    priority: 5,
    deadline: new Date(2025, 2, 1, 2, 8),
  },
  {
    id: uuid(),
    name: "解析力学の勉強",
    isDone: false,
    priority: 4,
    deadline: new Date(2026, 3, 1, 3, 8),
  },
  {
    id: uuid(),
    name: "漢字直接入力の計算",
    isDone: false,
    priority: 5,
    deadline: new Date(2027, 9, 1, 12, 4),
  },
  {
    id: uuid(),
    name: "麻雀AIの開発",
    isDone: false,
    priority: 3,
    deadline: new Date(2028, 9, 1, 12, 4),
  },
];
