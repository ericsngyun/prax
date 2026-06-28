import { Link } from 'next-view-transitions';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-prax-silver text-label tracking-widest uppercase mb-6">404</p>
      <h1 className="text-h2 font-light tracking-tight mb-4">Page Not Found</h1>
      <p className="text-prax-stone text-body max-w-md mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block border border-prax-graphite px-8 py-3 text-body-sm tracking-wide hover:bg-prax-charcoal transition-colors duration-300"
      >
        Back to Home
      </Link>
    </main>
  );
}
