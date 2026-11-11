import { Link } from "react-router-dom";
import { Download, ExternalLink, FileText, Github, KeyRound } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { DEMO_MEMBER_EMAIL, DEMO_MEMBER_PASSWORD } from "@/lib/localDb/seed";

const REPO_URL = "https://github.com/danielwait2/pma-case-competition";
const KIT_URL = `${REPO_URL}/tree/main/case-kit`;
const fileUrl = (path: string) => `${REPO_URL}/blob/main/case-kit/${path}`;

const KIT_FILES = [
  { path: "brief.md", label: "Brief", note: "The full case, the north star, and what to present" },
  { path: "data-dictionary.md", label: "Data dictionary", note: "What every column means" },
  { path: "events.csv", label: "events.csv", note: "Site analytics for Oct 11 to Nov 9" },
  { path: "users.csv", label: "users.csv", note: "Every account and when it became a member" },
  { path: "feedback.csv", label: "feedback.csv", note: "Ratings, comments, and inbox messages" },
  { path: "interviews", label: "interviews/", note: "Five short user interview transcripts" },
];

const DELIVERABLES = [
  { title: "Problem", body: "One or two sentences naming the most important reason the number is falling. Pick one." },
  { title: "Evidence", body: "At least one number you computed and at least one quote from an interview or the feedback." },
  { title: "Spec", body: "Who it is for, what it does, what you are not building, and the metric that proves it worked." },
  { title: "Something shipped", body: "A working change, a clickable prototype, or a pull request. Rough is fine." },
];

const START_PROMPT =
  "Using these files, count distinct user_id with event = page_view and path = /resources per Sunday to Saturday week starting Oct 11, using local dates and ignoring Nov 8 to 9. You should get 41, 33, 30, 23. Then list three possible reasons it fell, each with one number and one quote.";

const CLOCK = [
  { time: "0:00", what: "Framing. Track 3 teams fork and run npm install now." },
  { time: "0:07", what: "Discover with AI. Around 0:17 we share more evidence." },
  { time: "0:22", what: "Pick one problem and write a five line spec." },
  { time: "0:25", what: "Build and ship." },
  { time: "0:46", what: "Submit your link." },
  { time: "0:48", what: "Share. A few teams show what they built." },
];

const TRACKS = [
  {
    level: "Beginner",
    title: "Chat AI",
    ship: "A shared ChatGPT or Claude chat, or a Google Doc set to anyone with the link, with your spec plus a mock or the message you'd send users.",
    steps: [
      "Click around this site like a student would. Try the demo login to see the members view.",
      "Download the case kit.",
      "Upload the CSVs and interviews to ChatGPT or Claude and ask it to find patterns and compute numbers.",
      "Mock your fix as a Claude artifact and share the link.",
    ],
  },
  {
    level: "Builder",
    title: "Prototype",
    ship: "A Lovable, v0, or artifact link. Tip: paste a screenshot of the part of /resources you're changing, plus your spec.",
    steps: [
      "Do the analysis from the Beginner track.",
      "Describe your fix to Lovable, v0, or a Claude artifact.",
      "Iterate until the prototype is clickable, then share the link.",
    ],
  },
  {
    level: "Advanced",
    title: "Pull request",
    ship: "A GitHub pull request link with your spec and a screenshot in the description.",
    steps: [
      "Fork the repo on GitHub and clone your fork.",
      "Run npm install, then npm run dev, and open the local site.",
      "Ship the fix with Claude Code, Cursor, or any editor.",
      "Open a pull request against this repo with your spec in the description.",
    ],
  },
];

