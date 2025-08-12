import './globals.css';
import Link from 'next/link';
import { auth, signOut } from '@/lib/auth';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en">
      <body>
        <header className="container nav">
          <Link href="/" className="logo" style={{fontWeight:700}}>SidelineCover</Link>
          <nav className="header-cta">
            <Link href="/jobs" className="btn">Jobs</Link>
            {session?.user ? (
              <>
                <Link href="/dashboard" className="btn">Dashboard</Link>
                <form action={async () => { 'use server'; await signOut(); }}>
                  <button className="btn">Sign out</button>
                </form>
              </>
            ) : (
              <>
                <Link href="/register" className="btn">Register</Link>
                <Link href="/login" className="btn primary">Sign in</Link>
              </>
            )}
          </nav>
        </header>
        <main className="container">{children}</main>
        <footer className="container footer">
          © {new Date().getFullYear()} SidelineCover — Connecting Irish clubs with verified physios. · <Link href="/legal/privacy">Privacy</Link> · <Link href="/legal/terms">Terms</Link>
        </footer>
      </body>
    </html>
  );
}
