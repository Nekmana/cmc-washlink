'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Order } from '@/types';
import OrderCard from '@/components/OrderCard';
import { GlassCard } from '@/components/ui/glass-card';
import { Loader2, TrendingUp, Power, MapPin } from 'lucide-react';

export default function WasherDashboard() {
    const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
    const [activeOrders, setActiveOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: pending } = await supabase.from('orders').select('*').eq('status', 'pending');
            const { data: active } = await supabase.from('orders').select('*')
                .in('status', ['accepted', 'washing', 'ready'])
                .order('updated_at', { ascending: false });

            if (pending) setAvailableOrders(pending as unknown as Order[]);
            if (active) setActiveOrders(active as unknown as Order[]);
            setLoading(false);
        };

        fetchOrders();

        const channel = supabase.channel('orders_all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">

            {/* Bento Grid Header */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Card 1: Active Status (Large) */}
                <GlassCard className="md:col-span-2 p-6 flex flex-col justify-between bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-200/50">
                    <div>
                        <h3 className="font-semibold text-lg text-indigo-900 dark:text-indigo-100">Live Status</h3>
                        <p className="text-sm text-indigo-600/80 dark:text-indigo-300">Tracking active jobs</p>
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                        <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{activeOrders.length}</span>
                        <span className="text-sm font-medium bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">Active Jobs</span>
                    </div>
                </GlassCard>

                {/* Card 2: Earnings (Medium) */}
                <GlassCard className="p-6 flex flex-col justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <TrendingUp className="h-5 w-5" />
                        <h3 className="font-medium">Earnings</h3>
                    </div>
                    <div className="mt-2">
                        <span className="text-3xl font-bold">$45.00</span>
                        <span className="text-xs text-green-500 ml-2">+12%</span>
                    </div>
                </GlassCard>

                {/* Card 3: Machine Status (Small/Interactive) */}
                <GlassCard className="p-6 flex flex-col justify-between cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group">
                    <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary">
                        <Power className="h-5 w-5" />
                        <h3 className="font-medium">Machine</h3>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                        <span className="font-bold">Online</span>
                    </div>
                </GlassCard>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Available Pickups
                        </h2>
                        <span className="text-xs font-medium bg-secondary px-2 py-1 rounded-md">{availableOrders.length} nearby</span>
                    </div>

                    <div className="space-y-4">
                        {availableOrders.length === 0 ? (
                            <div className="p-8 text-center border-2 border-dashed rounded-xl text-muted-foreground">
                                No orders available right now.
                            </div>
                        ) : (
                            availableOrders.map(order => <OrderCard key={order.id} order={order} userRole="washer" />)
                        )}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold mb-4">Active Jobs</h2>
                    <div className="space-y-4">
                        {activeOrders.length === 0 ? (
                            <p className="text-muted-foreground text-sm">You have no active laundry jobs.</p>
                        ) : (
                            activeOrders.map(order => <OrderCard key={order.id} order={order} userRole="washer" />)
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
