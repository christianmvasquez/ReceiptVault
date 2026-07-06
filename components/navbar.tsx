export default function Navbar() {
  return (
    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <h1 className="text-2xl font-bold">📸 Receipt Vault</h1>

      <a
        href="/login"
        className="rounded-xl bg-blue-500 px-5 py-2 font-semibold hover:bg-blue-600 transition"
      >
        Sign In
      </a>
    </nav>
  );
}