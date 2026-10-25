"use client";

import { useEffect, useRef, useState } from "react";
import {
  CircleCheckIcon,
  ClockIcon,
  ListTodoIcon,
  MailIcon,
  PauseIcon,
  PlayIcon,
  UsersIcon,
  WebhookIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type TraceTone =
  | "trigger"
  | "core"
  | "blue"
  | "amber"
  | "teal"
  | "violet"
  | "outcome";

type TraceStatus = "queued" | "running" | "waiting" | "done";

type TraceSegment = {
  start: number;
  end: number;
  startPhase: number;
  endPhase: number;
  kind?: "work" | "wait";
};

type TraceLane = {
  id: string;
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: TraceTone;
  startPhase: number;
  donePhase: number;
  waitingFrom?: number;
  waitingUntil?: number;
  segments: TraceSegment[];
};

const traceLanes: TraceLane[] = [
  {
    id: "event",
    label: "Business event",
    detail: "signal received",
    icon: WebhookIcon,
    tone: "trigger",
    startPhase: 0,
    donePhase: 1,
    segments: [{ start: 2, end: 14, startPhase: 0, endPhase: 1 }],
  },
  {
    id: "context",
    label: "Context resolution",
    detail: "related records joined",
    icon: WorkflowIcon,
    tone: "core",
    startPhase: 1,
    donePhase: 2,
    segments: [{ start: 14, end: 34, startPhase: 1, endPhase: 2 }],
  },
  {
    id: "email",
    label: "Required email",
    detail: "prepared and sent",
    icon: MailIcon,
    tone: "blue",
    startPhase: 2,
    donePhase: 3,
    segments: [{ start: 34, end: 49, startPhase: 2, endPhase: 3 }],
  },
  {
    id: "task",
    label: "Operational task",
    detail: "created with context",
    icon: ListTodoIcon,
    tone: "amber",
    startPhase: 2,
    donePhase: 4,
    segments: [{ start: 34, end: 60, startPhase: 2, endPhase: 4 }],
  },
  {
    id: "followup",
    label: "Provider follow-up",
    detail: "waits, then resumes",
    icon: ClockIcon,
    tone: "teal",
    startPhase: 2,
    donePhase: 7,
    waitingFrom: 4,
    waitingUntil: 6,
    segments: [
      { start: 34, end: 54, startPhase: 2, endPhase: 4 },
      {
        start: 54,
        end: 70,
        startPhase: 4,
        endPhase: 6,
        kind: "wait",
      },
      { start: 70, end: 82, startPhase: 6, endPhase: 7 },
    ],
  },
  {
    id: "handoff",
    label: "Internal handoff",
    detail: "owner informed",
    icon: UsersIcon,
    tone: "violet",
    startPhase: 2,
    donePhase: 5,
    segments: [{ start: 34, end: 70, startPhase: 2, endPhase: 5 }],
  },
  {
    id: "outcome",
    label: "Done",
    detail: "next step is clear",
    icon: CircleCheckIcon,
    tone: "outcome",
    startPhase: 8,
    donePhase: 10,
    segments: [{ start: 82, end: 98, startPhase: 8, endPhase: 10 }],
  },
];

const toneStyles: Record<
  TraceTone,
  {
    icon: string;
    bar: string;
    text: string;
    dot: string;
    glow: string;
    border: string;
  }
> = {
  trigger: {
    icon: "border-orange-500/55 bg-orange-500/10 text-orange-500",
    bar: "bg-orange-500",
    text: "text-orange-500",
    dot: "bg-orange-500",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--color-orange-500)_35%,transparent)]",
    border: "border-orange-500/55",
  },
  core: {
    icon: "border-primary/55 bg-primary/10 text-primary",
    bar: "bg-primary",
    text: "text-primary",
    dot: "bg-primary",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--primary)_35%,transparent)]",
    border: "border-primary/55",
  },
  blue: {
    icon: "border-chart-2/55 bg-chart-2/10 text-chart-2",
    bar: "bg-chart-2",
    text: "text-chart-2",
    dot: "bg-chart-2",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--chart-2)_35%,transparent)]",
    border: "border-chart-2/55",
  },
  amber: {
    icon: "border-chart-4/55 bg-chart-4/10 text-chart-4",
    bar: "bg-chart-4",
    text: "text-chart-4",
    dot: "bg-chart-4",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--chart-4)_35%,transparent)]",
    border: "border-chart-4/55",
  },
  teal: {
    icon: "border-chart-3/55 bg-chart-3/10 text-chart-3",
    bar: "bg-chart-3",
    text: "text-chart-3",
    dot: "bg-chart-3",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--chart-3)_35%,transparent)]",
    border: "border-chart-3/55",
  },
  violet: {
    icon: "border-chart-5/55 bg-chart-5/10 text-chart-5",
    bar: "bg-chart-5",
    text: "text-chart-5",
    dot: "bg-chart-5",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--chart-5)_35%,transparent)]",
    border: "border-chart-5/55",
  },
  outcome: {
    icon: "border-emerald-500/55 bg-emerald-500/10 text-emerald-500",
    bar: "bg-emerald-500",
    text: "text-emerald-500",
    dot: "bg-emerald-500",
    glow: "shadow-[0_0_18px_color-mix(in_oklab,var(--color-emerald-500)_35%,transparent)]",
    border: "border-emerald-500/55",
  },
};

