import type { Metadata } from "next";
import { Commissioner } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const commissioner = Commissioner({
  variable: "--font-commissioner",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  applicationName: "Mario Montano Portfolio",
  title:
    "Mario Montano | Full-Stack Engineer | Automation and Product Systems",
  description:
    "Full-stack engineer building product systems and operational automation across global travel and healthcare.",
  keywords: [
    "Mario Montano",
    "Full-Stack Engineer",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Operational Automation",
    "GraphQL",
    "Hasura",
    "PostgreSQL",
    "Healthcare Software",
  ],
  authors: [{ name: "Mario Montano", url: "https://elmario.dev" }],
  creator: "Mario Montano",
  metadataBase: new URL("https://elmario.dev"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "96x96" },
    ],
    apple: { url: "/apple-icon.png", type: "image/png" },
    other: [
      {
        rel: "icon",
        url: "/favicon.ico",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://elmario.dev",
    siteName: "Mario Montano Portfolio",
    title: "Mario Montano | Full-Stack Engineer",
    description:
      "Full-stack engineer building product systems and operational automation across global travel and healthcare.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mario Montano | Full-Stack Engineer",
    description:
      "Full-stack engineer building product systems and operational automation across global travel and healthcare.",
    creator: "@elmariodev",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Mario Montano",
    jobTitle: "Full-Stack Developer, Automations",
    description:
      "Full-stack engineer building product systems and operational automation across global travel and healthcare.",
    url: "https://elmario.dev",
    sameAs: [
      "https://github.com/elmariodev",
      "https://linkedin.com/in/elmariodev",
    ],
    knowsAbout: [
      "Full-Stack Development",
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "GraphQL",
      "Hasura",
      "Hono",
      "Trigger.dev",
      "ClickUp API",
      "Google Cloud",
      "Docker",
      "GitLab CI/CD",
      "Web Application Development",
      "Healthcare Software Development",
      "EMR/EHR Systems",
      "HIPAA Compliance",
      "Swift",
      "iOS Development",
      "API Development",
      "Operational Automation",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Ventura Travel",
    },
    hasOccupation: {
      "@type": "Occupation",
      name: "Full-Stack Developer, Automations",
      skills:
        "Full-Stack Development, TypeScript, Node.js, GraphQL, PostgreSQL, Cloud Infrastructure, Docker, CI/CD, Operational Automation",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mario Montano Portfolio",
    description:
      "Experience and selected systems by Mario Montano, a full-stack engineer working across operational automation and healthcare products.",
    url: "https://elmario.dev",
    author: {
      "@type": "Person",
      name: "Mario Montano",
    },
    inLanguage: "en-US",
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://assets.elmario.dev" />
        <link rel="dns-prefetch" href="https://assets.elmario.dev" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${commissioner.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {process.env.VERCEL === "1" ? <Analytics /> : null}
      </body>
    </html>
  );
}
