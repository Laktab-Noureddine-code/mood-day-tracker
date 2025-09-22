import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns";
import { cn } from "@/lib/utils";
import { useMoodData } from "@/hooks/useMoodData";
import { MOOD_ICONS, MOOD_COLORS } from "@/types/mood";
import { DayModal } from "./DayModal";

interface CalendarGridProps {
  currentDate: Date;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function CalendarGrid({ currentDate }: CalendarGridProps) {
  const { getDayData } = useMoodData();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDayClick = (date: Date) => {
    setSelectedDate(format(date, "yyyy-MM-dd"));
  };

  const closeModal = () => {
    setSelectedDate(null);
  };

  return (
    <>
      <div className="bg-background rounded-lg border border-border p-6">
        {/* Week headers */}
        <div className="grid grid-cols-7 gap-4 mb-4">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-xs font-medium text-muted-foreground text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-4">
          {days.map((day) => {
            const dateString = format(day, "yyyy-MM-dd");
            const dayData = getDayData(dateString);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isToday(day);

            return (
              <div
                key={dateString}
                onClick={() => handleDayClick(day)}
                className={cn(
                  "min-h-[120px] p-3 border border-border rounded-lg cursor-pointer transition-all hover:shadow-md",
                  isCurrentMonth ? "bg-background" : "bg-muted/30",
                  isTodayDate && "ring-2 ring-primary",
                  dayData.mood && `bg-${MOOD_COLORS[dayData.mood]}`
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn(
                    "text-lg font-semibold",
                    isCurrentMonth ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {format(day, "dd")}
                  </span>
                  {dayData.mood && (
                    <span className="text-lg">{MOOD_ICONS[dayData.mood]}</span>
                  )}
                </div>
                
                {dayData.description && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                    {dayData.description}
                  </p>
                )}

                {dayData.todos.length > 0 && (
                  <div className="space-y-1">
                    {dayData.todos.slice(0, 2).map((todo) => (
                      <div
                        key={todo.id}
                        className={cn(
                          "text-xs p-1 rounded truncate",
                          todo.done 
                            ? "line-through text-muted-foreground bg-muted/50" 
                            : "text-foreground bg-accent/50"
                        )}
                      >
                        {todo.text}
                      </div>
                    ))}
                    {dayData.todos.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{dayData.todos.length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <DayModal 
          date={selectedDate} 
          isOpen={!!selectedDate} 
          onClose={closeModal} 
        />
      )}
    </>
  );
}