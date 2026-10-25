"use client";

import Image from "next/image";
import { useRef, useState, type MouseEvent } from "react";
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  LockKeyholeIcon,
  PlayIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Lightbox } from "@/components/ui/lightbox";
import { cn } from "@/lib/utils";

type Screenshot = {
  src: string;
  alt: string;
};

type FeaturedProject = {
  id: string;
  title: string;
  outcome: string;
  summary: string;
  role: string;
  note: string;
  metrics: { value: string; label: string }[];
  tech: string[];
  demo: {
    title: string;
    description: string;
    screenshots: Screenshot[];
    videoSrc: string;
    videoPoster: string;
  };
};

const featuredProjects: FeaturedProject[] = [
  {
    id: "emr",
    title: "Enterprise EMR Platform",
    outcome:
      "A multi-facility clinical platform built for the daily work of care teams.",
    summary:
      "Led architecture and full-stack delivery across charting, scheduling, prescriptions, labs, billing workflows, audit trails, and role-based access. Managed the path from requirements to production while guiding a three-person development team.",
    role: "Architecture, full-stack delivery, and technical leadership",
    note: "Production system protected by NDA. Demo uses sanitized data.",
    metrics: [
      { value: "100K+", label: "patients supported" },
      { value: "100+", label: "healthcare providers" },
    ],
    tech: ["TypeScript", "Next.js", "React", "PostgreSQL", "PHP"],
    demo: {
      title: "DemoEHR",
      description:
        "A sanitized product environment showing patient management, clinical notes, vitals, lab results, and multi-facility workflows. No production data is included.",
      screenshots: [
        {
          src: "https://assets.elmario.dev/demo-images/patient-overview.webp",
          alt: "DemoEHR patient overview with demographics and clinical navigation",
        },
        {
          src: "https://assets.elmario.dev/demo-images/patient-list.webp",
          alt: "DemoEHR patient list with filters and care status",
        },
        {
          src: "https://assets.elmario.dev/demo-images/clinical-note.webp",
          alt: "DemoEHR clinical note with vitals and SOAP documentation",
        },
        {
          src: "https://assets.elmario.dev/demo-images/provider-profile.webp",
          alt: "DemoEHR provider profile and facility access",
        },
      ],
      videoSrc: "https://assets.elmario.dev/emr-template.mp4",
      videoPoster:
        "https://assets.elmario.dev/demo-images/patient-overview.webp",
    },
  },
  {
    id: "insurance",
    title: "Insurance Verification Automation",
    outcome:
      "A web application and automation worker that turned an eight-hour queue into focused exception review.",
    summary:
      "Designed the dual-system architecture, built eligibility checks and batch processing, and created clear manual-review paths for cases automation could not resolve. Led a three-person team while owning critical implementation work.",
    role: "System design, automation, product delivery, and team leadership",
    note: "Production system is confidential. Demo uses sanitized data.",
    metrics: [
      { value: "200+", label: "verifications per day" },
      { value: "90%+", label: "automatic success rate" },
      { value: "<1 hr", label: "daily exception review" },
      { value: "150+", label: "manual hours saved monthly" },
    ],
    tech: ["TypeScript", "Node.js", "PostgreSQL", "Puppeteer", "Next.js"],
    demo: {
      title: "InsVerify",
      description:
        "A sanitized demonstration of queue management, eligibility results, batch processing, audit history, and exception handling. No client or patient data is included.",
      screenshots: [
        {
          src: "https://assets.elmario.dev/demo-images/insverify-1.webp",
          alt: "InsVerify queue management dashboard",
        },
        {
          src: "https://assets.elmario.dev/demo-images/insverify-2.webp",
          alt: "InsVerify patient verification status list",
        },
        {
          src: "https://assets.elmario.dev/demo-images/insverify-3.webp",
          alt: "InsVerify eligibility results and source documents",
        },
        {
          src: "https://assets.elmario.dev/demo-images/insverify-4.webp",
          alt: "InsVerify verification history and audit trail",
        },
      ],
      videoSrc: "https://assets.elmario.dev/insurance-verification.mp4",
      videoPoster: "https://assets.elmario.dev/demo-images/insverify-1.webp",
    },
  },
];

