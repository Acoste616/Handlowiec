import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Skip middleware during build time
  if (process.env.NODE_ENV === 'development' && !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.next();
  }

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip if no Supabase config (build time)
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Client panel auth check
  if (req.nextUrl.pathname.startsWith('/client')) {
    if (!session) {
      return NextResponse.redirect(new URL('/client/login', req.url));
    }

    // Get user data with client_id
    const { data: userData } = await supabase
      .from('users')
      .select('client_id, role')
      .eq('id', session.user.id)
      .single();

    // Inject clientId into headers for API routes
    if (userData?.client_id) {
      response.headers.set('x-client-id', userData.client_id);
      response.headers.set('x-user-role', userData.role || 'agent');
    }
  }

  // API routes protection
  if (req.nextUrl.pathname.startsWith('/api/client')) {
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user data for API calls
    const { data: userData } = await supabase
      .from('users')
      .select('client_id, role')
      .eq('id', session.user.id)
      .single();

    if (!userData?.client_id) {
      return NextResponse.json(
        { error: 'No client associated with user' },
        { status: 403 }
      );
    }

    // Inject client context into headers
    response.headers.set('x-client-id', userData.client_id);
    response.headers.set('x-user-id', session.user.id);
    response.headers.set('x-user-role', userData.role || 'agent');
  }

  return response;
}

export const config = {
  matcher: [
    '/client/:path*', 
    '/api/client/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 