import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Public route'ları tanımla
const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/callback(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // 2. Public route kontrolü
  if (isPublicRoute(req)) return;

  // 3. Koruma işlemi (Doğru kullanım)
  auth.protect({
    unauthorizedUrl: "/sign-in",
    unauthenticatedUrl: "/sign-in",
  });
});

// 4. Next.js için yapılandırma
export const config = {
  matcher: ["/((?!.*\\..*|_next/).*)"],
};
