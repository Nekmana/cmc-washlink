'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { Order } from '@/types';
import OrderCard from '@/components/OrderCard';
import { Loader2 } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

export default function OrdersPage() {
    const { user } = useUserStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .or(`customer_id.eq.${user.id},washer_id.eq.${user.id}`) // Show orders wherever user is involved
                .order('created_at', { ascending: false });

            if (data) setOrders(data as unknown as Order[]);
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="container py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Order History</h1>
            {orders.length === 0 ? (
                <p className="text-muted-foreground">No orders found.</p>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => <OrderCard key={order.id} order={order} userRole={user?.role} />)}
                </div>
            )}
        </div>
    );
}
