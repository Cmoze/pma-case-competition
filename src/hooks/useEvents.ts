import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/localDb";

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  status?: string;
  img?: string | null;
  registrationLink?: string | null;
}

export function useEvents() {
  const [data, setData] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: events, error: dbError } = await db
        .from("events")
        .select("id, title, description, start_time, end_time, location, is_public, registration_link, image_url")
        .eq("is_public", true)
        .order("start_time", { ascending: true });

      if (dbError) {
        throw dbError;
      }

      const mappedEvents: Event[] =
        events?.map((event) => ({
          id: event.id,
          title: event.title ?? "",
          date: event.start_time ?? "",
          description: event.description ?? "",
          location: event.location ?? "",
          status: event.is_public ? "upcoming" : "hidden",
          img: event.image_url ?? null,
          registrationLink: event.registration_link ?? null,
        })) ?? [];

      setData(mappedEvents);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load events. Please try again later.";
      console.error("Error fetching events:", err);
      if (err && typeof err === "object" && "message" in err) {
        console.error("Events fetch details:", (err as { message?: string; code?: string }).message);
      }
      setError(message);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    data,
    isLoading,
    isError: error !== null,
    error,
    refetch: fetchEvents,
  };
}
