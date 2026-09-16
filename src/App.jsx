export default function App() {
  return (
    <main className="min-h-screen px-6 py-8 text-stone-900">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-[2rem] border border-stone-300/70 bg-white/70 px-8 py-12 shadow-[0_30px_80px_-40px_rgba(31,41,55,0.45)] backdrop-blur-sm sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500">Monthory</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Empty foundation
          </h1>
          <p className="mt-5 max-w-prose text-base leading-7 text-stone-600 sm:text-lg">
            The framework, UI layer, and shared state stack are initialized. No features, data, or
            persistence have been added yet.
          </p>
        </div>
      </section>
    </main>
  );
}