export function ProjectsSection() {
  const lightboxTriggerRef = useRef<HTMLButtonElement | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<{
    projectId: string;
    index: number;
  } | null>(null);

  const toggleProject = (projectId: string) => {
    setExpandedProject((current) => (current === projectId ? null : projectId));
    setPlayingVideo(null);
  };

  const openScreenshot = (
    event: MouseEvent<HTMLButtonElement>,
    projectId: string,
    index: number,
  ) => {
    lightboxTriggerRef.current = event.currentTarget;
    setSelectedScreenshot({ projectId, index });
  };

  const closeLightbox = () => {
    setSelectedScreenshot(null);
    window.requestAnimationFrame(() => lightboxTriggerRef.current?.focus());
  };

  const selectedImages = selectedScreenshot
    ? featuredProjects.find(
        (project) => project.id === selectedScreenshot.projectId,
      )?.demo.screenshots ?? []
    : [];

  return (
    <section id="work" className="section-container">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end lg:gap-20">
        <h2 className="section-heading">Selected systems.</h2>
        <p className="body-copy max-w-2xl lg:justify-self-end">
          Work where privacy, reliability, and operational speed have real
          consequences. Product evidence is visible first; deeper walkthroughs
          stay optional.
        </p>
      </div>

      <div className="mt-20 space-y-28 lg:mt-28 lg:space-y-36">
        {featuredProjects.map((project, projectIndex) => {
          const isExpanded = expandedProject === project.id;
          const isPlaying = playingVideo === project.id;
          const detailsId = `${project.id}-details`;

          return (
            <article key={project.id} className="border-t pt-10 lg:pt-14">
              <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
                <div
                  className={cn(
                    "lg:col-span-7",
                    projectIndex % 2 === 1 && "lg:order-2",
                  )}
                >
                  <button
                    type="button"
                    onClick={(event) =>
                      openScreenshot(event, project.id, 0)
                    }
                    className="focus-ring group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border bg-surface text-left"
                    aria-label={`Open ${project.title} screenshot gallery`}
                  >
                    <Image
                      src={project.demo.screenshots[0].src}
                      alt={project.demo.screenshots[0].alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover object-left-top transition-transform duration-500 group-hover:scale-[1.015]"
                    />
                  </button>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {project.demo.title}, sanitized product environment. Select
                    the image to inspect the gallery.
                  </p>
                </div>

                <div
                  className={cn(
                    "lg:col-span-5",
                    projectIndex % 2 === 1 && "lg:order-1",
                  )}
                >
                  <div className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                    <LockKeyholeIcon className="mt-1 size-4 shrink-0 text-primary" />
                    <span>{project.note}</span>
                  </div>

                  <h3 className="mt-6 text-4xl font-semibold tracking-[-0.035em] sm:text-5xl">
                    {project.title}
                  </h3>
                  <p className="mt-5 text-xl font-medium leading-8 text-primary">
                    {project.outcome}
                  </p>
                  <p className="body-copy mt-6">{project.summary}</p>

                  <p className="mt-7 text-sm font-semibold leading-6 text-foreground">
                    {project.role}
                  </p>

                  <dl className="mt-8 grid grid-cols-2 border-y">
                    {project.metrics.map((metric) => (
                      <div key={metric.label} className="py-6 pr-5">
                        <dt className="text-2xl font-semibold tracking-[-0.025em] sm:text-3xl">
                          {metric.value}
                        </dt>
                        <dd className="mt-1 text-sm leading-5 text-muted-foreground">
                          {metric.label}
                        </dd>
                      </div>
                    ))}
                  </dl>

                  <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                    {project.tech.map((tool) => (
                      <li key={tool}>{tool}</li>
                    ))}
                  </ul>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="mt-8 h-12 border-border bg-transparent px-5 text-base"
                    onClick={() => toggleProject(project.id)}
                    aria-expanded={isExpanded}
                    aria-controls={detailsId}
                  >
                    {isExpanded ? "Close walkthrough" : "View walkthrough"}
                    <ChevronDownIcon
                      className={cn(
                        "size-5 transition-transform",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </Button>
                </div>
              </div>

              {isExpanded && (
                <div id={detailsId} className="mt-12 border-t pt-10 lg:mt-16">
                  <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
                    <div>
                      <div className="relative aspect-video overflow-hidden rounded-xl border bg-surface">
                        {isPlaying ? (
                          <video
                            src={project.demo.videoSrc}
                            controls
                            autoPlay
                            preload="metadata"
                            className="size-full bg-black object-contain"
                          >
                            Your browser does not support embedded video.
                          </video>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlayingVideo(project.id)}
                            className="focus-ring group absolute inset-0 flex items-center justify-center"
                            aria-label={`Play ${project.demo.title} walkthrough`}
                          >
                            <Image
                              src={project.demo.videoPoster}
                              alt=""
                              fill
                              sizes="(max-width: 1024px) 100vw, 58vw"
                              className="object-cover object-left-top opacity-75 transition-opacity group-hover:opacity-60"
                            />
                            <span className="relative inline-flex h-12 items-center gap-2 rounded-md bg-background px-5 font-semibold text-foreground">
                              <PlayIcon className="size-5 text-primary" />
                              Play walkthrough
                            </span>
                          </button>
                        )}
                      </div>
                      <p className="body-copy mt-6 max-w-3xl">
                        {project.demo.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-1">
                      {project.demo.screenshots.slice(1).map((screenshot, index) => (
                        <button
                          key={screenshot.src}
                          type="button"
                          onClick={(event) =>
                            openScreenshot(event, project.id, index + 1)
                          }
                          className="focus-ring group relative aspect-[16/9] overflow-hidden rounded-lg border bg-surface"
                          aria-label={`Open screenshot: ${screenshot.alt}`}
                        >
                          <Image
                            src={screenshot.src}
                            alt={screenshot.alt}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 32vw"
                            className="object-cover object-left-top transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <div className="mt-28 border-t pt-10 lg:mt-36 lg:pt-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Other shipped work
          </h2>
          <div>
            <article className="border-b pb-10">
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <LockKeyholeIcon className="mt-0.5 size-4 shrink-0 text-primary" />
                Client proprietary application
              </div>
              <h3 className="mt-5 text-3xl font-semibold tracking-[-0.03em]">
                Healthcare Provider Mobile App
              </h3>
              <p className="body-copy mt-5">
                Built a native iPad application for patient visits, including
                offline-first records, wound photography and measurements,
                prescriptions, and scheduling with EMR synchronization.
              </p>
              <p className="mt-5 text-sm text-muted-foreground">
                Swift, SwiftUI, REST APIs, offline synchronization
              </p>
            </article>

            <article className="grid gap-8 py-10 sm:grid-cols-[1fr_12rem] sm:items-start">
              <div>
                <h3 className="text-3xl font-semibold tracking-[-0.03em]">
                  Pulse
                </h3>
                <p className="body-copy mt-5">
                  A product-storytelling experiment built with Astro, GSAP,
                  canvas frame sequences, and scroll-driven interaction.
                </p>
                <a
                  href="https://pulse.elmario.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring mt-6 inline-flex h-11 items-center gap-2 rounded-md font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Open live project
                  <ExternalLinkIcon className="size-4" />
                </a>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg border bg-surface">
                <Image
                  src="https://assets.elmario.dev/demo-images/pulse-hero.webp"
                  alt="Pulse smart ring product landing page"
                  fill
                  sizes="(max-width: 640px) 100vw, 12rem"
                  className="object-cover object-center"
                />
              </div>
            </article>
          </div>
        </div>
      </div>

      {selectedScreenshot && (
        <Lightbox
          images={selectedImages}
          selectedIndex={selectedScreenshot.index}
          onClose={closeLightbox}
          onNavigate={(index) =>
            setSelectedScreenshot((current) =>
              current ? { ...current, index } : null,
            )
          }
        />
      )}
    </section>
  );
}
