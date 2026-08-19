import React from "react";
import type { Route } from "../../+types/root";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleCheck,
  ChevronsRight,
  FolderKanban,
  LayoutDashboard,
  ListCheck,
  Menu,
  Settings,
  Users,
  Wrench,
  X,
  LogOut,
} from "lucide-react";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Synctra — Project Management" },
    {
      name: "description",
      content:
        "Plan projects, manage tasks, collaborate with your team, and track progress with Synctra.",
    },
  ];
}

/* -------------------------------------------------------------------------- */
/* Scroll reveal                                                              */
/* -------------------------------------------------------------------------- */

const useScrollReveal = () => {
  React.useEffect(() => {
    const elements = document.querySelectorAll(".scroll-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);
};

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

const FeatureIcon = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
      {children}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Dashboard preview                                                          */
/* -------------------------------------------------------------------------- */

const DashboardPreview = () => {
  const stats = [
    {
      title: "Total Projects",
      value: "11",
      lines: ["1 completed", "2 in progress"],
    },
    {
      title: "Total Tasks",
      value: "42",
      lines: ["12 completed"],
    },
    {
      title: "To Do",
      value: "9",
      lines: ["Tasks waiting to be done"],
    },
    {
      title: "In Progress",
      value: "14",
      lines: ["Tasks currently in progress"],
    },
  ];

  const navItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      label: "Workspaces",
      icon: Users,
    },
    {
      label: "My Tasks",
      icon: ListCheck,
    },
    {
      label: "Members",
      icon: Users,
    },
    {
      label: "Archived",
      icon: CircleCheck,
    },
    {
      label: "Settings",
      icon: Settings,
    },
  ];

  return (
    <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">
      <div className="absolute -inset-10 rounded-[40px] bg-blue-100/30 blur-3xl" />

      <div className="relative overflow-hidden rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_30px_90px_-35px_rgba(15,23,42,0.22)] sm:p-3">
        <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-background">
          {/* App Header */}
          <div className="flex h-14 items-center justify-between border-b bg-background px-4 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-lg border px-3 py-1.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-semibold text-white">
                  S
                </div>

                <span className="text-xs font-medium text-slate-800">
                  Synctra
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg">
                <Bell className="h-4 w-4 text-slate-500" />
              </div>

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
                S
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-[190px_1fr]">
            {/* Sidebar */}
            <aside className="hidden min-h-172.5 border-r bg-sidebar md:block">
              <div className="flex h-14 items-center border-b px-4">
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-blue-600" />

                  <span className="text-sm font-semibold">
                    Synctra
                  </span>
                </div>

                <ChevronsRight className="ml-auto h-4 w-4 text-slate-400" />
              </div>

              <div className="px-3 py-5">
                <div className="space-y-1.5">
                  {navItems.map(({ label, icon: Icon, active }) => (
                    <div
                      key={label}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${active
                        ? "bg-blue-100 text-blue-600"
                        : "text-slate-700"
                        }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-8 hidden px-4 md:block">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <LogOut className="h-4 w-4" />
                  Logout
                </div>
              </div>
            </aside>

            {/* Dashboard */}
            <div className="min-w-0">
              <div className="min-w-0 bg-white p-4 sm:p-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">
                    Dashboard
                  </h3>
                </div>

                {/* Stats */}
                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {stats.map((stat) => (
                    <div
                      key={stat.title}
                      className="rounded-xl border p-4"
                    >
                      <p className="text-sm font-medium text-slate-700">
                        {stat.title}
                      </p>

                      <p className="mt-4 text-2xl font-bold tracking-tight">
                        {stat.value}
                      </p>

                      <div className="mt-1 space-y-0.5">
                        {stat.lines.map((line) => (
                          <p
                            key={line}
                            className="text-[11px] text-muted-foreground"
                          >
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* First analytics row */}
                <div className="mt-6 grid gap-6 xl:grid-cols-[2fr_0.95fr]">
                  {/* Task trends */}
                  <div className="rounded-xl border bg-white">
                    <div className="flex items-start justify-between px-4 pb-2 pt-4 sm:px-5">
                      <div>
                        <h4 className="text-sm font-medium">
                          Task Trends
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Daily Task Status Changes
                        </p>
                      </div>

                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="px-3 pb-4 pt-3 sm:px-5">
                      <div className="relative h-48">
                        <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
                          {[4, 3, 2, 1, 0].map((n) => (
                            <div
                              key={n}
                              className="flex items-center gap-2"
                            >
                              <span className="w-4 text-[9px] text-muted-foreground">
                                {n}
                              </span>

                              <div className="flex-1 border-t border-dashed border-slate-100" />
                            </div>
                          ))}
                        </div>

                        <svg
                          viewBox="0 0 620 180"
                          className="absolute left-7 right-0 top-0 h-40 w-[calc(100%-28px)]"
                          preserveAspectRatio="none"
                        >
                          <polyline
                            points="0,145 85,145 170,145 255,112 340,112 425,85 510,85 620,60"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />

                          <polyline
                            points="0,145 85,145 170,130 255,130 340,120 425,120 510,100 620,100"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />

                          <polyline
                            points="0,145 85,130 170,130 255,130 340,100 425,100 510,75 620,75"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />
                        </svg>

                        <div className="absolute bottom-0 left-7 right-0 flex justify-between">
                          {[
                            "Sun",
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                          ].map((day) => (
                            <span
                              key={day}
                              className="text-[9px] text-muted-foreground"
                            >
                              {day}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center gap-5 text-[10px]">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                          Completed
                        </span>

                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-orange-400" />
                          In Progress
                        </span>

                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="h-2 w-2 rounded-full bg-blue-500" />
                          To Do
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Project status */}
                  <div className="rounded-xl border bg-white">
                    <div className="flex items-start justify-between px-4 pb-2 pt-4 sm:px-5">
                      <div>
                        <h4 className="text-sm font-medium">
                          Project Status
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Project Status Breakdown
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "conic-gradient(#10b981 0 20%, #f59e0b 20% 60%, #3b82f6 60% 100%)",
                          }}
                        />

                        <div className="absolute inset-7 rounded-full bg-white" />

                        <div className="relative text-center">
                          <p className="text-xl font-bold">11</p>

                          <p className="text-[10px] text-muted-foreground">
                            Projects
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-2 text-[10px]">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Completed
                          </span>

                          <span className="font-medium">20%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-orange-400" />
                            In Progress
                          </span>

                          <span className="font-medium">40%</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-muted-foreground">
                            <span className="h-2 w-2 rounded-full bg-blue-500" />
                            Planning
                          </span>

                          <span className="font-medium">40%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Second analytics row */}
                <div className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_2fr]">
                  {/* Priority */}
                  <div className="rounded-xl border bg-white">
                    <div className="flex items-start justify-between px-4 pb-2 pt-4 sm:px-5">
                      <div>
                        <h4 className="text-sm font-medium">
                          Task Priority
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Task Priority Breakdown
                        </p>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <div className="relative mx-auto flex h-40 w-40 items-center justify-center">
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "conic-gradient(#ef4444 0 50%, #f59e0b 50% 75%, #6b7280 75% 100%)",
                          }}
                        />

                        <div className="absolute inset-7 rounded-full bg-white" />
                      </div>

                      <div className="mt-5 flex justify-center gap-4 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-red-500" />
                          High
                        </span>

                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-orange-400" />
                          Medium
                        </span>

                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-500" />
                          Low
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Workspace productivity */}
                  <div className="rounded-xl border bg-white">
                    <div className="flex items-start justify-between px-4 pb-2 pt-4 sm:px-5">
                      <div>
                        <h4 className="text-sm font-medium">
                          Workspace Productivity
                        </h4>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Task Completion by Project
                        </p>
                      </div>

                      <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <div className="px-4 pb-5 pt-4">
                      <div className="relative h-44">
                        <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
                          {[4, 3, 2, 1, 0].map((n) => (
                            <div
                              key={n}
                              className="flex items-center gap-2"
                            >
                              <span className="w-4 text-[9px] text-muted-foreground">
                                {n}
                              </span>

                              <div className="flex-1 border-t border-dashed border-slate-100" />
                            </div>
                          ))}
                        </div>

                        <div className="absolute bottom-7 left-7 right-0 top-2 flex items-end justify-around gap-2">
                          {[
                            {
                              name: "Website",
                              total: 4,
                              completed: 1,
                            },
                            {
                              name: "Mobile",
                              total: 3,
                              completed: 2,
                            },
                            {
                              name: "API",
                              total: 2,
                              completed: 1,
                            },
                            {
                              name: "Testing",
                              total: 3,
                              completed: 2,
                            },
                            {
                              name: "Launch",
                              total: 2,
                              completed: 2,
                            },
                          ].map((project) => (
                            <div
                              key={project.name}
                              className="flex h-full flex-1 items-end justify-center gap-1"
                            >
                              <div
                                className="w-4 rounded-t-sm bg-blue-500"
                                style={{
                                  height: `${(project.completed / 4) * 100
                                    }%`,
                                }}
                              />

                              <div
                                className="w-4 rounded-t-sm bg-black"
                                style={{
                                  height: `${(project.total / 4) * 100
                                    }%`,
                                }}
                              />
                            </div>
                          ))}
                        </div>

                        <div className="absolute bottom-0 left-7 right-0 flex justify-around gap-2">
                          {[
                            "Website",
                            "Mobile",
                            "API",
                            "Testing",
                            "Launch",
                          ].map((name) => (
                            <span
                              key={name}
                              className="max-w-14 truncate text-[8px] text-muted-foreground"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 flex justify-center gap-5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm bg-blue-500" />
                          Completed Tasks
                        </span>

                        <span className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-sm bg-black" />
                          Total Tasks
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        A preview of the Synctra dashboard
      </p>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Homepage                                                                   */
/* -------------------------------------------------------------------------- */

const features = [
  {
    icon: FolderKanban,
    title: "Projects",
    description:
      "Create projects, define priorities, and keep the work organized from start to finish.",
  },
  {
    icon: ListCheck,
    title: "Tasks",
    description:
      "Break projects into manageable tasks, assign work, and keep deadlines visible.",
  },
  {
    icon: Users,
    title: "Workspaces",
    description:
      "Give teams their own shared spaces for projects, tasks, members, and collaboration.",
  },
  {
    icon: BarChart3,
    title: "Insights",
    description:
      "Understand project status, task priority, trends, and productivity from one dashboard.",
  },
];

const Homepage = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useScrollReveal();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2.5"
          >
            <Wrench className="h-6 w-6 text-blue-600" />

            <span className="text-xl font-semibold tracking-tight">
              Synctra
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-1 md:flex">

            <a
              href="#dashboard"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              Dashboard
            </a>

            <a
              href="#features"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              Features
            </a>

            <a
              href="#workflow"
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
            >
              How it works
            </a>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/sign-in">
              <Button
                variant="ghost"
                className="rounded-lg px-4 text-sm"
              >
                Sign in
              </Button>
            </Link>

            <Link to="/sign-up">
              <Button className="rounded-lg bg-blue-600 px-4 text-sm hover:bg-blue-700">
                Get started
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg border md:hidden"
            onClick={() => setMobileOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t bg-background px-5 py-4 md:hidden">
            <div className="flex flex-col gap-1">

              <a
                href="#dashboard"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Dashboard
              </a>

              <a
                href="#features"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                Features
              </a>

              <a
                href="#workflow"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                How it works
              </a>

              <div className="flex gap-2 pt-3">
                <Link
                  to="/sign-in"
                  className="flex-1"
                >
                  <Button
                    variant="outline"
                    className="w-full rounded-lg"
                  >
                    Sign in
                  </Button>
                </Link>

                <Link
                  to="/sign-up"
                  className="flex-1"
                >
                  <Button className="w-full rounded-lg bg-blue-600">
                    Get started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                             */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden">
          <div className="absolute -top-65 left-1/2 h-130 w-225 -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24 lg:px-8 lg:pb-28 lg:pt-28">
            <div className="mx-auto max-w-3xl text-center">
              <Badge
                variant="secondary"
                className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-blue-700"
              >
                <Wrench className="mr-1.5 h-3.5 w-3.5" />
                Simple project management
              </Badge>

              <h1 className="mt-7 text-balance text-4xl font-semibold tracking-tighter sm:text-5xl lg:text-7xl">
                Everything your team needs to
                <span className="text-blue-600">
                  {" "}
                  stay in sync.
                </span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                Synctra brings projects, tasks, people, and progress together
                in one clean workspace so your team always knows what comes
                next.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <Link to="/sign-up">
                  <Button
                    size="lg"
                    className="h-12 rounded-lg bg-blue-600 px-7 text-sm font-semibold shadow-md shadow-blue-600/15 hover:bg-blue-700"
                  >
                    Start using Synctra
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <a href="#dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-12 w-full rounded-lg px-7 text-sm font-semibold sm:w-auto"
                  >
                    Explore the dashboard
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </a>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Project management
                </span>

                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Task tracking
                </span>

                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  Team workspaces
                </span>
              </div>
            </div>

            {/* Dashboard */}
            <div
              id="dashboard"
              className="scroll-mt-24 scroll-reveal"
            >
              <DashboardPreview />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Features                                                         */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="features"
          className="scroll-mt-24 border-y bg-muted/30"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="mx-auto max-w-2xl text-center scroll-reveal">
              <p className="text-sm font-semibold text-blue-600">
                One workspace
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Keep the whole workflow in one place.
              </h2>

              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                Synctra is designed around the way teams actually organize
                their work.
              </p>
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="scroll-reveal rounded-xl border bg-background p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <FeatureIcon>
                    <feature.icon className="h-5 w-5" />
                  </FeatureIcon>

                  <h3 className="mt-5 text-sm font-semibold">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Workflow                                                         */}
        {/* ---------------------------------------------------------------- */}

        <section
          id="workflow"
          className="scroll-mt-24"
        >
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
              <div className="scroll-reveal">
                <p className="text-sm font-semibold text-blue-600">
                  Designed around the workflow
                </p>

                <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                  From workspace to completed project.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Organize the work at the workspace level, turn projects into
                  tasks, and use the dashboard to understand how everything is
                  progressing.
                </p>

                <div className="mt-8 space-y-5">
                  {[
                    {
                      number: "01",
                      title: "Create a workspace",
                      text: "Give your team a shared place to organize related work.",
                    },
                    {
                      number: "02",
                      title: "Build projects and tasks",
                      text: "Turn goals into projects and manageable pieces of work.",
                    },
                    {
                      number: "03",
                      title: "Track the progress",
                      text: "Use status, priorities, activity, and analytics to stay informed.",
                    },
                  ].map((step, index) => (
                    <div
                      key={step.number}
                      className="scroll-reveal flex gap-4"
                      style={{
                        transitionDelay: `${index * 100}ms`,
                      }}
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-semibold text-blue-600">
                        {step.number}
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          {step.title}
                        </h3>

                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-9">
                  <Link to="/sign-up">
                    <Button className="rounded-lg bg-blue-600 hover:bg-blue-700">
                      Create your workspace
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Mini workspace illustration */}
              <div className="scroll-reveal relative">
                <div className="absolute -inset-6 rounded-[30px] bg-blue-50 blur-2xl" />

                <div className="relative rounded-2xl border bg-background p-4 shadow-xl shadow-slate-900/5 sm:p-5">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                        <FolderKanban className="h-4.5 w-4.5 text-blue-600" />
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Workspace
                        </p>

                        <p className="mt-0.5 text-sm font-semibold">
                          Product Team
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant="outline"
                      className="rounded-full"
                    >
                      8 members
                    </Badge>
                  </div>

                  <div className="mt-4 space-y-3">
                    {[
                      {
                        title: "Website redesign",
                        progress: 78,
                        color: "bg-blue-600",
                      },
                      {
                        title: "Mobile application",
                        progress: 54,
                        color: "bg-emerald-500",
                      },
                      {
                        title: "API improvements",
                        progress: 31,
                        color: "bg-orange-400",
                      },
                    ].map((project) => (
                      <div
                        key={project.title}
                        className="rounded-xl border p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-medium">
                              {project.title}
                            </p>

                            <p className="mt-1 text-[10px] text-muted-foreground">
                              Project
                            </p>
                          </div>

                          <span className="text-xs font-semibold">
                            {project.progress}%
                          </span>
                        </div>

                        <div className="mt-3 h-1.5 rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${project.color}`}
                            style={{
                              width: `${project.progress}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Projects
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        11
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Tasks
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        42
                      </p>
                    </div>

                    <div className="rounded-xl bg-muted/50 p-3">
                      <p className="text-[10px] text-muted-foreground">
                        Members
                      </p>

                      <p className="mt-1 text-lg font-bold">
                        8
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Final CTA                                                        */}
        {/* ---------------------------------------------------------------- */}

        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-slate-950 px-6 py-14 text-center sm:px-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_58%)]" />

              <div className="relative mx-auto max-w-2xl scroll-reveal">
                <p className="text-sm font-medium text-blue-400">
                  Bring your work together
                </p>

                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl">
                  Ready to get your projects in sync?
                </h2>

                <p className="mt-4 text-sm leading-6 text-slate-400 sm:text-base">
                  Create a workspace and start organizing your next project
                  with Synctra.
                </p>

                <div className="mt-8">
                  <Link to="/sign-up">
                    <Button
                      size="lg"
                      className="h-11 rounded-lg bg-blue-600 px-6 font-semibold text-white hover:bg-blue-500"
                    >
                      Get started
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-blue-600" />

            <span className="text-sm font-semibold">
              Synctra
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Synctra
          </p>

          <div className="flex items-center gap-5">
            <Link
              to="/sign-in"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>

            <Link
              to="/sign-up"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Sign up
            </Link>
          </div>
        </div>
      </footer>

      {/* Scroll reveal styles */}
      <style>{`
        html {
          scroll-behavior: smooth;
        }

        .scroll-reveal {
          opacity: 0;
          transform: translateY(40px);
          transition:
            opacity 700ms ease,
            transform 700ms ease;
        }

        .scroll-reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .scroll-reveal {
            opacity: 1;
            transform: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Homepage;