import { useMoodData } from "@/hooks/useMoodData";
import { MoodType } from "@/types/mood";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const MOOD_COLORS_CHART = {
  bad: "#ef4444",
  neutral: "#6b7280", 
  good: "#22c55e",
};

export function Analytics() {
  const { getAllData } = useMoodData();
  const allData = getAllData();

  // Prepare mood distribution data
  const moodCount = { bad: 0, neutral: 0, good: 0 };
  const moodOverTime: { date: string; mood: number }[] = [];
  const todoStats = { completed: 0, pending: 0 };

  Object.values(allData).forEach((dayData) => {
    if (dayData.mood) {
      moodCount[dayData.mood]++;
      
      // For line chart (-1 for bad, 0 for neutral, 1 for good)
      const moodValue = dayData.mood === "bad" ? -1 : dayData.mood === "good" ? 1 : 0;
      moodOverTime.push({
        date: dayData.date,
        mood: moodValue,
      });
    }

    // Count todos
    dayData.todos.forEach((todo) => {
      if (todo.done) {
        todoStats.completed++;
      } else {
        todoStats.pending++;
      }
    });
  });

  const pieData = [
    { name: "Good Days", value: moodCount.good, color: MOOD_COLORS_CHART.good },
    { name: "Neutral Days", value: moodCount.neutral, color: MOOD_COLORS_CHART.neutral },
    { name: "Bad Days", value: moodCount.bad, color: MOOD_COLORS_CHART.bad },
  ].filter(item => item.value > 0);

  const barData = [
    { name: "Completed", count: todoStats.completed, fill: MOOD_COLORS_CHART.good },
    { name: "Pending", count: todoStats.pending, fill: MOOD_COLORS_CHART.bad },
  ];

  // Sort mood over time by date
  moodOverTime.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground">Insights into your mood and productivity patterns</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Mood Distribution</CardTitle>
            <CardDescription>How your moods are distributed over time</CardDescription>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No mood data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Todo Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>Task Statistics</CardTitle>
            <CardDescription>Completed vs pending tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {todoStats.completed > 0 || todoStats.pending > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No task data available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mood Over Time */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mood Progression</CardTitle>
            <CardDescription>How your mood changes over time (Bad: -1, Neutral: 0, Good: +1)</CardDescription>
          </CardHeader>
          <CardContent>
            {moodOverTime.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodOverTime}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => new Date(date).toLocaleDateString()} 
                  />
                  <YAxis domain={[-1, 1]} tickFormatter={(value) => {
                    if (value === -1) return "Bad";
                    if (value === 0) return "Neutral";
                    if (value === 1) return "Good";
                    return value;
                  }} />
                  <Tooltip 
                    labelFormatter={(date) => new Date(date).toLocaleDateString()}
                    formatter={(value) => {
                      if (value === -1) return ["Bad", "Mood"];
                      if (value === 0) return ["Neutral", "Mood"];
                      if (value === 1) return ["Good", "Mood"];
                      return [value, "Mood"];
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                No mood progression data available yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}