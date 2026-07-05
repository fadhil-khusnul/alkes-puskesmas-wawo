import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const { pathname } = request.nextUrl;

  // Bypass auth checks for static PWA assets
  if (
    pathname === "/sw.js" ||
    pathname === "/manifest.json" ||
    pathname.endsWith(".js.map") ||
    pathname.startsWith("/icon-")
  ) {
    return response;
  }

  const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";

  // If in development mode, check for a local dev session cookie
  if (isDev) {
    const devSession = request.cookies.get("dev_session")?.value;
    const isPublicRoute = pathname === "/" || pathname === "/login";

    if (!devSession && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (devSession && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  const isDemoMode =
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ===
      "https://placeholder-url.supabase.co";

  // If in demo mode, check for a simple cookie
  if (isDemoMode) {
    const demoAuth = request.cookies.get("demo_auth")?.value;
    const isPublicRoute = pathname === "/" || pathname === "/login";

    if (!demoAuth && !isPublicRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (demoAuth && pathname === "/login") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: {
        sameSite: 'none',
        secure: true,
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          const cookieOptions = { ...options, sameSite: 'none' as const, secure: true };
          request.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...cookieOptions,
          });
        },
        remove(name: string, options: CookieOptions) {
          const cookieOptions = { ...options, sameSite: 'none' as const, secure: true };
          request.cookies.set({
            name,
            value: "",
            ...cookieOptions,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: "",
            ...cookieOptions,
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect routes except public ones
  const isPublicRoute = pathname === "/" || pathname === "/login";
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If user is logged in and trying to access login page, redirect to dashboard
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
