'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { WashingMachine } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default function Navbar() {
    const { user } = useUserStore();

    return (
        <nav className="border-b bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md sticky top-0 z-50 border-zinc-200 dark:border-zinc-800">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
                    <WashingMachine className="h-6 w-6" />
                    <span>CMC WashLink</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                    </Link>
                    {user && (
                        <>
                            <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                                Dashboard
                            </Link>
                            <Link href="/orders" className="text-sm font-medium transition-colors hover:text-primary">
                                Orders
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium hidden sm:inline-block text-zinc-600 dark:text-zinc-400">
                                {user.full_name?.split(' ')[0]}
                            </span>
                            <Avatar className="h-9 w-9 border-2 border-white dark:border-zinc-800 shadow-sm">
                                <AvatarImage src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm" className="rounded-full px-6 font-semibold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
