"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HelpButton } from "@/components/help/help-button";
import {
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Download,
  CheckCircle2,
  Dumbbell,
  Sofa,
  Bath,
  Frame,
  DoorOpen,
  TreePine,
  Sparkles,
  CircleDot,
} from "lucide-react";

// ─── Checklist Data ──────────────────────────────────────────────────

interface ChecklistCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  items: string[];
}

const CHECKLIST: ChecklistCategory[] = [
  {
    id: "training-floor",
    name: "Training Floor / Main Area",
    icon: Dumbbell,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300",
    items: [
      "Sweep all hard floors",
      "Mop all hard floors",
      "Disinfect mats and training surfaces",
      "Vacuum carpeted areas",
      "Clean all mirrors",
      "Wipe down heavy bags, pads, and equipment",
      "Organize and straighten equipment storage",
      "Check equipment for damage or wear",
      "Empty training area trash cans",
      "Remove scuff marks from floors",
    ],
  },
  {
    id: "lobby",
    name: "Lobby / Front Desk / Waiting Area",
    icon: Sofa,
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
    items: [
      "Clean and organize the waiting/sitting area",
      "Wipe down front desk and counter surfaces",
      "Organize brochures, flyers, and marketing materials",
      "Clean entrance doors and glass",
      "Empty lobby trash cans",
      "Dust shelves, displays, and surfaces",
      "Check and straighten retail/pro shop display",
      "Vacuum or sweep lobby floors",
      "Wipe down chairs and benches",
      "Ensure sign-in area is clean with working pens",
    ],
  },
  {
    id: "bathrooms",
    name: "Bathrooms / Changing Areas",
    icon: Bath,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    items: [
      "Clean and disinfect toilets",
      "Clean sinks and countertops",
      "Clean bathroom mirrors",
      "Mop bathroom floors",
      "Restock toilet paper",
      "Restock paper towels or refill hand dryer",
      "Refill hand soap dispensers",
      "Empty bathroom trash cans",
      "Check for plumbing issues or leaks",
      "Wipe down changing area benches and lockers",
      "Check showers if applicable (clean and drain)",
    ],
  },
  {
    id: "windows-walls",
    name: "Windows, Walls & Fixtures",
    icon: Frame,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    items: [
      "Clean interior windows",
      "Wipe down window sills and ledges",
      "Dust all pictures, frames, and wall decor",
      "Clean light switches and door handles",
      "Check and clean light fixtures",
      "Wipe down baseboards (spot check)",
      "Check for scuffs or marks on walls",
      "Ensure all interior signage is straight and clean",
    ],
  },
  {
    id: "intro-room",
    name: "Intro / Consultation Room",
    icon: DoorOpen,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300",
    items: [
      "Clean and organize table and chairs",
      "Stock enrollment forms and pens",
      "Ensure presentation materials are ready",
      "Check that TV/screen is working (if applicable)",
      "Dust and wipe all surfaces",
      "Empty trash can",
      "Ensure room smells fresh and inviting",
    ],
  },
  {
    id: "exterior",
    name: "Exterior / Entrance",
    icon: TreePine,
    color: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300",
    items: [
      "Sweep entrance walkway and entryway",
      "Clean front windows and door glass",
      "Check exterior signage (lit, clean, straight)",
      "Pick up any litter around entrance",
      "Check parking lot for debris or hazards",
      "Ensure outdoor lighting is working",
      "Water plants or landscaping (if applicable)",
      "Clean welcome mat or entry rug",
    ],
  },
  {
    id: "brand-standards",
    name: "Brand Standards & Atmosphere",
    icon: Sparkles,
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    items: [
      "Music/sound system on and at proper volume",
      "Proper lighting throughout facility",
      "Temperature and AC/heat set correctly",
      "Fresh air and ventilation adequate",
      "Brand materials and banners properly displayed",
      "Staff in proper uniform/dress code",
      "Achievement boards and student photos current",
      "Schedule boards and class info updated",
      "Overall facility smells clean and fresh",
    ],
  },
];

// ─── Storage ─────────────────────────────────────────────────────────

const STORAGE_KEY = "brand-sanitation-checklist";
const PORTAL_URL = "https://masters-edge-portal.vercel.app";

interface ChecklistState {
  checked: Record<string, boolean>;
  completedBy: string;
  lastReset: string;
}

function getDefaultState(): ChecklistState {
  return {
    checked: {},
    completedBy: "",
    lastReset: new Date().toISOString(),
  };
}

function getTodayStr() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function makeKey(categoryId: string, itemIndex: number) {
  return `${categoryId}::${itemIndex}`;
}

// ─── Component ───────────────────────────────────────────────────────

