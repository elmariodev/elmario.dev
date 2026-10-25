"use client";

import { useEffect, useRef, useState } from "react";
import {
  BellRingIcon,
  CalendarClockIcon,
  CheckIcon,
  CheckCircle2Icon,
  CloudUploadIcon,
  DatabaseZapIcon,
  FileCheck2Icon,
  FileCogIcon,
  ListFilterIcon,
  ListTodoIcon,
  MailIcon,
  MessageSquareIcon,
  PauseIcon,
  PlayIcon,
  RadarIcon,
  RefreshCwIcon,
  SendIcon,
  ShieldCheckIcon,
  TriangleAlertIcon,
  UserCheckIcon,
  UsersIcon,
  WebhookIcon,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type NodeId =
  | "trigger"
  | "logic"
  | "core"
  | "actionA"
  | "actionB"
  | "actionC"
  | "outcome";

type NodeTone =
  | "trigger"
  | "logic"
  | "core"
  | "blue"
  | "amber"
  | "teal"
  | "outcome";

type RelayState = "idle" | "active" | "complete";

type NodeContent = {
  label: string;
  detail: string;
  icon: LucideIcon;
  tone: NodeTone;
};

type Workflow = {
  id: string;
  title: string;
  summary: string;
  trigger: NodeContent;
  logic: NodeContent;
  actions: [NodeContent, NodeContent, NodeContent];
  outcome: NodeContent;
};

type NetworkNode = NodeContent & {
  id: NodeId;
  x: number;
  y: number;
};

type NetworkRoute = {
  id: string;
  path: string;
  step: number;
  tone: NodeTone;
};

type NetworkLayout = {
  width: number;
  height: number;
  positions: Record<NodeId, { x: number; y: number }>;
  routes: NetworkRoute[];
};

const workflows: Workflow[] = [
  {
    id: "scheduled-safeguard",
    title: "Scheduled check",
    summary: "A daily job finds records that need attention and assigns them.",
    trigger: {
      label: "Schedule",
      detail: "watch window reached",
      icon: CalendarClockIcon,
      tone: "trigger",
    },
    logic: {
      label: "Eligibility",
      detail: "records filtered",
      icon: ListFilterIcon,
      tone: "logic",
    },
    actions: [
      {
        label: "Create task",
        detail: "context included",
        icon: ListTodoIcon,
        tone: "blue",
      },
      {
        label: "Send email",
        detail: "recipient selected",
        icon: MailIcon,
        tone: "amber",
      },
      {
        label: "Set reminder",
        detail: "follow-up scheduled",
        icon: BellRingIcon,
        tone: "teal",
      },
    ],
    outcome: {
      label: "Assigned",
      detail: "owner has the task",
      icon: UserCheckIcon,
      tone: "outcome",
    },
  },
  {
    id: "event-coordination",
    title: "Record change",
    summary: "A record changes and every system that depends on it is updated.",
    trigger: {
      label: "Record event",
      detail: "change received",
      icon: WebhookIcon,
      tone: "trigger",
    },
    logic: {
      label: "Add context",
      detail: "related data joined",
      icon: DatabaseZapIcon,
      tone: "logic",
    },
    actions: [
      {
        label: "Update data",
        detail: "state synchronized",
        icon: RefreshCwIcon,
        tone: "blue",
      },
      {
        label: "Send message",
        detail: "channel selected",
        icon: MessageSquareIcon,
        tone: "amber",
      },
      {
        label: "Prepare handoff",
        detail: "owner informed",
        icon: UsersIcon,
        tone: "teal",
      },
    ],
    outcome: {
      label: "Systems aligned",
      detail: "work can continue",
      icon: ShieldCheckIcon,
      tone: "outcome",
    },
  },
  {
    id: "document-delivery",
    title: "Document delivery",
    summary: "A scheduled job builds a file, stores a copy, and sends it.",
    trigger: {
      label: "Timed run",
      detail: "source data ready",
      icon: CalendarClockIcon,
      tone: "trigger",
    },
    logic: {
      label: "Validate data",
      detail: "requirements checked",
      icon: FileCheck2Icon,
      tone: "logic",
    },
    actions: [
      {
        label: "Build file",
        detail: "document assembled",
        icon: FileCogIcon,
        tone: "blue",
      },
      {
        label: "Store copy",
        detail: "durable record written",
        icon: CloudUploadIcon,
        tone: "amber",
      },
      {
        label: "Deliver",
        detail: "recipient notified",
        icon: SendIcon,
        tone: "teal",
      },
    ],
    outcome: {
      label: "Audit logged",
      detail: "delivery recorded",
      icon: CheckCircle2Icon,
      tone: "outcome",
    },
  },
  {
    id: "exception-recovery",
    title: "Missed deadline",
    summary: "When something stops, a task opens and the owner is notified.",
    trigger: {
      label: "Deadline",
      detail: "watch window reached",
      icon: RadarIcon,
      tone: "trigger",
    },
    logic: {
      label: "Detect issue",
      detail: "normal path stopped",
      icon: TriangleAlertIcon,
      tone: "logic",
    },
    actions: [
      {
        label: "Open task",
        detail: "exception described",
        icon: ListTodoIcon,
        tone: "blue",
      },
      {
        label: "Remind team",
        detail: "follow-up scheduled",
        icon: BellRingIcon,
        tone: "amber",
      },
      {
        label: "Notify owner",
        detail: "context delivered",
        icon: MailIcon,
        tone: "teal",
      },
    ],
    outcome: {
      label: "Resolved",
      detail: "workflow closed",
      icon: CheckCircle2Icon,
      tone: "outcome",
    },
  },
];

const desktopLayout: NetworkLayout = {
  width: 700,
  height: 400,
  positions: {
    trigger: { x: 55, y: 200 },
    logic: { x: 180, y: 200 },
    core: { x: 320, y: 200 },
    actionA: { x: 500, y: 60 },
    actionB: { x: 545, y: 200 },
    actionC: { x: 500, y: 340 },
    outcome: { x: 660, y: 200 },
  },
  routes: [
    {
      id: "trigger-logic",
      path: "M95 200 C110 200 125 200 140 200",
      step: 1,
      tone: "logic",
    },
    {
      id: "logic-core",
      path: "M220 200 C235 200 249 200 264 200",
      step: 3,
      tone: "core",
    },
    {
      id: "core-action-a",
      path: "M367 168 C414 143 416 60 460 60",
      step: 5,
      tone: "blue",
    },
    {
      id: "core-action-b",
      path: "M376 200 C416 200 465 200 505 200",
      step: 7,
      tone: "amber",
    },
    {
      id: "core-action-c",
      path: "M367 232 C414 257 416 340 460 340",
      step: 9,
      tone: "teal",
    },
    {
      id: "action-a-outcome",
      path: "M540 60 C594 60 594 153 625 178",
      step: 11,
      tone: "outcome",
    },
    {
      id: "action-b-outcome",
      path: "M585 200 C598 200 612 200 625 200",
      step: 11,
      tone: "outcome",
    },
    {
      id: "action-c-outcome",
      path: "M540 340 C594 340 594 247 625 222",
      step: 11,
      tone: "outcome",
    },
  ],
};

const mobileLayout: NetworkLayout = {
  width: 360,
  height: 470,
  positions: {
    trigger: { x: 45, y: 235 },
    logic: { x: 125, y: 100 },
    core: { x: 180, y: 235 },
    actionA: { x: 285, y: 80 },
    actionB: { x: 305, y: 235 },
    actionC: { x: 285, y: 390 },
    outcome: { x: 115, y: 385 },
  },
  routes: [
    {
      id: "trigger-logic",
      path: "M65 215 C76 174 98 126 108 116",
      step: 1,
      tone: "logic",
    },
    {
      id: "logic-core",
      path: "M145 116 C157 150 168 186 176 196",
      step: 3,
      tone: "core",
    },
    {
      id: "core-action-a",
      path: "M207 205 C226 155 246 102 263 91",
      step: 5,
      tone: "blue",
    },
    {
      id: "core-action-b",
      path: "M220 235 C246 235 263 235 283 235",
      step: 7,
      tone: "amber",
    },
    {
      id: "core-action-c",
      path: "M207 265 C226 315 246 368 263 379",
      step: 9,
      tone: "teal",
    },
    {
      id: "action-a-outcome",
      path: "M279 103 C266 190 191 325 134 368",
      step: 11,
      tone: "outcome",
    },
    {
      id: "action-b-outcome",
      path: "M284 250 C243 278 180 337 134 371",
      step: 11,
      tone: "outcome",
    },
    {
      id: "action-c-outcome",
      path: "M263 390 C219 390 171 388 137 385",
      step: 11,
      tone: "outcome",
    },
  ],
};

const nodeSteps: Record<NodeId, number> = {
  trigger: 0,
  logic: 2,
  core: 4,
  actionA: 6,
  actionB: 8,
  actionC: 10,
  outcome: 12,
};

const toneStyles: Record<
  NodeTone,
  {
    node: string;
    ring: string;
    stroke: string;
    fill: string;
    text: string;
  }
> = {
  trigger: {
    node: "border-chart-1/65 bg-chart-1/12 text-chart-1",
    ring: "bg-chart-1/20",
    stroke: "stroke-chart-1",
    fill: "fill-chart-1",
    text: "text-chart-1",
  },
  logic: {
    node: "border-chart-5/65 bg-chart-5/12 text-chart-5",
    ring: "bg-chart-5/20",
    stroke: "stroke-chart-5",
    fill: "fill-chart-5",
    text: "text-chart-5",
  },
  core: {
    node: "border-primary/70 bg-primary text-primary-foreground",
    ring: "bg-primary/20",
    stroke: "stroke-primary",
    fill: "fill-primary",
    text: "text-primary",
  },
  blue: {
    node: "border-chart-2/65 bg-chart-2/12 text-chart-2",
    ring: "bg-chart-2/20",
    stroke: "stroke-chart-2",
    fill: "fill-chart-2",
    text: "text-chart-2",
  },
  amber: {
    node: "border-chart-4/65 bg-chart-4/12 text-chart-4",
    ring: "bg-chart-4/20",
    stroke: "stroke-chart-4",
    fill: "fill-chart-4",
    text: "text-chart-4",
  },
  teal: {
    node: "border-chart-3/65 bg-chart-3/12 text-chart-3",
    ring: "bg-chart-3/20",
    stroke: "stroke-chart-3",
    fill: "fill-chart-3",
    text: "text-chart-3",
  },
  outcome: {
    node: "border-emerald-500/65 bg-emerald-500/12 text-emerald-500",
    ring: "bg-emerald-500/20",
    stroke: "stroke-emerald-500",
    fill: "fill-emerald-500",
    text: "text-emerald-500",
  },
};

const phaseDelay = 640;
const completedHold = 1800;
const finalPhase = 12;

export function AutomationWorkflowLoop() {
  const figureRef = useRef<HTMLElement | null>(null);
  const [workflowIndex, setWorkflowIndex] = useState(0);
  const [phase, setPhase] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const displayWorkflowIndex = reduceMotion ? 0 : workflowIndex;
  const displayPhase = reduceMotion ? finalPhase : phase;
  const workflow = workflows[displayWorkflowIndex];
  const shouldRun =
    isInView && isPageVisible && !isPaused && !reduceMotion;

  useEffect(() => {
    const figure = figureRef.current;
    if (!figure) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.35 },
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
        if (phase < finalPhase) {
          setPhase((currentPhase) => currentPhase + 1);
          return;
        }

        setWorkflowIndex((index) => (index + 1) % workflows.length);
        setPhase(0);
      },
      phase === finalPhase ? completedHold : phaseDelay,
    );

    return () => window.clearTimeout(timer);
  }, [phase, shouldRun]);

  return (
    <figure
      ref={figureRef}
      className="settle-in w-full max-w-4xl lg:justify-self-end"
    >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">
              {workflow.title}
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
              {workflow.summary}
            </p>
          </div>

          {reduceMotion ? (
            <span className="shrink-0 pt-1 text-xs text-muted-foreground">
              Motion reduced
            </span>
          ) : (
            <button
              type="button"
              className="focus-ring inline-flex h-9 shrink-0 items-center gap-2 rounded-md border bg-background/80 px-3 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-pressed={isPaused}
              aria-label={
                isPaused
                  ? "Resume workflow animation"
                  : "Pause workflow animation"
              }
            >
              {isPaused ? (
                <PlayIcon className="size-3.5" />
              ) : (
                <PauseIcon className="size-3.5" />
              )}
              {isPaused ? "Resume" : "Pause"}
            </button>
          )}
        </div>

        <div aria-hidden="true" className="mt-2">
          <NetworkCanvas
            workflow={workflow}
            workflowIndex={displayWorkflowIndex}
            phase={displayPhase}
            reduceMotion={reduceMotion}
            layout={mobileLayout}
            className="sm:hidden"
          />
          <NetworkCanvas
            workflow={workflow}
            workflowIndex={displayWorkflowIndex}
            phase={displayPhase}
            reduceMotion={reduceMotion}
            layout={desktopLayout}
            className="hidden sm:block"
          />
        </div>

        <p className="sr-only">
          Animated examples show a signal entering an automation layer,
          passing through validation, branching into coordinated actions, and
          converging on a completed outcome. The examples are generalized and
          contain no production data or system topology.
        </p>

    </figure>
  );
}

