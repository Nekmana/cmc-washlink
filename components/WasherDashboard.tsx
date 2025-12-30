'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Order } from '@/types';
import OrderCard from '@/components/OrderCard';
import { Loader2 } from 'lucide-react';

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

        // Realtime subscription (Status updates) can be added here
        const channel = supabase.channel('orders_all')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, []);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <section>
                <h2 className="text-xl font-semibold mb-4">Active Jobs</h2>
                {activeOrders.length === 0 ? (
                    <p className="text-muted-foreground">No active jobs.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {activeOrders.map(order => <OrderCard key={order.id} order={order} userRole="washer" />)}
                    </div>
                )}
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">Available Pickups</h2>
                {availableOrders.length === 0 ? (
                    <p className="text-muted-foreground">No orders available near you.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {availableOrders.map(order => <OrderCard key={order.id} order={order} userRole="washer" />)}
                    </div>
                )}
            </section>
        </div>
    );
}
