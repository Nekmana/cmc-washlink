'use client';

import Link from 'next/link';
import { useUserStore } from '@/store/useUserStore';
import { Button } from '@/components/ui/button';
import { WashingMachine } from 'lucide-react';

export default function Navbar() {
    const { user } = useUserStore();

    return (
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                    <WashingMachine className="h-6 w-6" />
                    <span>CMC WashLink</span>
                </div>

                <div className="hidden md:flex items-center gap-6">
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
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium hidden sm:inline-block">{user.full_name?.split(' ')[0]}</span>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <img
                                    src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                                    alt="Avatar"
                                    className="h-8 w-8 rounded-full"
                                />
                            </Button>
                        </div>
                    ) : (
                        <Link href="/login">
                            <Button size="sm">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
