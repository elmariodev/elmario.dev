"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpIcon,
  BotIcon,
  CalendarClockIcon,
  CheckCircle2Icon,
  CheckIcon,
  CodeXmlIcon,
  GitPullRequestIcon,
  ListChecksIcon,
  MailIcon,
  MailOpenIcon,
  MessageCircleIcon,
  MessageSquareTextIcon,
  PauseIcon,
  PlaneTakeoffIcon,
  PlayIcon,
  ScanSearchIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
  TicketIcon,
  TimerIcon,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type Agent = {
  name: string;
  role: string;
  icon: LucideIcon;
  lines: [string, string, string];
};

// "avatar" renders Mario's illustrated avatar instead of an icon.
type Badge = { label: string; icon: LucideIcon | "avatar" };

type Scenario = {
  id: string;
  source: Badge;
  prompt: string;
  agents: [Agent, Agent, Agent];
  result: { icon: LucideIcon; title: string; checks: [string, string] };
  stamp: Badge;
};

const scenarios: Scenario[] = [
  {
    id: "flight-sale",
    source: { label: "Customer chat", icon: MessageCircleIcon },
    prompt: "2 seats Bogota to Lima on Friday, under $400 each?",
    agents: [
      {
        name: "Fare search",
        role: "finds the best option",
        icon: SearchIcon,
        lines: ["search 140 fares", "filter under $400", "best: $362 each"],
      },
      {
        name: "Booking",
        role: "books the seats",
        icon: TicketIcon,
        lines: ["hold 2 seats", "add traveler names", "tickets issued"],
      },
      {
        name: "Messaging",
        role: "talks to the customer",
        icon: SendIcon,
        lines: ["write confirmation", "attach itinerary", "sent to customer"],
      },
    ],
    result: {
      icon: PlaneTakeoffIcon,
      title: "Flight sold: BOG to LIM, Fri 08:40",
      checks: ["$724 total", "itinerary sent"],
    },
    stamp: { label: "No human needed", icon: BotIcon },
  },
  {
    id: "supplier-change",
    source: { label: "Supplier email", icon: MailIcon },
    prompt: "The hotel moved the Cusco check-in to March 14",
    agents: [
      {
        name: "Reader",
        role: "understands the email",
        icon: MailOpenIcon,
        lines: ["read the email", "match the booking", "new dates found"],
      },
      {
        name: "Trip updater",
        role: "fixes the itinerary",
        icon: CalendarClockIcon,
        lines: ["move the hotel night", "shift the transfer", "trip updated"],
      },
      {
        name: "Notifier",
        role: "tells the traveler",
        icon: MessageSquareTextIcon,
        lines: ["draft the email", "check the tone", "traveler notified"],
      },
    ],
    result: {
      icon: CheckCircle2Icon,
      title: "Trip fixed before anyone asked",
      checks: ["3 records changed", "traveler notified"],
    },
    stamp: { label: "Done in 40 s", icon: TimerIcon },
  },
  {
    id: "code-change",
    source: { label: "Task from Mario", icon: "avatar" },
    prompt: "Add a calendar connector to the agents",
    agents: [
      {
        name: "Planner",
        role: "splits the work",
        icon: ListChecksIcon,
        lines: ["read connector docs", "split into 3 tasks", "plan ready"],
      },
      {
        name: "Builder",
        role: "writes the code",
        icon: CodeXmlIcon,
        lines: ["write calendar.ts", "add OAuth scopes", "18 tests passed"],
      },
      {
        name: "Reviewer",
        role: "checks the diff",
        icon: ScanSearchIcon,
        lines: ["read the diff", "check permissions", "approved"],
      },
    ],
    result: {
      icon: GitPullRequestIcon,
      title: "Pull request ready",
      checks: ["18 tests passed", "1 approval"],
    },
    stamp: { label: "Reviewed by Mario", icon: "avatar" },
  },
];

