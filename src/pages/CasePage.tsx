import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, Download, ExternalLink, Github, MessageSquare, Terminal } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { DEMO_MEMBER_EMAIL, DEMO_MEMBER_PASSWORD } from "@/lib/localDb/seed";

const REPO_URL = "https://github.com/danielwait2/pma-case-competition";
const DICTIONARY_URL = `${REPO_URL}/blob/main/case-kit/data-dictionary.md`;
const SUBMIT_URL = "https://pma-website-bay.vercel.app/submit";

const WEEKS = [
  { label: "Oct 11", value: 41 },
  { label: "Oct 18", value: 33 },
  { label: "Oct 25", value: 30 },
  { label: "Nov 1", value: 23 },
];

const HINTS = [
  "Not every scary chart is the cause.",
  "Not every loud request is the right thing to build.",
  "Ask your AI how it got every number. Check one by hand.",
];

const FRAMEWORKS = [
  {
    title: "Size it",
    body: "How many members does this cause touch, and how much of the drop from 41 to 23 does it explain? A cause behind three lost members is a footnote.",
  },
  {
    title: "Prioritize it",
    body: "List two or three candidate fixes and score each on impact, confidence, and effort. Effort counts: you have about 20 minutes to build.",
  },
  {
    title: "Scope it",
    body: "Say who it is for and what you are not building. The smallest version that tests your idea wins.",
  },
  {
    title: "Measure it",
    body: "Name one metric your fix should move and one guardrail it must not break.",
  },
];

const DELIVERABLES = ["Problem", "Evidence and size", "Spec", "Something shipped"];

const STARTER_PROMPT =
  "I'm a product manager investigating why weekly active members on our club's Resources page fell from 41 to 23 in a month. The attached files are our site analytics, user feedback, and five user interviews. Act as my coach, not my analyst. Don't tell me the cause. Ask me one question at a time that pushes my thinking: what to look at first, which users to compare, what changed and when, how big each possible cause is, and which one is worth fixing first. When I ask you to compute something, show exactly how you got the number so I can check it. Start by asking what I want to check first. If you are a coding agent working in the pma-case-competition repo, use its skills: case-coach now, write-spec once I have a problem and evidence, and ship-pr when the fix is built.";

const SKILLS = [
  { name: "/case-coach", body: "Asks you questions about the kit until you find the cause, without giving you the answer." },
  { name: "/write-spec", body: "Turns your findings into the four part spec and saves it as SPEC.md." },
  { name: "/ship-pr", body: "Checks the build and opens a pull request with your spec as the description." },
];

const WAYS = [
  {
    icon: MessageSquare,
    title: "In a chat",
    tools: "ChatGPT, Claude, or Gemini",
    body: "Upload the kit and ask questions until you find the cause. Then mock your fix as a Claude artifact, or in Lovable or v0.",
    ship: "A share link to your mock or prototype, with your spec.",
  },
  {
    icon: Terminal,
    title: "In the code",
    tools: "Claude Code, Codex, Cursor",
    body: "Fork and clone the repo. The case kit is already inside it. Run npm install right away, then npm run dev, and change the real site. CLAUDE.md gives your agent the context it needs.",
    ship: "A pull request with your spec in the description.",
  },
];

const KIT = [
  {
    file: "brief.md",
    what: "The case: your role, the goal, the north star, and what you present.",
  },
  {
    file: "events.csv",
    what: "About 6,400 rows. One row per thing someone did on the site: page views, searches, clicks, video opens, signups, logins.",
    columns: ["user_id", "anon_id", "session_id", "timestamp", "path", "event", "detail", "device"],
  },
  {
    file: "users.csv",
    what: "About 340 rows. One row per account: when it signed up, confirmed its email, became a member, and was last seen.",
    columns: ["user_id", "signup_at", "class_year", "major", "confirmed_at", "member_approved_at", "last_seen_at", "sessions_30d"],
  },
  {
    file: "feedback.csv",
    what: "About 120 rows. Ratings and comments from the Resources page, plus emails sent to the club inbox.",
    columns: ["user_id", "submitted_at", "page", "rating", "comment"],
  },
  {
    file: "interviews/",
    what: "Five short transcripts of interviews with BYU students, run the week of Nov 2.",
  },
  {
    file: "data-dictionary.md",
    what: "What every column and event type means. Hand it to your AI along with the data.",
  },
];

const KIT_NOTES = [
  "Everything covers Oct 11 to Nov 9, 2026, in Utah local time.",
  "Weeks run Sunday to Saturday. Nov 8 to 9 is a partial week, so leave it out when comparing weeks.",
  "user_id links all three CSVs. Visitors who are not logged in only have an anon_id.",
];

