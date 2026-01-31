"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { HelpCircle, CheckSquare, RotateCcw, Download, Lightbulb, ShieldCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: CheckSquare,
    color: "from-indigo-500 to-blue-600",
    title: "Step 1: Work Through the Checklist",
    subtitle: "Check items as you go",
    description:
      "Open the app each day and work through each category. Tap the checkbox next to each task as you complete it. Your progress auto-saves instantly.",
    tip: "Tasks are grouped by area — Training Floor, Lobby, Bathrooms, Windows, etc. Work top to bottom for the fastest routine.",
  },
  {
    icon: RotateCcw,
    color: "from-blue-500 to-cyan-600",
    title: "Step 2: Reset for Tomorrow",
    subtitle: "Fresh start each day",
    description:
      "Hit the 'Reset for New Day' button to uncheck everything and start fresh. The app tracks your last completion date so you always know where you stand.",
    tip: "Pro tip: Reset first thing in the morning so the checklist is ready for whoever is on cleaning duty.",
  },
  {
    icon: Download,
    color: "from-emerald-500 to-teal-600",
    title: "Step 3: Track & Export",
    subtitle: "Keep records",
    description:
      "See your completion percentage at a glance with the progress bar. Export your checklist status anytime as a text file for records or team accountability.",
    tip: "Export after completing the checklist to create a daily record. Great for management reviews and accountability.",
  },
];

export function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="ghost" size="sm" className="gap-2" onClick={() => setOpen(true)}>
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Help</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              Brand &amp; Sanitation Guide
            </DialogTitle>
            <DialogDescription>
              Your daily facility checklist to maintain brand standards and cleanliness.
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 -mx-6 px-6 space-y-4 py-4">
            <div className="rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border border-indigo-200 dark:border-indigo-800 p-5 space-y-3">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                First Impressions Matter
              </h3>
              <p className="text-sm text-indigo-800 dark:text-indigo-200">
                Your facility is your brand. Every dirty mirror, cluttered lobby, or unstocked
                bathroom tells clients you don&apos;t care about the details. This daily checklist
                ensures your space always reflects the quality of your program.
              </p>
            </div>

            {steps.map((step, index) => (
              <div key={index} className="rounded-lg border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}
                  >
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.subtitle}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                <div className="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950/30 p-3">
                  <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-800 dark:text-amber-200">{step.tip}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <Button onClick={() => setOpen(false)} className="w-full bg-indigo-600 hover:bg-indigo-700">
              Got it!
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