const statusMessages = [
  "Business event received.",
  "Resolving related context.",
  "Four actions started in parallel.",
  "Required email sent.",
  "Task created. Provider follow-up waiting.",
  "Internal handoff prepared.",
  "Provider follow-up resumed.",
  "Parallel work completed.",
  "Completed actions converging.",
  "Preparing the human-ready outcome.",
  "Clear next action ready.",
];

const cursorPositions = [2, 14, 34, 49, 60, 70, 76, 82, 86, 93, 98];
const elapsedTimes = [
  "00:00.2",
  "00:01.1",
  "00:02.7",
  "00:03.9",
  "00:04.8",
  "00:05.6",
  "00:06.1",
  "00:06.6",
  "00:06.9",
  "00:07.4",
  "00:07.8",
];
const phaseDelay = 720;
const completedHold = 2200;
const finalPhase = 10;

export function AutomationRelay() {
  const figureRef = useRef<HTMLElement | null>(null);
  const [phase, setPhase] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();
  const displayPhase = reduceMotion ? finalPhase : phase;
  const shouldRun = isInView && isPageVisible && !isPaused && !reduceMotion;

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 },
    );

    observer.observe(figure);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!shouldRun) return;

    const timer = window.setTimeout(
      () => {
        setPhase((currentPhase) =>
          currentPhase < finalPhase ? currentPhase + 1 : 0,
        );
      },
      phase === finalPhase ? completedHold : phaseDelay,
    );

    return () => window.clearTimeout(timer);
  }, [phase, shouldRun]);

  return (
    <figure ref={figureRef} className="mt-10 sm:mt-14">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            <span
              className={cn(
                "size-2 rounded-full bg-emerald-500",
                shouldRun && "animate-pulse",
              )}
            />
            <span>{reduceMotion ? "Completed trace" : "Live execution"}</span>
            <span aria-hidden="true">/</span>
            <span>{elapsedTimes[displayPhase]}</span>
          </div>
          <p className="mt-2 text-xl font-semibold tracking-[-0.02em] text-foreground">
            Event coordination
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {statusMessages[displayPhase]}
          </p>
        </div>

        {reduceMotion ? (
          <span className="shrink-0 pt-1 text-sm text-muted-foreground">
            Motion reduced
          </span>
        ) : (
          <button
            type="button"
            className="focus-ring inline-flex h-10 shrink-0 items-center gap-2 rounded-md border bg-background/80 px-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            onClick={() => setIsPaused((paused) => !paused)}
            aria-pressed={isPaused}
            aria-label={
              isPaused ? "Resume execution trace" : "Pause execution trace"
            }
          >
            {isPaused ? (
              <PlayIcon className="size-4" />
            ) : (
              <PauseIcon className="size-4" />
            )}
            {isPaused ? "Resume" : "Pause"}
          </button>
        )}
      </div>

      <div aria-hidden="true">
        <DesktopTrace phase={displayPhase} reduceMotion={reduceMotion} />
        <MobileTrace phase={displayPhase} reduceMotion={reduceMotion} />
      </div>

      <ol className="sr-only">
        {traceLanes.map((lane, index) => (
          <li key={lane.id}>
            {index + 1}. {lane.label}: {lane.detail}
          </li>
        ))}
      </ol>
      <p className="sr-only">
        The email, task, follow-up, and handoff run in parallel before the
        workflow produces a clear next action.
      </p>
    </figure>
  );
}

