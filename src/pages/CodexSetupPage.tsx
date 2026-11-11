import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEMO_MEMBER_EMAIL, DEMO_MEMBER_PASSWORD } from "@/lib/localDb/seed";

const REPO_URL = "https://github.com/danielwait2/pma-case-competition";
const STUDENT_OFFER_URL = "https://chatgpt.com/codex/students/";
const USAGE_URL = "https://chatgpt.com/codex/settings/usage";
const MAC_DMG_URL = "https://persistent.oaistatic.com/codex-app-prod/Codex.dmg";
const WINDOWS_STORE_URL = "https://get.microsoft.com/installer/download/9PLM9XGG6VKS?cid=website_cta_psi";
const APP_DOCS_URL = "https://learn.chatgpt.com/docs/quickstart?setup=app";
const WINDOWS_DOCS_URL = "https://learn.chatgpt.com/docs/app/windows";

const ExtLink = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
    {children}
  </a>
);

const Cmd = ({ children }: { children: string }) => (
  <pre className="mt-2 overflow-x-auto rounded-lg bg-muted p-3 text-xs md:text-sm font-mono select-all">{children}</pre>
);

const Shot = ({ src, alt, caption }: { src: string; alt: string; caption: string }) => (
  <figure className="mt-4">
    <img src={src} alt={alt} loading="lazy" className="w-full rounded-xl border border-border" />
    <figcaption className="mt-2 text-xs text-muted-foreground">{caption}</figcaption>
  </figure>
);

const Step = ({ n, title, children }: { n: number; title: string; children: ReactNode }) => (
  <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
    <div className="flex items-center gap-3 mb-4">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </span>
      <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
    </div>
    <div className="space-y-3 text-sm md:text-base text-muted-foreground">{children}</div>
  </section>
);

const OsTabs = ({ mac, windows }: { mac: ReactNode; windows: ReactNode }) => (
  <Tabs defaultValue="mac" className="mt-2">
    <TabsList>
      <TabsTrigger value="mac">Mac</TabsTrigger>
      <TabsTrigger value="windows">Windows</TabsTrigger>
    </TabsList>
    <TabsContent value="mac" className="space-y-3">
      {mac}
    </TabsContent>
    <TabsContent value="windows" className="space-y-3">
      {windows}
    </TabsContent>
  </Tabs>
);

