/**
 * Per-route SEO meta: title and description.
 * Used for document.title and meta name="description", og:title, og:description, og:url.
 */
export const ROUTE_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "PMA Case Interview (Demo Site)",
    description:
      "Empowering the next generation of product leaders through hands-on experience, industry connections, and community at Brigham Young University.",
  },
  "/case": {
    title: "Case Interview | PMA Demo Site",
    description: "Attendee guide for Case Interview: Build the Fix with AI: the brief, the case kit, and three ways to ship a fix.",
  },
  "/case/codex": {
    title: "Codex Setup | PMA Demo Site",
    description: "Claim free Codex student credits and set up Codex on Mac or Windows for the case.",
  },
  "/team": {
    title: "Team | PMA Demo Site",
    description: "Meet the BYU Product Management Association leadership and team.",
  },
  "/hackathon": {
    title: "AI Product Hackathon | PMA Demo Site",
    description:
      "BYU × Utah PMA AI Product Hackathon. Build, learn, and compete with product and tech.",
  },
  "/hackathon/share": {
    title: "Share the Hackathon | PMA Demo Site",
    description: "Share the BYU × Utah PMA AI Product Hackathon with your network.",
  },
  "/hackathon/faq": {
    title: "Hackathon FAQ | PMA Demo Site",
    description: "Frequently asked questions about the BYU × Utah PMA AI Product Hackathon.",
  },
  "/events/ask": {
    title: "Ask a Question | PMA Demo Site",
    description: "Submit a question for the live BYU PMA Q&A.",
  },
  "/events": {
    title: "Events | PMA Demo Site",
    description: "Upcoming events, workshops, and meetings from the BYU Product Management Association.",
  },
  "/resources": {
    title: "Resources | PMA Demo Site",
    description: "Product management resources, guides, and tools from BYU PMA.",
  },
  "/contact": {
    title: "Contact | PMA Demo Site",
    description: "Get in touch with the BYU Product Management Association.",
  },
  "/students": {
    title: "For Students | PMA Demo Site",
    description: "What product management is, which majors and classes lead there, and answers to common student questions.",
  },
  "/companies": {
    title: "For Companies | PMA Demo Site",
    description: "Partner with BYU PMA: sponsor an AI Foundry project, offer PM internships, join the career fair, host a speaker, or host PMA on-site.",
  },
  "/game": {
    title: "Game | PMA Demo Site",
    description: "BYU PMA game and engagement.",
  },
  "/auth": {
    title: "Sign In | PMA Demo Site",
    description: "Sign in or create an account with BYU PMA.",
  },
  "/blocked": {
    title: "Access Restricted | PMA Demo Site",
    description: "This account’s access has been restricted by an administrator.",
  },
  "/roadmap": {
    title: "Career Roadmap | PMA Demo Site",
    description: "Your personalized product management career roadmap.",
  },
};

/** Meta for 404 (unknown paths). Used for document.title and og/twitter when route is not found. */
export const NOT_FOUND_META = {
  title: "Page Not Found | PMA Demo Site",
  description:
    "The page you're looking for doesn't exist or may have been moved. Return to BYU Product Management Association.",
};

/** Get meta for path; exact match for known routes, NOT_FOUND_META for unknown (404). */
export function getMetaForPath(pathname: string): { title: string; description: string } {
  return ROUTE_META[pathname] ?? NOT_FOUND_META;
}

/** Canonical base URL for OG and sitemap (no trailing slash). */
export function getCanonicalBase(): string {
  if (import.meta.env.VITE_SITE_URL) {
    return String(import.meta.env.VITE_SITE_URL).replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }
  return "http://localhost:8080";
}
