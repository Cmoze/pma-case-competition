import { db } from "@/lib/localDb";

export async function submitRating({
  rating,
  message,
  page,
  profileId,
}: {
  rating: number;
  message: string;
  page: string;
  profileId?: string;
}) {
  const { error } = await db.from("user_feedback").insert({
    type: "rating",
    rating,
    message: message.trim().slice(0, 2000),
    page,
    user_id: profileId ?? null,
  });
  if (error) throw error;
}
