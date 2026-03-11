import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error("Missing Supabase environment variables");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const supabase = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle root path - let client-side splash handle for non-authenticated users
  if (request.nextUrl.pathname === "/") {
    if (user) {
      // Authenticated users go directly to day view
      return NextResponse.redirect(new URL("/day", request.url));
    }
    // For non-authenticated users, allow root splash to load
    return supabaseResponse;
  }

  // Protected routes
  if (!user && request.nextUrl.pathname.startsWith("/day")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!user && request.nextUrl.pathname.startsWith("/week")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect to day if logged in and on login page
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/day", request.url));
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely.

  return supabaseResponse;
}