export default function BrandSanitation() {
  const [state, setState] = useState<ChecklistState>(getDefaultState());
  const [mounted, setMounted] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  // Load
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch {
        setState(getDefaultState());
      }
    }
    setMounted(true);
  }, []);

  // Auto-save
  useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, mounted]);

  // Stats
  const totalItems = useMemo(
    () => CHECKLIST.reduce((sum, cat) => sum + cat.items.length, 0),
    []
  );

  const checkedCount = useMemo(
    () => Object.values(state.checked).filter(Boolean).length,
    [state.checked]
  );

  const percentage = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggleItem = (categoryId: string, itemIndex: number) => {
    const key = makeKey(categoryId, itemIndex);
    setState((prev) => ({
      ...prev,
      checked: { ...prev.checked, [key]: !prev.checked[key] },
    }));
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    setState({
      checked: {},
      completedBy: state.completedBy,
      lastReset: new Date().toISOString(),
    });
    setConfirmReset(false);
  };

  const handleExport = () => {
    const lines = [
      "BRAND & SANITATION CHECKLIST",
      `Date: ${getTodayStr()}`,
      `Completed By: ${state.completedBy || "Not specified"}`,
      `Progress: ${checkedCount}/${totalItems} (${percentage}%)`,
      "=".repeat(50),
      "",
    ];

    for (const cat of CHECKLIST) {
      const catChecked = cat.items.filter((_, i) => state.checked[makeKey(cat.id, i)]).length;
      lines.push(`${cat.name} (${catChecked}/${cat.items.length})`);
      lines.push("-".repeat(40));
      for (let i = 0; i < cat.items.length; i++) {
        const done = state.checked[makeKey(cat.id, i)];
        lines.push(`  [${done ? "X" : " "}] ${cat.items[i]}`);
      }
      lines.push("");
    }

    lines.push("Brand & Sanitation by Total Success AI");
    lines.push("Part of The Master's Edge Business Program");

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `brand-sanitation-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryProgress = (cat: ChecklistCategory) => {
    const done = cat.items.filter((_, i) => state.checked[makeKey(cat.id, i)]).length;
    return { done, total: cat.items.length, complete: done === cat.items.length };
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a
            href={PORTAL_URL}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Portal</span>
          </a>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2" onClick={handleExport}>
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <HelpButton />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Title + Reset */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                  Brand &amp; Sanitation
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {getTodayStr()}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className={confirmReset ? "border-red-300 text-red-600 hover:bg-red-50" : ""}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {confirmReset ? "Click again to confirm" : "Reset for New Day"}
            </Button>
          </div>

          {/* Progress Card */}
          <Card className="shadow-md border-indigo-200/50 dark:border-indigo-800/50">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {percentage === 100 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <CircleDot className="h-5 w-5 text-indigo-500" />
                  )}
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {checkedCount} of {totalItems} tasks complete
                  </span>
                </div>
                <span className={`text-lg font-bold ${percentage === 100 ? "text-emerald-500" : "text-indigo-600 dark:text-indigo-400"}`}>
                  {percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-3 rounded-full transition-all duration-500 ${percentage === 100 ? "bg-emerald-500" : "bg-indigo-500"}`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Completed by:
                </label>
                <input
                  type="text"
                  value={state.completedBy}
                  onChange={(e) => setState((prev) => ({ ...prev, completedBy: e.target.value }))}
                  placeholder="Enter your name"
                  className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </CardContent>
          </Card>

          {/* Checklist Categories */}
          {CHECKLIST.map((cat) => {
            const { done, total, complete } = getCategoryProgress(cat);
            const CatIcon = cat.icon;

            return (
              <Card key={cat.id} className={complete ? "border-emerald-200 dark:border-emerald-800/50" : ""}>
                <CardContent className="p-5">
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${cat.color}`}>
                        <CatIcon className="w-4 h-4" />
                      </div>
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {cat.name}
                      </h2>
                    </div>
                    <span className={`text-sm font-semibold ${complete ? "text-emerald-500" : "text-gray-400"}`}>
                      {done}/{total}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-1">
                    {cat.items.map((item, index) => {
                      const key = makeKey(cat.id, index);
                      const isChecked = !!state.checked[key];

                      return (
                        <label
                          key={key}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                            isChecked
                              ? "bg-emerald-50 dark:bg-emerald-950/20"
                              : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(cat.id, index)}
                            className="h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                          />
                          <span
                            className={`text-sm flex-1 ${
                              isChecked
                                ? "text-gray-400 dark:text-gray-500 line-through"
                                : "text-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {item}
                          </span>
                          {isChecked && (
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          )}
                        </label>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Footer */}
          <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Brand &amp; Sanitation by{" "}
              <span className="font-medium text-gray-500 dark:text-gray-400">
                Total Success AI
              </span>{" "}
              — Auto-saves as you check items. {totalItems} daily tasks across {CHECKLIST.length} categories.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
