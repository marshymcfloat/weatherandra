"use client";

import { useTransition } from "react";
import { manualWeatherCheck } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Zap } from "lucide-react";
import { toast } from "sonner";

export default function HomePage() {
  const [isPending, startTransition] = useTransition();

  const handleManualCheck = () => {
    startTransition(async () => {
      const result = await manualWeatherCheck();

      if (result.success) {
        toast("Check Complete!");
      } else {
        toast(result.error || "Error");
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Weather Alert System</CardTitle>
          <CardDescription>
            This system automatically checks for rain in Taguig & Mandaluyong
            every hour.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An email will be sent to the configured address only if there's a
              high chance of rain.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              You can also trigger a manual check below.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleManualCheck}
            disabled={isPending}
          >
            {isPending ? (
              "Checking..."
            ) : (
              <>
                <Zap className="mr-2 h-4 w-4" /> Trigger Manual Check
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
