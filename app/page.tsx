import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WashingMachine, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="flex-1 flex flex-col justify-center items-center text-center px-4 py-20 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-background">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-primary mb-6">
                    Premium Laundry Service <br /> for CMC Students
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-8">
                    The easiest way to get your laundry done. Connect with verified student washers in your dorm block.
                </p>
                <div className="flex gap-4">
                    <Link href="/dashboard">
                        <Button size="lg" className="rounded-full px-8 text-lg">Get Started</Button>
                    </Link>
                    <Link href="/about">
                        <Button size="lg" variant="outline" className="rounded-full px-8 text-lg">Learn More</Button>
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="container py-20 grid md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Dorm-to-Dorm</h3>
                    <p className="text-muted-foreground">Find washers in your specific block for quick and easy handover.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Fast Turnaround</h3>
                    <p className="text-muted-foreground">Get your clothes back within hours, folded and fresh.</p>
                </div>
                <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-card border shadow-sm">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Trusted Peers</h3>
                    <p className="text-muted-foreground">Washers are verified students. Rated and reviewed by the community.</p>
                </div>
            </section>
        </div>
    );
}