function DesktopTrace({
  phase,
  reduceMotion,
}: {
  phase: number;
  reduceMotion: boolean;
}) {
  const cursorPosition = cursorPositions[phase];

  return (
    <div className="mt-9 hidden border-y md:block">
      <div className="grid h-12 grid-cols-[15rem_minmax(0,1fr)_6.5rem] items-center border-b font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <span className="px-4">Execution lane</span>
        <div className="flex justify-between px-1">
          <span>00:00</span>
          <span>00:02</span>
          <span>00:04</span>
          <span>00:06</span>
          <span>00:08</span>
        </div>
        <span className="px-3 text-right">State</span>
      </div>

      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-60 right-26">
          {[0, 25, 50, 75, 100].map((position) => (
            <span
              key={position}
              className="absolute inset-y-0 border-l border-border/45"
              style={{ left: `${position}%` }}
            />
          ))}

          <span className="absolute left-[34%] top-30 h-80 border-l border-dashed border-border" />
          <span className="absolute left-[82%] top-50 h-80 border-l border-dashed border-border" />

          <motion.span
            initial={false}
            animate={{ left: `${cursorPosition}%` }}
            transition={{
              duration: reduceMotion ? 0 : 0.62,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute inset-y-0 z-20 w-px bg-primary/70"
          >
            <span className="absolute -left-1 top-2 size-2 rounded-full bg-primary shadow-[0_0_14px_color-mix(in_oklab,var(--primary)_65%,transparent)]" />
          </motion.span>
        </div>

        {traceLanes.map((lane) => (
          <DesktopLane
            key={lane.id}
            lane={lane}
            phase={phase}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}

function DesktopLane({
  lane,
  phase,
  reduceMotion,
}: {
  lane: TraceLane;
  phase: number;
  reduceMotion: boolean;
}) {
  const Icon = lane.icon;
  const styles = toneStyles[lane.tone];
  const status = getLaneStatus(lane, phase);
  const isActive = status === "running" || status === "waiting";

  return (
    <motion.div
      initial={false}
      animate={{ opacity: status === "queued" ? 0.46 : 1 }}
      transition={{ duration: reduceMotion ? 0 : 0.25 }}
      className={cn(
        "relative grid h-20 grid-cols-[15rem_minmax(0,1fr)_6.5rem] items-center border-b last:border-b-0",
        isActive && "bg-muted/20",
        lane.id === "outcome" && "bg-emerald-500/2.5",
      )}
    >
      <div className="flex min-w-0 items-center gap-3 px-4">
        <motion.span
          initial={false}
          animate={{ scale: isActive ? 1.08 : 1 }}
          transition={{
            duration: reduceMotion ? 0 : 0.28,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full border",
            styles.icon,
            isActive && styles.glow,
          )}
        >
          <Icon className="size-4.5" strokeWidth={1.8} />
        </motion.span>
        <div className="min-w-0">
          <p
            className={cn(
              "truncate text-sm font-semibold text-foreground",
              isActive && styles.text,
            )}
          >
            {lane.label}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {lane.detail}
          </p>
        </div>
      </div>

      <div className="relative h-full">
        <span className="absolute inset-x-0 top-1/2 h-px bg-border/70" />
        {lane.segments.map((segment, index) => (
          <TraceSpan
            key={`${lane.id}-${index}`}
            segment={segment}
            phase={phase}
            tone={lane.tone}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>

      <div className="flex justify-end px-3">
        <TraceState status={status} tone={lane.tone} />
      </div>
    </motion.div>
  );
}

function MobileTrace({
  phase,
  reduceMotion,
}: {
  phase: number;
  reduceMotion: boolean;
}) {
  return (
    <div className="mt-8 border-y md:hidden">
      <div className="flex items-center justify-between border-b py-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <span>Run log</span>
        <span>{elapsedTimes[phase]} elapsed</span>
      </div>

      <div className="relative">
        <span className="absolute bottom-10 left-[1.15rem] top-10 w-px bg-border" />
        <motion.span
          initial={false}
          animate={{ scaleY: cursorPositions[phase] / 100 }}
          transition={{
            duration: reduceMotion ? 0 : 0.62,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute bottom-10 left-[1.15rem] top-10 z-10 w-px origin-top bg-primary"
        />

        {traceLanes.map((lane, index) => (
          <MobileLane
            key={lane.id}
            lane={lane}
            phase={phase}
            reduceMotion={reduceMotion}
            marksParallelStart={index === 2}
          />
        ))}
      </div>
    </div>
  );
}

function MobileLane({
  lane,
  phase,
  reduceMotion,
  marksParallelStart,
}: {
  lane: TraceLane;
  phase: number;
  reduceMotion: boolean;
  marksParallelStart: boolean;
}) {
  const Icon = lane.icon;
  const styles = toneStyles[lane.tone];
  const status = getLaneStatus(lane, phase);
  const isActive = status === "running" || status === "waiting";

  return (
    <div
      className={cn(
        "relative border-b py-5 pl-14 last:border-b-0",
        isActive && "bg-muted/20",
        lane.id === "outcome" && "bg-emerald-500/2.5",
      )}
    >
      {marksParallelStart ? (
        <span className="mb-3 block font-mono text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Four actions in parallel
        </span>
      ) : null}

      <motion.span
        initial={false}
        animate={{
          opacity: status === "queued" ? 0.45 : 1,
          scale: isActive ? 1.08 : 1,
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.25,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "absolute left-0 top-5 z-20 flex size-9 items-center justify-center rounded-full border bg-background",
          styles.icon,
          isActive && styles.glow,
        )}
      >
        <Icon className="size-4.5" strokeWidth={1.8} />
      </motion.span>

      <motion.div
        initial={false}
        animate={{ opacity: status === "queued" ? 0.46 : 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.25 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p
              className={cn(
                "text-sm font-semibold text-foreground",
                isActive && styles.text,
              )}
            >
              {lane.label}
            </p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              {lane.detail}
            </p>
          </div>
          <TraceState status={status} tone={lane.tone} />
        </div>

        <div className="relative mt-4 h-2">
          <span className="absolute inset-x-0 top-1/2 h-px bg-border/70" />
          {lane.segments.map((segment, index) => (
            <TraceSpan
              key={`${lane.id}-mobile-${index}`}
              segment={segment}
              phase={phase}
              tone={lane.tone}
              reduceMotion={reduceMotion}
              compact
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function TraceSpan({
  segment,
  phase,
  tone,
  reduceMotion,
  compact = false,
}: {
  segment: TraceSegment;
  phase: number;
  tone: TraceTone;
  reduceMotion: boolean;
  compact?: boolean;
}) {
  const styles = toneStyles[tone];
  const progress = getSegmentProgress(segment, phase);
  const isWait = segment.kind === "wait";

  return (
    <span
      className={cn(
        "absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-full",
        compact ? "h-1.5" : "h-2",
      )}
      style={{
        left: `${segment.start}%`,
        width: `${segment.end - segment.start}%`,
      }}
    >
      <motion.span
        initial={false}
        animate={{ scaleX: progress, opacity: progress === 0 ? 0 : 1 }}
        transition={{
          duration: reduceMotion ? 0 : 0.58,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "block size-full origin-left rounded-full",
          isWait
            ? cn("border border-dashed bg-background", styles.border)
            : styles.bar,
          progress > 0 && styles.glow,
        )}
      />
    </span>
  );
}

function TraceState({
  status,
  tone,
}: {
  status: TraceStatus;
  tone: TraceTone;
}) {
  const styles = toneStyles[tone];
  const labels: Record<TraceStatus, string> = {
    queued: "Queued",
    running: "Running",
    waiting: "Waiting",
    done: "Done",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold",
        status === "queued" ? "text-muted-foreground" : styles.text,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          status === "queued" ? "bg-border" : styles.dot,
          status === "running" && "animate-pulse",
        )}
      />
      {labels[status]}
    </span>
  );
}

function getLaneStatus(lane: TraceLane, phase: number): TraceStatus {
  if (phase < lane.startPhase) return "queued";
  if (phase >= lane.donePhase) return "done";
  if (
    lane.waitingFrom !== undefined &&
    lane.waitingUntil !== undefined &&
    phase >= lane.waitingFrom &&
    phase < lane.waitingUntil
  ) {
    return "waiting";
  }
  return "running";
}

function getSegmentProgress(segment: TraceSegment, phase: number) {
  if (phase < segment.startPhase) return 0;
  if (phase >= segment.endPhase) return 1;

  const duration = Math.max(1, segment.endPhase - segment.startPhase);
  return Math.min(
    1,
    Math.max(0.14, (phase - segment.startPhase + 0.2) / duration),
  );
}
