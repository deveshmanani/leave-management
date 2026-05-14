"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function HistoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[HistoryError]", error);
  }, [error]);

  return (
    <div className="p-4 md:p-6">
      <Card className="border-destructive/50">
        <CardHeader className="flex flex-row items-center gap-3">
          <AlertTriangle className="size-5 text-destructive" />
          <CardTitle className="text-destructive">
            Failed to load history
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load the leave history. This might be a temporary
            issue with the data source. Please try again.
          </p>
          <Button onClick={reset} variant="outline" className="gap-2">
            <RefreshCw className="size-4" />
            Retry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
