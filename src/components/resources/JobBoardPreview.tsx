import { Briefcase, ExternalLink, Lock } from "lucide-react";
import AnimatedSection from "@/components/AnimatedSection";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { JOB_PREVIEW } from "@/lib/resources";

const JobBoardPreview = ({ onLocked }: { onLocked: () => void }) => (
  <AnimatedSection animation="fade-in">
    <section aria-labelledby="job-preview-title" className="max-w-6xl mx-auto mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-4 h-4 text-primary" />
        <h2 id="job-preview-title" className="text-lg font-bold">
          APM Programs to Watch
        </h2>
        <Badge variant="secondary" className="text-xs">
          Free
        </Badge>
      </div>
      <Card className="border-border overflow-hidden">
        <CardContent className="p-0">
          <ul className="divide-y divide-border">
            {JOB_PREVIEW.map((job) => (
              <li key={`${job.company}-${job.program}`}>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 px-5 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {job.company}
                    </p>
                    <p className="text-sm text-muted-foreground">{job.program}</p>
                  </div>
                  <span className="flex items-center gap-1 shrink-0 text-sm text-primary">
                    Careers page
                    <ExternalLink className="w-4 h-4" />
                  </span>
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={onLocked}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left bg-muted/30 hover:bg-muted/60 transition-colors"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-card-foreground">See every program on APM List</p>
                  <p className="text-sm text-muted-foreground">
                    Open and closed status, deadlines, and interview guides. Members only.
                  </p>
                </div>
                <Lock className="w-4 h-4 shrink-0 text-muted-foreground" aria-label="Locked" />
              </button>
            </li>
          </ul>
        </CardContent>
      </Card>
    </section>
  </AnimatedSection>
);

export default JobBoardPreview;
