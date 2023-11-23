import { authMiddleware } from "@kinde-oss/kinde-auth-nextjs/server";

export const config = {
  matcher: ["/UserPage/:path*", "/auth-callback", "/Charts", "/Testi"],
};

export default authMiddleware