const CodexSetupPage = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background text-foreground">
      <div className="container mx-auto px-4 md:px-6">
        <AnimatedSection animation="slide-up">
          <div className="max-w-3xl mx-auto mb-10">
            <Link to="/case" className="inline-flex items-center gap-2 text-sm text-primary underline mb-6">
              <ArrowLeft className="h-4 w-4" />
              Back to the case
            </Link>
            <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Code team setup</p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Set up Codex on your laptop</h1>
            <p className="text-lg text-muted-foreground">
              Claim the free student credits, install the Codex app, and get this site running on your own machine.
              Plan on about 15 minutes. Do steps 1 to 3 before the event if you can.
            </p>
          </div>
        </AnimatedSection>

        <div className="max-w-3xl mx-auto space-y-6">
          <Step n={1} title="Claim $100 in free Codex credits">
            <p>
              OpenAI gives verified university students in the US and Canada $100 in Codex credits (2,500 credits). It
              works on any ChatGPT plan, including Free, and the credits last 12 months.
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Sign in to ChatGPT, or make a free account. A personal account is fine.
              </li>
              <li>
                Open <ExtLink href={STUDENT_OFFER_URL}>Codex for university students</ExtLink> and click{" "}
                <span className="font-semibold text-foreground">Claim now</span>.
              </li>
              <li>Verify with SheerID using your BYU email.</li>
              <li>
                Check that the credits landed on your <ExtLink href={USAGE_URL}>Codex usage page</ExtLink>.
              </li>
            </ol>
            <Shot
              src="/codex-setup/student-offer.jpg"
              alt="The Codex for university students page with the Claim now button"
              caption="The student offer page. Click Claim now, then verify with your school email."
            />
            <p className="text-sm">
              If verification gets stuck, you can still use the Codex usage that comes with your ChatGPT plan, or join
              a chat team for tonight.
            </p>
          </Step>

          <Step n={2} title="Install Git and Node.js">
            <p>The site needs Git to download the code and Node.js to run it.</p>
            <OsTabs
              mac={
                <>
                  <p>
                    Open <span className="font-semibold text-foreground">Terminal</span> (press Cmd + Space, type
                    Terminal) and install Git:
                  </p>
                  <Cmd>xcode-select --install</Cmd>
                  <p>
                    Then download and run the LTS installer from <ExtLink href="https://nodejs.org">nodejs.org</ExtLink>.
                  </p>
                </>
              }
              windows={
                <>
                  <p>
                    Open <span className="font-semibold text-foreground">PowerShell</span> from the Start menu and run:
                  </p>
                  <Cmd>{"winget install --id Git.Git -e\nwinget install --id OpenJS.NodeJS.LTS -e"}</Cmd>
                  <p>Close PowerShell and open it again so it picks up the new tools.</p>
                </>
              }
            />
            <p>Check that both work. Each command should print a version number:</p>
            <Cmd>{"git --version\nnode --version"}</Cmd>
          </Step>

          <Step n={3} title="Install the Codex app">
            <p>
              Codex now ships inside the ChatGPT desktop app. If you already have the Codex app, update it to ChatGPT.
            </p>
            <OsTabs
              mac={
                <>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Download <ExtLink href={MAC_DMG_URL}>the Mac installer (.dmg)</ExtLink>. It is built for Apple
                      Silicon Macs (M1 or newer).
                    </li>
                    <li>Open the .dmg and drag the app into Applications.</li>
                    <li>Open it from Applications and sign in with the ChatGPT account that has your credits.</li>
                  </ol>
                  <p className="text-sm">
                    On an older Intel Mac, use the command line version instead: run{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">npm install -g @openai/codex</code>, then run{" "}
                    <code className="text-xs bg-muted px-1 py-0.5 rounded">codex</code> inside your project folder.
                  </p>
                </>
              }
              windows={
                <>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>
                      Install it from the <ExtLink href={WINDOWS_STORE_URL}>Microsoft Store</ExtLink>, or run this in
                      PowerShell:
                      <Cmd>winget install --id 9PLM9XGG6VKS -s msstore</Cmd>
                    </li>
                    <li>Open the app and sign in with the ChatGPT account that has your credits.</li>
                  </ol>
                  <p className="text-sm">
                    Codex runs commands in PowerShell on Windows by default. You do not need WSL for this case. See{" "}
                    <ExtLink href={WINDOWS_DOCS_URL}>OpenAI's Windows notes</ExtLink> if something looks different.
                  </p>
                </>
              }
            />
            <Shot
              src="/codex-setup/codex-app.jpg"
              alt="The ChatGPT desktop app with Codex selected, showing a task and changed files"
              caption="The Codex app. Your tasks are on the left; Codex shows its plan and the files it changed on the right."
            />
            <p className="text-sm">
              Full instructions: <ExtLink href={APP_DOCS_URL}>OpenAI's desktop app quickstart</ExtLink>.
            </p>
          </Step>

          <Step n={4} title="Fork and clone the repo">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Sign in to GitHub (make a free account if you need one) and open{" "}
                <ExtLink href={REPO_URL}>the case repo</ExtLink>.
              </li>
              <li>
                Click <span className="font-semibold text-foreground">Fork</span> in the top right, then{" "}
                <span className="font-semibold text-foreground">Create fork</span>. This gives you your own copy.
              </li>
              <li>
                On your fork, click the green <span className="font-semibold text-foreground">Code</span> button and
                copy the HTTPS URL.
              </li>
            </ol>
            <Shot
              src="/codex-setup/github-fork.jpg"
              alt="The pma-case-competition repo on GitHub with the Fork button in the top right"
              caption="Fork is in the top right of the repo page."
            />
            <Shot
              src="/codex-setup/github-clone.jpg"
              alt="The Code dropdown on GitHub showing the HTTPS clone URL"
              caption="On your fork, the Code button shows the URL to clone. It will have your username in it."
            />
            <p>Clone it into your Documents folder, swapping in your GitHub username:</p>
            <OsTabs
              mac={<Cmd>{"cd ~/Documents\ngit clone https://github.com/YOUR-USERNAME/pma-case-competition.git"}</Cmd>}
              windows={
                <Cmd>{"cd $HOME\\Documents\ngit clone https://github.com/YOUR-USERNAME/pma-case-competition.git"}</Cmd>
              }
            />
          </Step>

          <Step n={5} title="Open the project in Codex and launch the site">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                In the app, pick <span className="font-semibold text-foreground">Codex</span> from the ChatGPT dropdown.
              </li>
              <li>
                Click <span className="font-semibold text-foreground">Add new project</span> (Cmd + O on Mac, Ctrl + O on
                Windows) and choose the <code className="text-xs bg-muted px-1 py-0.5 rounded">pma-case-competition</code>{" "}
                folder.
              </li>
              <li>
                Leave <span className="font-semibold text-foreground">Ask for approval</span> on below the message box,
                so Codex checks with you before running commands.
              </li>
              <li>
                Send this as your first message:
                <Cmd>Run npm install, then npm run dev, and tell me the local URL.</Cmd>
              </li>
              <li>
                Open <span className="font-semibold text-foreground">http://localhost:8080</span> in your browser. Sign
                in as <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_EMAIL}</code> /{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{DEMO_MEMBER_PASSWORD}</code> to see Resources.
              </li>
            </ol>
            <Shot
              src="/codex-setup/local-site.jpg"
              alt="The PMA demo site running at localhost:8080"
              caption="When it works, you'll see the PMA site running at localhost:8080."
            />
            <p>
              Codex can't find npm? Close the app, reopen it, and try again. It needs to start after Node.js is
              installed.
            </p>
          </Step>

          <Step n={6} title="Work the case and ship a pull request">
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Go back to the <Link to="/case" className="text-primary underline">case page</Link>, copy the starter
                prompt, and paste it into Codex. The case kit is already in{" "}
                <code className="text-xs bg-muted px-1 py-0.5 rounded">case-kit/</code>.
              </li>
              <li>Pick one problem, write your spec, and have Codex build the fix. Check it on localhost:8080.</li>
              <li>
                Ask Codex to commit your changes on a new branch and push to your fork. Then, on your fork on GitHub,
                click <span className="font-semibold text-foreground">Contribute</span>, then{" "}
                <span className="font-semibold text-foreground">Open pull request</span>, and paste your spec into the
                description.
              </li>
              <li>Submit the pull request link on the case page.</li>
            </ol>
          </Step>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Screenshots taken November 2026. OpenAI and GitHub change their pages often, so yours may look a little
            different.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CodexSetupPage;