function NetworkCanvas({
  workflow,
  workflowIndex,
  phase,
  reduceMotion,
  layout,
  className,
}: {
  workflow: Workflow;
  workflowIndex: number;
  phase: number;
  reduceMotion: boolean;
  layout: NetworkLayout;
  className?: string;
}) {
  const nodes = getNodes(workflow, layout);

  return (
    <div
      className={cn("relative w-full", className)}
      style={{ aspectRatio: `${layout.width} / ${layout.height}` }}
    >
      <div
        className="absolute left-[46%] top-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-2xl sm:size-44"
        aria-hidden="true"
      />

      <svg
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="absolute inset-0 size-full overflow-visible"
      >
        {layout.routes.map((route) => (
          <RelayRoute
            key={route.id}
            route={route}
            state={getRelayState(phase, route.step)}
            packetKey={`${workflowIndex}-${phase}-${route.id}`}
            reduceMotion={reduceMotion}
          />
        ))}
      </svg>

      {nodes.map((node) => (
        <NetworkNode
          key={`${workflow.id}-${node.id}`}
          node={node}
          state={getRelayState(phase, nodeSteps[node.id])}
          layout={layout}
          reduceMotion={reduceMotion}
        />
      ))}
    </div>
  );
}

function NetworkNode({
  node,
  state,
  layout,
  reduceMotion,
}: {
  node: NetworkNode;
  state: RelayState;
  layout: NetworkLayout;
  reduceMotion: boolean;
}) {
  const Icon = node.icon;
  const styles = toneStyles[node.tone];
  const isCore = node.id === "core";
  const isActive = state === "active";
  const isComplete = state === "complete";

  return (
    <div
      className="pointer-events-none absolute text-center"
      style={{
        left: `${(node.x / layout.width) * 100}%`,
        top: `${(node.y / layout.height) * 100}%`,
      }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.12 : 1,
          opacity: state === "idle" ? 0.4 : isComplete ? 0.84 : 1,
        }}
        transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="relative -translate-x-1/2 -translate-y-1/2"
      >
        {isActive && !reduceMotion ? (
          <motion.span
            className={cn(
              "absolute inset-0 rounded-full",
              styles.ring,
            )}
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.55, opacity: 0 }}
            transition={{ duration: 0.72, ease: "easeOut", repeat: Infinity }}
          />
        ) : null}

        {isCore ? (
          <span className="absolute -inset-2 rounded-full border border-dashed border-primary/35" />
        ) : null}

        <span
          className={cn(
            "relative flex items-center justify-center rounded-full border-2 bg-background transition-colors",
            isCore ? "size-20 sm:size-28" : "size-12 sm:size-20",
            styles.node,
          )}
        >
          <Icon
            className={isCore ? "size-8 sm:size-11" : "size-5 sm:size-8"}
            strokeWidth={isCore ? 1.6 : 1.8}
          />
        </span>

        {isComplete ? (
          <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full border-2 border-background bg-emerald-500 text-white sm:size-5">
            <CheckIcon className="size-2.5 sm:size-3" strokeWidth={3} />
          </span>
        ) : null}
      </motion.div>

      <div
        className={cn(
          "absolute left-0 top-8 w-20 -translate-x-1/2 sm:top-12 sm:w-24",
          isCore && "top-12 w-24 sm:top-16 sm:w-28",
        )}
      >
        <p
          className={cn(
            "text-[0.62rem] font-semibold leading-3 text-foreground sm:text-[0.7rem] sm:leading-4",
            isActive && styles.text,
          )}
        >
          {node.label}
        </p>
        <p className="mt-0.5 hidden text-[0.62rem] leading-3 text-muted-foreground sm:block">
          {node.detail}
        </p>
      </div>
    </div>
  );
}

