import { Link } from "react-router-dom";
import { Clock, LogIn, Mail, Sparkles } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const PAY_DUES_URL = "https://clubs.byu.edu/link/club/18295873486206095";

const FREE_ITEMS = [
  "One full mock PM interview",
  "5 APM programs to apply to",
  "Behavioral and estimation interview starter",
  "Cursor, free for students",
];

/**
 * Shown on /resources to anyone who isn't a verified PMA member. Logged-out
 * visitors get a log in / join prompt; logged-in accounts are treated as
 * waiting on officer approval.
 */
const PreviewBanner = ({ isLoggedIn }: { isLoggedIn: boolean }) => (
  <AnimatedSection animation="fade-in">
    <Card id="resources-unlock" className="max-w-3xl mx-auto mb-10 border-primary/20 scroll-mt-24">
      <CardContent className="p-5 md:p-7">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
            {isLoggedIn ? <Clock className="w-5 h-5 text-primary" /> : <Sparkles className="w-5 h-5 text-primary" />}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold mb-1">
              {isLoggedIn ? "Your membership is pending approval" : "You're viewing the free preview"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isLoggedIn
                ? "Paid your dues? Officers approve new members within a week. Until then, everything marked Free is yours to use."
                : "Log in with your PMA member account to open the full library. Not a member yet? Pay dues to join."}
            </p>
          </div>
        </div>

        <ul className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FREE_ITEMS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-foreground/90">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          {!isLoggedIn && (
            <Button asChild className="sm:flex-1">
              <Link to="/auth">
                <LogIn className="w-4 h-4 mr-2" />
                Log in
              </Link>
            </Button>
          )}
          <Button
            variant={isLoggedIn ? "default" : "outline"}
            className="sm:flex-1"
            onClick={() => window.open(PAY_DUES_URL, "_blank", "noopener,noreferrer")}
          >
            {isLoggedIn ? "Haven't paid yet? Pay dues" : "Join PMA (Pay Dues)"}
          </Button>
        </div>

        {isLoggedIn && (
          <div className="mt-5 pt-5 border-t border-border flex items-start gap-3">
            <Mail className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Paid more than a week ago?</span> Email{" "}
              <a href="mailto:pma@example.com" className="font-semibold text-primary underline">
                pma@example.com
              </a>{" "}
              and an officer will check your status.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  </AnimatedSection>
);

export default PreviewBanner;
