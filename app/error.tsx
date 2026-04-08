'use client';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-prax-silver text-label tracking-widest uppercase mb-6">Error</p>
      <h1 className="text-h2 font-light tracking-tight mb-4">Something Went Wrong</h1>
      <p className="text-prax-stone text-body max-w-md mb-10">
        We encountered an unexpected error. Please try again.
      </p>
      <button
        onClick={reset}
        className="inline-block border border-prax-graphite px-8 py-3 text-body-sm tracking-wide hover:bg-prax-charcoal transition-colors duration-300"
      >
        Try Again
      </button>
    </main>
  );
}