// Agent slots keep the same color in every scenario.
const slotTones = [
  {
    color: "var(--chart-5)",
    text: "text-chart-5",
    soft: "bg-chart-5/12",
    bar: "bg-chart-5",
    stroke: "stroke-chart-5",
  },
  {
    color: "var(--chart-4)",
    text: "text-chart-4",
    soft: "bg-chart-4/12",
    bar: "bg-chart-4",
    stroke: "stroke-chart-4",
  },
  {
    color: "var(--chart-3)",
    text: "text-chart-3",
    soft: "bg-chart-3/12",
    bar: "bg-chart-3",
    stroke: "stroke-chart-3",
  },
] as const;

const primaryBeam = { color: "var(--primary)", stroke: "stroke-primary" };
const successBeam = { color: "#10b981", stroke: "stroke-emerald-500" };

// Timeline of one scenario, in milliseconds. The first agent works alone,
// then the other two run in parallel.
const tick = 50;
const typeStart = 300;
const typeSpeed = 30;
const submitAt = 2000;
const agentWindows = [
  { start: 2500, lines: [2800, 3400, 4000], end: 4300 },
  { start: 4600, lines: [4900, 5600, 6300], end: 6700 },
  { start: 4600, lines: [5200, 6000, 6800], end: 7100 },
] as const;
const resultAt = 7500;
const checksAt = [7900, 8200] as const;
const stampAt = 8800;
const fadeAt = 10600;
const scenarioLength = 11200;
const reducedMotionTime = 9400;

type Box = { x: number; y: number; w: number; h: number };

type Layout = {
  width: number;
  height: number;
  compact: boolean;
  prompt: Box;
  orchestrator: { x: number; y: number; size: number };
  cards: [Box, Box, Box];
  log?: Box;
  result: Box;
  beams: {
    input: string;
    agents: [string, string, string];
    result: string[];
  };
};

const desktopLayout: Layout = {
  width: 720,
  height: 480,
  compact: false,
  prompt: { x: 90, y: 0, w: 540, h: 52 },
  orchestrator: { x: 360, y: 142, size: 72 },
  cards: [
    { x: 30, y: 232, w: 200, h: 150 },
    { x: 260, y: 232, w: 200, h: 150 },
    { x: 490, y: 232, w: 200, h: 150 },
  ],
  result: { x: 90, y: 414, w: 540, h: 62 },
  beams: {
    input: "M360 52 L360 106",
    agents: [
      "M360 178 C360 210 130 200 130 232",
      "M360 178 L360 232",
      "M360 178 C360 210 590 200 590 232",
    ],
    result: [
      "M130 382 C130 405 300 395 330 414",
      "M360 382 L360 414",
      "M590 382 C590 405 420 395 390 414",
    ],
  },
};

const mobileLayout: Layout = {
  width: 360,
  height: 596,
  compact: true,
  prompt: { x: 0, y: 0, w: 360, h: 62 },
  orchestrator: { x: 180, y: 136, size: 64 },
  cards: [
    { x: 0, y: 208, w: 110, h: 104 },
    { x: 125, y: 208, w: 110, h: 104 },
    { x: 250, y: 208, w: 110, h: 104 },
  ],
  log: { x: 0, y: 332, w: 360, h: 132 },
  result: { x: 0, y: 498, w: 360, h: 96 },
  beams: {
    input: "M180 62 L180 104",
    agents: [
      "M180 168 C180 192 55 184 55 208",
      "M180 168 L180 208",
      "M180 168 C180 192 305 184 305 208",
    ],
    result: ["M180 464 L180 498"],
  },
};

type AgentState = "idle" | "working" | "done";
type BeamState = "idle" | "active" | "done";

