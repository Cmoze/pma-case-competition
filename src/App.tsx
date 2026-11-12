import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import TeamPage from "./pages/TeamPage";
import ResourcesPage from "./pages/ResourcesPage";
import EventsPage from "./pages/EventsPage";
import ContactPage from "./pages/ContactPage";
import StudentsPage from "./pages/StudentsPage";
import CompaniesPage from "./pages/CompaniesPage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import RouteMeta from "./components/RouteMeta";
import GamePage from './pages/GamePage';
import AuthPage from "./pages/AuthPage";
import HackathonPage from "./pages/HackathonPage";
import HackathonSharePage from "./pages/HackathonSharePage";
import HackathonFAQPage from "./pages/HackathonFAQPage";
import BlockedPage from "./pages/BlockedPage";
import RoadmapPage from "./pages/RoadmapPage";
import PublicLayout from "./components/layout/PublicLayout";
import AskPage from "./pages/AskPage";
import CasePage from "./pages/CasePage";
import CodexSetupPage from "./pages/CodexSetupPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <RouteMeta />
            <Routes>
              {/* Public Marketing Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/case" element={<CasePage />} />
                <Route path="/case/codex" element={<CodexSetupPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/hackathon" element={<HackathonPage />} />
                <Route path="/hackathon/share" element={<HackathonSharePage />} />
                <Route path="/hackathon/faq" element={<HackathonFAQPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/discover" element={<Navigate to="/students" replace />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/blocked" element={<BlockedPage />} />
                <Route path="/roadmap" element={<RoadmapPage />} />
                <Route path="/events/ask" element={<AskPage />} />
                <Route path="/events" element={<EventsPage />} />
                {/* Free preview for non-members; ResourcesPage locks items on is_pma_member */}
                <Route path="/resources" element={<ResourcesPage />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Retired member portal pages redirect to /resources. */}
              {["/dashboard", "/jobs", "/members", "/tracker", "/interviews", "/resumes", "/preferences", "/profile"].map((path) => (
                <Route key={path} path={path} element={<Navigate to="/resources" replace />} />
              ))}

              <Route path="/game" element={<GamePage />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
