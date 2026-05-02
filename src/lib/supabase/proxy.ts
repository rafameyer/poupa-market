import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { APP_ROUTES } from "@/constants/app";
import { sanitizeNextPath } from "@/lib/auth/user-profile";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/lists",
  "/products",
  "/markets",
  "/prices",
  "/compare",
  "/settings",
];

function isProtectedPath(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));

        response = NextResponse.next({
          request: {
            headers: request.headers,
          },
        });

        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const requestedPath = `${pathname}${search}`;
  const isLoginPath = pathname === APP_ROUTES.login;

  if (!user && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = APP_ROUTES.login;
    loginUrl.searchParams.set("next", requestedPath);
    return NextResponse.redirect(loginUrl);
  }

  if (!user) {
    return response;
  }

  if (isLoginPath) {
    return NextResponse.redirect(
      new URL(sanitizeNextPath(request.nextUrl.searchParams.get("next")), request.url),
    );
  }

  return response;
}