export function AgentOrchestration() {
  const figureRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [clock, setClock] = useState({ index: 0, t: 0 });
  const [stageWidth, setStageWidth] = useState<number | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [isPageVisible, setIsPageVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const shouldRun = isInView && isPageVisible && !isPaused && !reduceMotion;
  const scenario = scenarios[reduceMotion ? 0 : clock.index];
  const t = reduceMotion ? reducedMotionTime : clock.t;

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
    const stage = stageRef.current;
    if (!stage) return;

    const observer = new ResizeObserver(([entry]) =>
      setStageWidth(entry.contentRect.width),
    );

    observer.observe(stage);
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

    const timer = window.setInterval(() => {
      setClock(({ index, t: elapsed }) =>
        elapsed + tick >= scenarioLength
          ? { index: (index + 1) % scenarios.length, t: 0 }
          : { index, t: elapsed + tick },
      );
    }, tick);

    return () => window.clearInterval(timer);
  }, [shouldRun]);

  const layout =
    stageWidth !== null && stageWidth < 560 ? mobileLayout : desktopLayout;
  const scale =
    stageWidth === null ? 1 : Math.min(stageWidth / layout.width, 1.12);

  return (
    <figure
      ref={figureRef}
      className="settle-in w-full max-w-4xl lg:justify-self-end"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground">
            AI agents at work
          </p>
          <p className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            One agent splits the job, specialist agents run the parts in
            parallel. Examples, no real data.
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
              isPaused ? "Resume agent animation" : "Pause agent animation"
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

      <div
        ref={stageRef}
        aria-hidden="true"
        className={cn(
          "relative mt-6 w-full transition-opacity duration-300",
          stageWidth === null && "opacity-0",
        )}
        style={{
          height: layout.height * scale,
          aspectRatio:
            stageWidth === null
              ? `${layout.width} / ${layout.height}`
              : undefined,
        }}
      >
        <motion.div
          className="absolute top-0 origin-top-left"
          style={{
            width: layout.width,
            height: layout.height,
            left: stageWidth === null ? 0 : (stageWidth - layout.width * scale) / 2,
            scale,
          }}
          initial={false}
          animate={{ opacity: t >= fadeAt ? 0 : 1 }}
          transition={{ duration: 0.45 }}
        >
          <Stage
            key={scenario.id}
            scenario={scenario}
            layout={layout}
            t={t}
            running={shouldRun}
          />
        </motion.div>
      </div>

      <p className="sr-only">
        Animated examples of AI agents at work: a customer asks for flights
        and agents search fares, book the seats, and send the confirmation; a
        supplier email changes a trip and agents update it and notify the
        traveler; a coding task is planned, built, and reviewed by agents
        before Mario reviews it. The examples contain no real data.
      </p>
    </figure>
  );
}

function Stage({
  scenario,
  layout,
  t,
  running,
}: {
  scenario: Scenario;
  layout: Layout;
  t: number;
  running: boolean;
}) {
  const agentStates = agentWindows.map((span) => getAgentState(t, span));
  const lastAgentEnd = Math.max(...agentWindows.map((span) => span.end));
  const inputBeam = getBeamState(t, submitAt, agentWindows[0].start + 200);
  const resultBeam = getBeamState(t, lastAgentEnd, resultAt + 300);

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border) 1px, transparent 1.4px)",
          backgroundSize: "18px 18px",
          maskImage:
            "radial-gradient(ellipse at 50% 45%, black 30%, transparent 72%)",
        }}
      />

      <svg
        width={layout.width}
        height={layout.height}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        className="absolute inset-0 overflow-visible"
      >
        <Beam
          path={layout.beams.input}
          state={inputBeam}
          tone={primaryBeam}
          running={running}
        />
        {layout.beams.agents.map((path, index) => (
          <Beam
            key={path}
            path={path}
            state={toBeamState(agentStates[index])}
            tone={slotTones[index]}
            running={running}
          />
        ))}
        {layout.beams.result.map((path) => (
          <Beam
            key={path}
            path={path}
            state={resultBeam}
            tone={successBeam}
            running={running}
          />
        ))}
      </svg>

      <PromptBar scenario={scenario} box={layout.prompt} t={t} />

      <Orchestrator
        layout={layout}
        agentStates={agentStates}
        t={t}
        running={running}
      />

      {scenario.agents.map((agent, index) => (
        <AgentCard
          key={agent.name}
          agent={agent}
          slot={index}
          box={layout.cards[index]}
          state={agentStates[index]}
          t={t}
          compact={layout.compact}
          running={running}
        />
      ))}

      {layout.log ? (
        <LiveLog scenario={scenario} box={layout.log} t={t} />
      ) : null}

      <ResultCard
        scenario={scenario}
        box={layout.result}
        t={t}
        compact={layout.compact}
      />
    </>
  );
}

