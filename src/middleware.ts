import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: ["/UserPage/:path*", "/auth-callback", "/Charts"],
};

export default authMiddleware