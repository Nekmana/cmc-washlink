'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ListOrdered, User, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/useUserStore';

export default function BottomNav() {
    const pathname = usePathname();
    const { user } = useUserStore();

    if (!user) return null; // Only show for logged in users

    const links = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/orders', label: 'Orders', icon: ListOrdered },
        { href: '/profile', label: 'Profile', icon: User },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t md:hidden">
            <div className="grid h-full grid-cols-4 mx-auto font-medium">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group",
                                isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"
                            )}
                        >
                            <Icon className={cn("w-6 h-6 mb-1", isActive ? "text-primary" : "text-gray-500 dark:text-gray-400 group-hover:text-primary")} />
                            <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary">
                                {link.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
