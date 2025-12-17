import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
    // Match all pathnames except for:
    // - /api routes
    // - /_next (Next.js internals)
    // - /images, /favicon.ico (static files)
    // - /admin (admin routes stay outside locale routing)
    matcher: ['/', '/(en|si)/:path*', '/((?!api|_next|images|favicon\\.ico|admin).*)']
};
