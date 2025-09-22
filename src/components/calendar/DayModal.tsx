import { useState } from "react";
import { format } from "date-fns";
import { X, Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useMoodData } from "@/hooks/useMoodData";
import { MoodType, MOOD_ICONS } from "@/types/mood";
import { cn } from "@/lib/utils";

interface DayModalProps {
  date: string;
  isOpen: boolean;
  onClose: () => void;
}

const MOOD_OPTIONS: { type: MoodType; label: string; icon: string }[] = [
  { type: "bad", label: "Bad", icon: "❌" },
  { type: "neutral", label: "Neutral", icon: "😐" },
  { type: "good", label: "Good", icon: "✅" },
];

export function DayModal({ date, isOpen, onClose }: DayModalProps) {
  const { getDayData, setMood, addTodo, toggleTodo, deleteTodo } = useMoodData();
  const dayData = getDayData(date);
  const [newTodo, setNewTodo] = useState("");
  const [description, setDescription] = useState(dayData.description || "");

  const handleMoodSelect = (mood: MoodType) => {
    setMood(date, mood, description);
  };

  const handleDescriptionSave = () => {
    if (dayData.mood) {
      setMood(date, dayData.mood, description);
    }
  };

  const handleAddTodo = () => {
    if (newTodo.trim()) {
      addTodo(date, newTodo.trim());
      setNewTodo("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {format(new Date(date), "MMMM d, yyyy")}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Mood Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Mood</h3>
            
            <div className="grid grid-cols-3 gap-3">
              {MOOD_OPTIONS.map(({ type, label, icon }) => (
                <Button
                  key={type}
                  variant={dayData.mood === type ? "default" : "outline"}
                  className={cn(
                    "h-16 flex flex-col space-y-1",
                    dayData.mood === type && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => handleMoodSelect(type)}
                >
                  <span className="text-2xl">{icon}</span>
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="How was your day? Add a note..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionSave}
                className="min-h-[100px]"
              />
            </div>
          </div>

          {/* Todo Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Tasks</h3>
            
            <div className="flex space-x-2">
              <Input
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleAddTodo} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {dayData.todos.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  No tasks for this day yet
                </p>
              ) : (
                dayData.todos.map((todo) => (
                  <div
                    key={todo.id}
                    className="flex items-center space-x-3 p-3 bg-accent/30 rounded-lg"
                  >
                    <Checkbox
                      checked={todo.done}
                      onCheckedChange={() => toggleTodo(date, todo.id)}
                    />
                    <span
                      className={cn(
                        "flex-1 text-sm",
                        todo.done && "line-through text-muted-foreground"
                      )}
                    >
                      {todo.text}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTodo(date, todo.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}