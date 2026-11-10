import { db } from "@/lib/localDb";

export const signOutAndReload = () => {
  db.auth.signOut({ scope: "local" }).finally(() => {
    window.location.href = "/";
  });
};