const CasePage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
              Wed Nov 11 · Case Interview: Build the Fix with AI
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Engagement is <span className="text-gradient">slipping</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              You are the PM for this website. Use data, user interviews, and AI to find out why, write a short spec,
              and ship a fix in one hour.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-6 mb-10">
          <div className="md:col-span-3 rounded-2xl border-2 border-primary bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Start here</h2>
            <ol className="space-y-3 text-sm md:text-base list-decimal list-inside">
              <li>
                <a href="/case-kit.zip" download className="text-primary underline">
                  Download the case kit
                </a>
                .
              </li>
              <li>
                One teammate signs in as{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_EMAIL}</code> /{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_PASSWORD}</code> and clicks around{" "}
                <Link to="/resources" className="text-primary underline">
                  Resources
                </Link>
                .
              </li>
              <li>
                Upload the files to your AI (ChatGPT takes the zip; for Claude, unzip first) and paste this prompt:
                <p className="mt-2 rounded-lg bg-muted p-3 text-xs md:text-sm text-muted-foreground select-all">
                  {START_PROMPT}
                </p>
              </li>
              <li>Around 0:17 we share more evidence. Use it to explain why, not to switch problems.</li>
              <li>
                By 0:46, one person submits any shareable link at{" "}
                <a
                  href="https://pma-website-bay.vercel.app/submit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  the submission form
                </a>
                .
              </li>
            </ol>
          </div>
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-4">Today's clock</h2>
            <ul className="space-y-3 text-sm">
              {CLOCK.map((c) => (
                <li key={c.time} className="flex gap-3">
                  <span className="font-mono font-semibold w-10 shrink-0">{c.time}</span>
                  <span className="text-muted-foreground">{c.what}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <AnimatedSection animation="slide-up" delay={100}>
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold mb-3">The brief, short version</h2>
            <p className="text-muted-foreground mb-4">
              PMA wants students to come back to <Link to="/resources" className="text-primary underline">Resources</Link>{" "}
              every week during recruiting season. The north star is weekly active members on /resources: distinct
              logged in members who saw the unlocked library in a Sunday to Saturday week. It fell from 41 to 23 over
              the last 30 days, and recruiting peaks in about three weeks.
            </p>
            <p className="text-muted-foreground mb-6">
              Not every scary chart is the cause, and not every loud request is the right thing to build.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {DELIVERABLES.map((d, i) => (
                <div key={d.title} className="rounded-xl bg-muted/50 p-4">
                  <p className="font-semibold mb-1">
                    {i + 1}. {d.title}
                  </p>
                  <p className="text-sm text-muted-foreground">{d.body}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={150}>
          <div className="max-w-3xl mx-auto rounded-2xl border border-border bg-card p-6 md:p-8 mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-1">The case kit</h2>
                <p className="text-muted-foreground text-sm">
                  Small enough to upload to the free version of ChatGPT, Claude, or Gemini.
                </p>
              </div>
              <a
                href="/case-kit.zip"
                download
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary rounded-xl text-white font-bold hover:scale-105 transition-all duration-300 shadow-lg shrink-0"
              >
                <Download className="h-5 w-5" />
                Download case-kit.zip
              </a>
            </div>
            <ul className="divide-y divide-border">
              {KIT_FILES.map((f) => (
                <li key={f.path}>
                  <a
                    href={f.path === "interviews" ? `${KIT_URL}/interviews` : fileUrl(f.path)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 py-3 hover:text-primary transition-colors"
                  >
                    <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{f.label}</span>
                    <span className="text-sm text-muted-foreground hidden sm:inline">{f.note}</span>
                    <ExternalLink className="h-4 w-4 ml-auto shrink-0 text-muted-foreground" />
                  </a>
                </li>
              ))}
            </ul>
            <a
              href={KIT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-primary underline"
            >
              <Github className="h-4 w-4" />
              Browse the kit on GitHub
            </a>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={200}>
          <div className="max-w-5xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-2 text-center">Pick a track</h2>
            <p className="text-muted-foreground text-center mb-8">Mix and match. Pick what fits your team.</p>
            <div className="grid md:grid-cols-3 gap-6">
              {TRACKS.map((t) => (
                <div key={t.level} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.level}</p>
                  <h3 className="text-xl font-bold mt-1 mb-4">{t.title}</h3>
                  <ol className="space-y-3 text-sm text-muted-foreground list-decimal list-inside">
                    {t.steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold text-foreground">You ship: </span>
                    <span className="text-muted-foreground">{t.ship}</span>
                  </p>
                  {t.level === "Advanced" && (
                    <a
                      href={REPO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                    >
                      <Github className="h-4 w-4" />
                      Open the repo
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={250}>
          <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <KeyRound className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-bold">Demo login</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Sign in as a member to see the unlocked Resources page.
              </p>
              <p className="text-sm">
                Email: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{DEMO_MEMBER_EMAIL}</code>
              </p>
              <p className="text-sm mt-1">
                Password: <code className="font-mono bg-muted px-1.5 py-0.5 rounded">{DEMO_MEMBER_PASSWORD}</code>
              </p>
              <Link to="/auth" className="inline-block mt-4 text-sm text-primary underline">
                Go to login
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-gradient-to-r from-primary to-secondary p-6 text-white">
              <h2 className="text-lg font-bold mb-3">Submit</h2>
              <p className="text-sm text-white/80 mb-3">
                Share your prototype link, artifact link, or pull request along with your team name.
              </p>
              <a
                href="https://pma-website-bay.vercel.app/submit"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-white px-4 py-2 text-sm font-semibold text-primary hover:bg-white/90"
              >
                Submit your team's work
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CasePage;
