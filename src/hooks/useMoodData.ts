import { useLocalStorage } from "./useLocalStorage";
import { DayData, Todo, MoodType } from "@/types/mood";

export function useMoodData() {
  const [data, setData] = useLocalStorage<Record<string, DayData>>("mood-calendar-data", {});

  const getDayData = (date: string): DayData => {
    return data[date] || { date, todos: [] };
  };

  const updateDayData = (date: string, updates: Partial<Omit<DayData, "date">>) => {
    setData((prev) => ({
      ...prev,
      [date]: {
        ...getDayData(date),
        ...updates,
      },
    }));
  };

  const setMood = (date: string, mood: MoodType, description?: string) => {
    updateDayData(date, { mood, description });
  };

  const addTodo = (date: string, text: string) => {
    const dayData = getDayData(date);
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      done: false,
    };
    updateDayData(date, {
      todos: [...dayData.todos, newTodo],
    });
  };

  const toggleTodo = (date: string, todoId: string) => {
    const dayData = getDayData(date);
    const updatedTodos = dayData.todos.map((todo) =>
      todo.id === todoId ? { ...todo, done: !todo.done } : todo
    );
    updateDayData(date, { todos: updatedTodos });
  };

  const deleteTodo = (date: string, todoId: string) => {
    const dayData = getDayData(date);
    const updatedTodos = dayData.todos.filter((todo) => todo.id !== todoId);
    updateDayData(date, { todos: updatedTodos });
  };

  const getAllData = () => data;

  return {
    getDayData,
    setMood,
    addTodo,
    toggleTodo,
    deleteTodo,
    getAllData,
  };
}