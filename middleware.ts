import {withAuth} from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/",
  },
});

export const config = {
  matcher: [
    "/dashboard/conversations/:path*",
    "/dashboard/home:path*",
    "/dashboard/settings/:path*",
    "/dashboard/team/:path*",
    "/dashboard/orders/:path*",
  ],
};
