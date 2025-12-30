'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/store/useUserStore';
import { createClient } from '@/lib/supabase';
import WasherDashboard from '@/components/WasherDashboard';
import CustomerDashboard from '@/components/CustomerDashboard';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Profile } from '@/types';

export default function DashboardPage() {
    const { user, setUser, isLoading, setIsLoading } = useUserStore();
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) {
                router.push('/login');
                return;
            }

            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .single();

            if (profile) {
                setUser(profile as unknown as Profile);
            } else {
                // Handle case where profile doesn't exist yet (should trigger creation in real app)
                // For MVP, we might create it or redirect to onboarding
                console.error("Profile not found");
            }
            setIsLoading(false);
        };

        checkUser();
    }, [router, setUser, setIsLoading]);

    if (isLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="container py-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {user.full_name || 'Student'}.
                </p>
            </div>

            {user.role === 'washer' ? <WasherDashboard /> : <CustomerDashboard />}
        </div>
    );
}