function PromptBar({
  scenario,
  box,
  t,
}: {
  scenario: Scenario;
  box: Box;
  t: number;
}) {
  const typedLength = Math.max(
    0,
    Math.min(
      scenario.prompt.length,
      Math.floor((t - typeStart) / typeSpeed),
    ),
  );
  const isTyped = typedLength === scenario.prompt.length;
  const isSent = t >= submitAt;

  return (
    <div
      className={cn(
        "absolute flex items-center gap-3 rounded-2xl border bg-card/85 px-3 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.6)] backdrop-blur transition-colors duration-500",
        isSent && "border-primary/45",
      )}
      style={boxStyle(box)}
    >
      <BadgeIcon
        badge={scenario.source}
        className="size-8 shrink-0 rounded-full bg-muted text-foreground"
      />

      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          {scenario.source.label}
        </p>
        <p className="text-[13px] font-medium leading-[18px] text-foreground">
          {scenario.prompt.slice(0, typedLength)}
          {!isSent ? (
            <span className="ml-px inline-block h-3.5 w-[2px] translate-y-0.5 animate-pulse bg-primary" />
          ) : null}
        </p>
      </div>

      <motion.span
        initial={false}
        animate={{ scale: isSent ? [1, 0.82, 1] : 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          isTyped
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isSent ? (
          <CheckIcon className="size-4" strokeWidth={2.6} />
        ) : (
          <ArrowUpIcon className="size-4" strokeWidth={2.4} />
        )}
      </motion.span>
    </div>
  );
}

function Orchestrator({
  layout,
  agentStates,
  t,
  running,
}: {
  layout: Layout;
  agentStates: AgentState[];
  t: number;
  running: boolean;
}) {
  const { x, y, size } = layout.orchestrator;
  const isBusy = t >= submitAt && agentStates.some((state) => state !== "done");
  const status =
    t < submitAt
      ? "Waiting for work"
      : t < agentWindows[1].start
        ? "Splitting the job"
        : agentStates.some((state) => state !== "done")
          ? "Agents in parallel"
          : "All done";

  return (
    <div className="absolute" style={{ left: x, top: y }}>
      <div
        className="relative -translate-x-1/2 -translate-y-1/2"
        style={{ width: size, height: size }}
      >
        <div
          className="absolute -inset-12 rounded-full bg-primary/25 blur-3xl transition-opacity duration-700"
          style={{ opacity: isBusy ? 1 : 0.35 }}
        />

        <div
          className={cn(
            "absolute -inset-3.5 rounded-full border border-dashed border-primary/45",
            running && "animate-[spin_14s_linear_infinite]",
          )}
        >
          {slotTones.map((tone, index) => {
            const angle = (index * 2 * Math.PI) / 3 - Math.PI / 2;
            return (
              <span
                key={tone.color}
                className={cn(
                  "absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-background transition-transform duration-300",
                  tone.bar,
                  agentStates[index] === "working" && "scale-150",
                )}
                style={{
                  left: `${50 + 50 * Math.cos(angle)}%`,
                  top: `${50 + 50 * Math.sin(angle)}%`,
                }}
              />
            );
          })}
        </div>

        {isBusy && running ? (
          <motion.span
            className="absolute inset-0 rounded-full bg-primary/35"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.7, opacity: 0 }}
            transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }}
          />
        ) : null}

        <div className="relative flex size-full items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_0_48px_-10px_var(--primary)]">
          <SparklesIcon
            className={layout.compact ? "size-7" : "size-8"}
            strokeWidth={1.8}
          />
        </div>
      </div>

      <div
        className="absolute w-36 -translate-y-1/2"
        style={{ left: size / 2 + 24, top: 0 }}
      >
        <p className="text-[12px] font-semibold leading-4 text-foreground">
          Orchestrator
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={status}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="font-mono text-[10px] leading-4 text-primary"
          >
            {status}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

