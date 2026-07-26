
import { db } from "./sqlite";
import { Goal } from "../types/goal";

export function saveGoal(
goal: Goal
) {
db.runSync(
"INSERT INTO goals ( id, title, completed, createdAt ) VALUES (?, ?, ?, ?)",
[
goal.id,
goal.title,
goal.completed ? 1 : 0,
goal.createdAt,
]
);
}

export function getGoals() {
return db.getAllSync(
"SELECT * FROM goals ORDER BY createdAt DESC"
) as Goal[];
}

