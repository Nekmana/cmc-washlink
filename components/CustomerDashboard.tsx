'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Order } from '@/types';
import OrderCard from '@/components/OrderCard';
import CreateOrderForm from '@/components/CreateOrderForm';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function CustomerDashboard() {
    const { user } = useUserStore();
    const [myOrders, setMyOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .eq('customer_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setMyOrders(data as unknown as Order[]);
            setLoading(false);
        };

        fetchOrders();

        const channel = supabase.channel('my_orders')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'orders',
                filter: `customer_id=eq.${user.id}`
            }, fetchOrders)
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        }
    }, [user]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-8">
            <section>
                <CreateOrderForm />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4">My Orders</h2>
                {myOrders.length === 0 ? (
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {myOrders.map(order => <OrderCard key={order.id} order={order} userRole="customer" />)}
                    </div>
                )}
            </section>
        </div>
    );
}