function RelayRoute({
  route,
  state,
  packetKey,
  reduceMotion,
}: {
  route: NetworkRoute;
  state: RelayState;
  packetKey: string;
  reduceMotion: boolean;
}) {
  const styles = toneStyles[route.tone];

  return (
    <>
      <path
        d={route.path}
        className="fill-none stroke-border/80 stroke-[1.4]"
        strokeDasharray="3 8"
        vectorEffect="non-scaling-stroke"
      />
      <motion.path
        d={route.path}
        initial={false}
        animate={{
          pathLength: state === "idle" ? 0 : 1,
          opacity: state === "idle" ? 0 : state === "active" ? 1 : 0.5,
        }}
        transition={{
          duration: reduceMotion ? 0 : state === "idle" ? 0.18 : 0.58,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn("fill-none stroke-[2.4]", styles.stroke)}
        vectorEffect="non-scaling-stroke"
      />

      {state === "active" && !reduceMotion ? (
        <g key={packetKey}>
          <circle r="8" className={cn(styles.fill, "opacity-20")}>
            <animateMotion
              path={route.path}
              dur="0.62s"
              begin="0s"
              fill="freeze"
            />
          </circle>
          <circle r="3.5" className={styles.fill}>
            <animateMotion
              path={route.path}
              dur="0.62s"
              begin="0s"
              fill="freeze"
            />
          </circle>
        </g>
      ) : null}
    </>
  );
}

function getNodes(workflow: Workflow, layout: NetworkLayout): NetworkNode[] {
  const content: Record<NodeId, NodeContent> = {
    trigger: workflow.trigger,
    logic: workflow.logic,
    core: {
      label: "Automation",
      detail: "runs each step",
      icon: WorkflowIcon,
      tone: "core",
    },
    actionA: workflow.actions[0],
    actionB: workflow.actions[1],
    actionC: workflow.actions[2],
    outcome: workflow.outcome,
  };

  return (Object.keys(content) as NodeId[]).map((id) => ({
    id,
    ...content[id],
    ...layout.positions[id],
  }));
}

function getRelayState(phase: number, step: number): RelayState {
  if (phase < step) return "idle";
  if (phase === step) return "active";
  return "complete";
}
