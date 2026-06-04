import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_LOGIN_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

function isLoginRateLimited(request: NextRequest): boolean {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_LOGIN_ATTEMPTS;
}

export async function middleware(request: NextRequest) {
  if (
    request.method === "POST" &&
    request.nextUrl.pathname.startsWith("/login") &&
    request.headers.has("next-action")
  ) {
    if (isLoginRateLimited(request)) {
      return new NextResponse(
        "Trop de tentatives. Réessayez dans 15 minutes.",
        {
          status: 429,
          headers: {
            "Retry-After": "900",
            "Content-Type": "text/plain; charset=utf-8",
          },
        }
      );
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  const { pathname } = request.nextUrl;
  const isLoginPage = pathname.startsWith("/login");
  const isPublicPage =
    pathname === "/" ||
    pathname === "/decouvrir-recolteo" ||
    pathname === "/contact" ||
    pathname === "/mentions-legales" ||
    pathname === "/politique-de-confidentialite" ||
    pathname === "/cookies";

  if (!user && !isLoginPage && !isPublicPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && isLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
