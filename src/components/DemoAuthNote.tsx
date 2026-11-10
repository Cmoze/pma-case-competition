import { DEMO_MEMBER_EMAIL, DEMO_MEMBER_PASSWORD } from "@/lib/localDb/seed";

const DemoAuthNote = () => (
  <div className="rounded-md border border-border bg-muted px-3 py-2 text-xs text-muted-foreground">
    <span className="font-semibold text-foreground">Demo site:</span> sign in as{" "}
    <code className="font-mono text-foreground">{DEMO_MEMBER_EMAIL}</code> /{" "}
    <code className="font-mono text-foreground">{DEMO_MEMBER_PASSWORD}</code> to see member view, or sign up to see
    what a new student sees.
  </div>
);

export default DemoAuthNote;
