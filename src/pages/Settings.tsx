import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export function Settings() {
  const [, setData] = useLocalStorage("mood-calendar-data", {});

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all your data? This action cannot be undone.")) {
      setData({});
      window.location.reload();
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and data</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
            <CardDescription>Mood & Productivity Calendar</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Track your daily mood and manage your tasks with this simple calendar app. 
              All your data is stored locally in your browser.
            </p>
            <div className="text-sm">
              <p><strong>Features:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground mt-2">
                <li>Daily mood tracking with visual indicators</li>
                <li>Task management per day</li>
                <li>Analytics and insights</li>
                <li>Data stored locally (no account needed)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that will affect your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="destructive" 
              onClick={handleClearData}
              className="w-full"
            >
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              This will permanently delete all your moods, descriptions, and tasks.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}