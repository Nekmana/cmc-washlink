import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WashingMachine, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-24 bg-gradient-to-b from-indigo-50/50 to-white dark:from-zinc-900/50 dark:to-zinc-950">
                <div className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 mb-8 dark:border-indigo-900/50 dark:bg-indigo-900/20 dark:text-indigo-300">
                    🚀 Now live at CMC Campus
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 max-w-4xl">
                    Premium Laundry Service <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
                        Student to Student.
                    </span>
                </h1>
                <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl mb-10 leading-relaxed">
                    The easiest way to get your laundry done. Connect with verified student washers in your dorm block correctly and safely.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="h-12 rounded-full px-8 text-lg bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all w-full sm:w-auto">
                            Get Started
                        </Button>
                    </Link>
                    <Link href="#features">
                        <Button size="lg" variant="outline" className="h-12 rounded-full px-8 text-lg bg-white/50 backdrop-blur-sm border-zinc-200 hover:bg-white/80 dark:bg-zinc-800/50 dark:border-zinc-700 dark:hover:bg-zinc-800 w-full sm:w-auto">
                            How it works
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="container py-24 grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6 text-primary">
                        <MapPin className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Dorm-to-Dorm</h3>
                    <p className="text-muted-foreground leading-relaxed">Find washers in your specific block for quick and easy handover.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-2xl bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center mb-6 text-cyan-600">
                        <Clock className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Fast Turnaround</h3>
                    <p className="text-muted-foreground leading-relaxed">Get your clothes back within hours, folded and fresh.</p>
                </div>
                <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6 text-emerald-600">
                        <ShieldCheck className="h-7 w-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">Trusted Peers</h3>
                    <p className="text-muted-foreground leading-relaxed">Washers are verified students. Rated and reviewed by the community.</p>
                </div>
            </section>
        </div>
    );
}