function AgentCard({
  agent,
  slot,
  box,
  state,
  t,
  compact,
  running,
}: {
  agent: Agent;
  slot: number;
  box: Box;
  state: AgentState;
  t: number;
  compact: boolean;
  running: boolean;
}) {
  const tone = slotTones[slot];
  const span = agentWindows[slot];
  const Icon = agent.icon;
  const visibleLines = agent.lines.filter((_, index) => t >= span.lines[index]);
  const progress = clamp((t - span.start) / (span.end - span.start));

  return (
    <div
      className={cn(
        "absolute transition-[opacity,transform] duration-500",
        state === "idle" && "opacity-55",
        state === "working" && "-translate-y-1",
      )}
      style={boxStyle(box)}
    >
      <div className="relative size-full">
        {/* The sweep sits behind a translucent border, so the border and its
            corners stay visible while the light passes. */}
        {state === "working" && running ? (
          <div className="absolute inset-0 overflow-hidden rounded-xl">
            <div
              className="absolute inset-[-100%] animate-[spin_2.4s_linear_infinite]"
              style={{
                background: `conic-gradient(from 0deg, transparent 0 62%, ${tone.color} 86%, transparent 100%)`,
              }}
            />
          </div>
        ) : null}

        <div
          className={cn(
            "relative flex h-full flex-col rounded-xl border bg-card bg-clip-padding transition-[border-color,box-shadow] duration-500",
            compact ? "items-center p-2.5 text-center" : "p-3",
          )}
          style={{
            borderColor:
              state === "idle"
                ? "var(--border)"
                : `color-mix(in oklab, ${tone.color} 55%, transparent)`,
            boxShadow:
              state === "working"
                ? `0 0 28px -10px ${tone.color}`
                : "none",
          }}
        >
          {compact ? (
            <>
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-lg",
                  tone.soft,
                  tone.text,
                )}
              >
                <Icon className="size-4" strokeWidth={2} />
              </span>
              <p className="mt-2 text-[11px] font-semibold leading-4 text-foreground">
                {agent.name}
              </p>
              <StatusLabel state={state} tone={tone} />
            </>
          ) : (
            <>
              <div className="flex items-start gap-2.5">
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    tone.soft,
                    tone.text,
                  )}
                >
                  <Icon className="size-4" strokeWidth={2} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-semibold leading-4 text-foreground">
                    {agent.name}
                  </p>
                  <p className="text-[10px] leading-4 text-muted-foreground">
                    {agent.role}
                  </p>
                </div>
              </div>

              <ul className="mt-3 space-y-1">
                {visibleLines.map((line, index) => {
                  const isLast = index === agent.lines.length - 1;
                  return (
                    <motion.li
                      key={line}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className={cn(
                        "flex items-center gap-1.5 font-mono text-[10.5px] leading-[18px]",
                        isLast ? "text-emerald-500" : "text-muted-foreground",
                      )}
                    >
                      {isLast ? (
                        <CheckIcon className="size-3 shrink-0" strokeWidth={3} />
                      ) : (
                        <span className={cn("shrink-0", tone.text)}>{">"}</span>
                      )}
                      <span className="truncate">{line}</span>
                    </motion.li>
                  );
                })}
              </ul>
            </>
          )}

          <div className="mt-auto flex w-full items-center gap-2.5">
            {compact ? null : <StatusLabel state={state} tone={tone} />}
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-100 ease-linear",
                  state === "done" ? "bg-emerald-500" : tone.bar,
                )}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusLabel({
  state,
  tone,
}: {
  state: AgentState;
  tone: (typeof slotTones)[number];
}) {
  if (state === "done") {
    return (
      <span className="mt-0.5 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-500">
        <CheckIcon className="size-2.5" strokeWidth={3.5} />
        Done
      </span>
    );
  }

  return (
    <span
      className={cn(
        "mt-0.5 inline-flex items-center gap-1 font-mono text-[9px] font-bold uppercase tracking-[0.12em]",
        state === "working" ? tone.text : "text-muted-foreground",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          state === "working" ? cn(tone.bar, "animate-pulse") : "bg-border",
        )}
      />
      {state === "working" ? "Working" : "Queued"}
    </span>
  );
}

