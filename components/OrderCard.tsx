'use client';

import { Order, Profile } from '@/types';
import { Card, CardFooter, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface OrderCardProps {
    order: Order;
    userRole?: 'customer' | 'washer';
}

export default function OrderCard({ order, userRole }: OrderCardProps) {
    const { user } = useUserStore();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const handleStatusUpdate = async (newStatus: Order['status']) => {
        setLoading(true);
        try {
            const { error } = await supabase
                .from('orders')
                .update({ status: newStatus, washer_id: newStatus === 'accepted' ? user?.id : order.washer_id })
                .eq('id', order.id);

            if (error) throw error;
            toast.success(`Order updated to ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update order");
        } finally {
            setLoading(false);
        }
    };

    const getBadgeColor = (status: string) => {
        switch (status) {
            case 'pending': return 'secondary';
            case 'accepted': return 'default';
            case 'washing': return 'default'; // maybe blue
            case 'ready': return 'success'; // implemented as green in custom css usually, or just default
            case 'completed': return 'outline';
            default: return 'outline';
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>Order #{order.id.slice(0, 5)}</CardTitle>
                        <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
                    </div>
                    <Badge variant={getBadgeColor(order.status) as any}>{order.status}</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{order.clothes_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Weight:</span>
                    <span className="font-medium">{order.weight_kg}kg</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Pickup:</span>
                    <span className="font-medium">{new Date(order.pickup_time).toLocaleString()}</span>
                </div>
                {order.price && (
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium font-bold text-primary">${order.price}</span>
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex gap-2 justify-end">
                {userRole === 'washer' && order.status === 'pending' && (
                    <Button onClick={() => handleStatusUpdate('accepted')} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Accept Job
                    </Button>
                )}
                {userRole === 'washer' && order.washer_id === user?.id && (
                    <>
                        {order.status === 'accepted' && (
                            <Button onClick={() => handleStatusUpdate('washing')} disabled={loading}>Washing</Button>
                        )}
                        {order.status === 'washing' && (
                            <Button onClick={() => handleStatusUpdate('ready')} disabled={loading}>Ready</Button>
                        )}
                        {order.status === 'ready' && (
                            <Button onClick={() => handleStatusUpdate('completed')} disabled={loading}>Complete</Button>
                        )}
                    </>
                )}
                {userRole === 'customer' && order.status === 'pending' && (
                    <Button variant="destructive" onClick={() => handleStatusUpdate('cancelled')} disabled={loading}>Cancel</Button>
                )}
            </CardFooter>
        </Card>
    );
}
