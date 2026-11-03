import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient()],
});
export const { signIn, signUp, signOut, useSession } = authClient;
export type AuthUser = typeof authClient.$Infer.Session.user;