function LiveLog({
  scenario,
  box,
  t,
}: {
  scenario: Scenario;
  box: Box;
  t: number;
}) {
  const entries = scenario.agents
    .flatMap((agent, slot) =>
      agent.lines.map((line, index) => ({
        agent,
        slot,
        line,
        at: agentWindows[slot].lines[index],
        isLast: index === agent.lines.length - 1,
      })),
    )
    .filter((entry) => t >= entry.at)
    .sort((a, b) => a.at - b.at)
    .slice(-4);

  return (
    <div
      className="absolute rounded-xl border bg-card/85 px-3 py-2.5 backdrop-blur"
      style={boxStyle(box)}
    >
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
        Live log
      </p>
      <ul className="mt-1.5 space-y-0.5">
        {entries.map((entry) => (
          <motion.li
            key={`${entry.slot}-${entry.line}`}
            layout="position"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2 font-mono text-[11px] leading-[22px]"
          >
            <span
              className={cn(
                "w-[5.5rem] shrink-0 truncate font-bold",
                slotTones[entry.slot].text,
              )}
            >
              {entry.agent.name}
            </span>
            <span
              className={cn(
                "truncate",
                entry.isLast ? "text-emerald-500" : "text-muted-foreground",
              )}
            >
              {entry.line}
            </span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function ResultCard({
  scenario,
  box,
  t,
  compact,
}: {
  scenario: Scenario;
  box: Box;
  t: number;
  compact: boolean;
}) {
  const Icon = scenario.result.icon;

  return (
    <AnimatePresence>
      {t >= resultAt ? (
        <motion.div
          initial={{ opacity: 0, y: 14, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={cn(
            "absolute flex rounded-2xl border border-emerald-500/45 bg-card px-4 shadow-[0_16px_48px_-20px_rgba(16,185,129,0.55)]",
            compact
              ? "flex-col justify-center gap-2.5"
              : "items-center gap-3",
          )}
          style={boxStyle(box)}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Icon className="size-[18px]" strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-5 text-foreground">
                {scenario.result.title}
              </p>
              <div className="mt-0.5 flex gap-3">
                {scenario.result.checks.map((check, index) =>
                  t >= checksAt[index] ? (
                    <motion.span
                      key={check}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-500"
                    >
                      <CheckIcon className="size-3" strokeWidth={3} />
                      {check}
                    </motion.span>
                  ) : null,
                )}
              </div>
            </div>
          </div>

          {t >= stampAt ? (
            <motion.div
              initial={{ opacity: 0, scale: 1.8, rotate: -14 }}
              animate={{ opacity: 1, scale: 1, rotate: -5 }}
              transition={{ type: "spring", stiffness: 420, damping: 18 }}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-md border-2 border-primary px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-primary",
                compact && "self-end",
              )}
            >
              <BadgeIcon badge={scenario.stamp} className="size-4 rounded-full" />
              {scenario.stamp.label}
            </motion.div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Beam({
  path,
  state,
  tone,
  running,
}: {
  path: string;
  state: BeamState;
  tone: { color: string; stroke: string };
  running: boolean;
}) {
  return (
    <>
      <path
        d={path}
        className="fill-none stroke-border stroke-[1.5]"
        strokeDasharray="3 7"
      />
      <path
        d={path}
        className={cn(
          "fill-none stroke-2 transition-opacity duration-500",
          tone.stroke,
        )}
        style={{ opacity: state === "idle" ? 0 : state === "active" ? 0.35 : 0.5 }}
      />
      {state === "active" && running ? (
        <path
          d={path}
          pathLength={1}
          className={cn("beam-comet fill-none stroke-[3]", tone.stroke)}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${tone.color})` }}
        />
      ) : null}
    </>
  );
}

function BadgeIcon({ badge, className }: { badge: Badge; className?: string }) {
  if (badge.icon === "avatar") {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/icon.svg" alt="" className={className} />
    );
  }

  const Icon = badge.icon;
  return (
    <span className={cn("flex items-center justify-center", className)}>
      <Icon className="size-[60%]" strokeWidth={2} />
    </span>
  );
}

function getAgentState(
  t: number,
  span: (typeof agentWindows)[number],
): AgentState {
  if (t < span.start) return "idle";
  if (t < span.end) return "working";
  return "done";
}

function getBeamState(t: number, start: number, end: number): BeamState {
  if (t < start) return "idle";
  if (t < end) return "active";
  return "done";
}

function toBeamState(state: AgentState): BeamState {
  if (state === "working") return "active";
  return state;
}

function boxStyle(box: Box) {
  return { left: box.x, top: box.y, width: box.w, height: box.h };
}

function clamp(value: number) {
  return Math.min(1, Math.max(0, value));
}
