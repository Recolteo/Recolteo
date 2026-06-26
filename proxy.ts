import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";

const MAX_LOGIN_ATTEMPTS = 10;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;

async function checkLoginRateLimit(ip: string): Promise<boolean> {
  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

  const now = new Date().toISOString();

  const { data: entry } = await admin
    .from("login_rate_limit")
    .select("attempts, reset_at")
    .eq("ip", ip)
    .maybeSingle();

  if (entry && entry.reset_at > now) {
    if (entry.attempts >= MAX_LOGIN_ATTEMPTS) return true;
    await admin
      .from("login_rate_limit")
      .update({ attempts: entry.attempts + 1 })
      .eq("ip", ip);
    return false;
  }

  await admin.from("login_rate_limit").upsert({
    ip,
    attempts: 1,
    reset_at: new Date(Date.now() + LOGIN_WINDOW_MS).toISOString(),
  });

  return false;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname.startsWith("/login");
  const isPublicPage =
    pathname === "/" ||
    pathname === "/decouvrir-recolteo" ||
    pathname === "/contact" ||
    pathname === "/mentions-legales" ||
    pathname === "/politique-de-confidentialite" ||
    pathname === "/cookies";

  if (isPublicPage) {
    return NextResponse.next({ request });
  }

  if (
    request.method === "POST" &&
    isLoginPage &&
    request.headers.has("next-action")
  ) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const blocked = await checkLoginRateLimit(ip).catch(() => false);
    if (blocked) {
      return new NextResponse("Trop de tentatives. Réessayez dans 15 minutes.", {
        status: 429,
        headers: {
          "Retry-After": "900",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
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

  const {
    data: { user },
  } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }));

  if (!user && !isLoginPage) {
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
