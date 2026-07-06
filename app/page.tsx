import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Features from "../components/features";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <Hero />
      <Features />
    </main>
  );
}