const CasePage = () => {
  const [copied, setCopied] = useState(false);

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(STARTER_PROMPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto mb-12">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">
              Wed Nov 11 · Case Interview: Build the Fix with AI
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
              Engagement is <span className="text-gradient">slipping</span>
            </h1>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                You are the product manager for the BYU Product Management Association website. The most valuable
                thing on it is{" "}
                <Link to="/resources" className="text-primary underline">
                  Resources
                </Link>
                , the members only library of interview prep, APM deadlines, and job boards. It only helps if students
                come back to it every week during recruiting season.
              </p>
              <p>
                Your north star is weekly active members on Resources: distinct logged in members who open the library
                in a Sunday to Saturday week. Over the last month it fell from 41 to 23, and recruiting peaks in about
                three weeks. Leadership wants to know why, and what you will ship to fix it.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-4">
              {WEEKS.map((w) => (
                <div key={w.label} className="rounded-xl border border-border bg-card p-3 text-center">
                  <p className="text-2xl md:text-3xl font-bold">{w.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">Week of {w.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center font-semibold">
              Find the cause, write a short spec, and build and ship it in one hour.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={100}>
          <div className="max-w-3xl mx-auto rounded-2xl border-2 border-primary bg-card p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold mb-5">Start here</h2>
            <ol className="space-y-5 list-decimal list-inside">
              <li>
                <span className="font-medium">Get the case kit.</span>{" "}
                <span className="text-muted-foreground">
                  It has the brief, a month of site analytics, user feedback, and five user interviews (<a href="#kit" className="text-primary underline">see what is inside</a>). Chat teams
                  download the zip. Code teams fork the repo, where the kit is already in{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">case-kit/</code>. See{" "}
                  <a href="#two-ways" className="text-primary underline">
                    two ways to work
                  </a>{" "}
                  below.
                </span>
              </li>
              <li>
                <span className="font-medium">Use the product.</span>{" "}
                <span className="text-muted-foreground">
                  Sign in as <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_EMAIL}</code> /{" "}
                  <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_PASSWORD}</code> and click
                  around{" "}
                  <Link to="/resources" className="text-primary underline">
                    Resources
                  </Link>{" "}
                  like a student would.
                </span>
              </li>
              <li>
                <span className="font-medium">Ask questions.</span>{" "}
                <span className="text-muted-foreground">
                  Upload the kit to your AI (ChatGPT takes the zip; for Claude, unzip first) and paste in our starter
                  prompt. It turns your AI into a coach that asks you questions instead of handing you the answer.
                </span>
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={copyPrompt}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied" : "Copy starter prompt"}
                  </button>
                </div>
              </li>
              <li>
                <span className="font-medium">Pick one problem and write your spec.</span>{" "}
                <span className="text-muted-foreground">
                  Partway through, we will share one more piece of evidence. Use it to sharpen your why.
                </span>
              </li>
              <li>
                <span className="font-medium">Build, ship, and submit one link per team.</span>
                <div className="mt-3">
                  <a
                    href={SUBMIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Submit your team's link
                  </a>
                </div>
              </li>
            </ol>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm font-semibold mb-2">Hints</p>
              <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                {HINTS.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={125}>
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-2">Think like a PM</h2>
            <p className="text-muted-foreground mb-4">The same moves an interviewer listens for in a product case.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              {FRAMEWORKS.map((f) => (
                <div key={f.title} className="rounded-xl bg-muted/50 p-4">
                  <p className="font-semibold mb-1">{f.title}</p>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={150}>
          <div className="max-w-3xl mx-auto mb-10">
            <h2 className="text-2xl font-bold mb-4">What you show at the end</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {DELIVERABLES.map((d, i) => (
                <div key={d} className="rounded-xl border border-border bg-card p-4">
                  <p className="font-semibold">
                    {i + 1}. {d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={200}>
          <div id="two-ways" className="max-w-3xl mx-auto scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2">Two ways to work</h2>
            <p className="text-muted-foreground mb-6">
              Use whatever your team is comfortable with, or mix them. Plenty of teams dig in a chat and build in code.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {WAYS.map((w) => (
                <div key={w.title} className="rounded-2xl border border-border bg-card p-6 flex flex-col">
                  <div className="flex items-center gap-2">
                    <w.icon className="h-5 w-5 text-muted-foreground" />
                    <h3 className="text-xl font-bold">{w.title}</h3>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1 mb-4">
                    {w.tools}
                  </p>
                  <p className="text-sm text-muted-foreground">{w.body}</p>
                  <p className="mt-4 text-sm">
                    <span className="font-semibold">You ship: </span>
                    <span className="text-muted-foreground">{w.ship}</span>
                  </p>
                  {w.title === "In the code" && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold mb-2">Skills in the repo (Claude Code)</p>
                      <ul className="space-y-2 text-sm">
                        {SKILLS.map((k) => (
                          <li key={k.name}>
                            <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{k.name}</code>{" "}
                            <span className="text-muted-foreground">{k.body}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {w.title === "In the code" && (
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
                  {w.title === "In a chat" && (
                    <a
                      href="/case-kit.zip"
                      download
                      className="mt-6 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border font-medium hover:bg-muted transition-colors"
                    >
                      <Download className="h-4 w-4" />
                      Download case-kit.zip
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="slide-up" delay={250}>
          <div id="kit" className="max-w-3xl mx-auto mt-10 scroll-mt-24">
            <h2 className="text-2xl font-bold mb-2">What is in the case kit</h2>
            <p className="text-muted-foreground mb-6">A quick tour so you know what to ask for.</p>
            <div className="rounded-2xl border border-border bg-card divide-y divide-border">
              {KIT.map((k) => (
                <div key={k.file} className="p-5">
                  <p className="font-mono font-semibold text-sm">{k.file}</p>
                  <p className="text-sm text-muted-foreground mt-1">{k.what}</p>
                  {k.columns && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {k.columns.map((c) => (
                        <code key={c} className="text-xs bg-muted px-1.5 py-0.5 rounded">
                          {c}
                        </code>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <ul className="mt-5 space-y-1 text-sm text-muted-foreground list-disc list-inside">
              {KIT_NOTES.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
            <a
              href={DICTIONARY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-primary underline"
            >
              Read the full data dictionary
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default CasePage;
