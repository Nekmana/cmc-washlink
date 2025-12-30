'use client';

import { Order } from '@/types';
import { GlassCard } from '@/components/ui/glass-card';
import { badgeVariants } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/useUserStore';
import { createClient } from '@/lib/supabase';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2, Package, Clock, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
            toast.success(`Order ${newStatus}!`);
        } catch (e) {
            toast.error("Failed to update order");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
            case 'accepted': return 'bg-blue-500/10 text-blue-600 border-blue-200';
            case 'washing': return 'bg-cyan-500/10 text-cyan-600 border-cyan-200';
            case 'ready': return 'bg-green-500/10 text-green-600 border-green-200';
            case 'completed': return 'bg-zinc-100 text-zinc-500 border-zinc-200';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="group relative overflow-hidden p-0 border-white/50 dark:border-zinc-800">
                <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg leading-none">#{order.id.slice(0, 5)}</p>
                                <p className="text-xs text-muted-foreground mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", getStatusColor(order.status))}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-secondary/50">
                            <Scale className="h-4 w-4" />
                            <span>{order.weight_kg}kg</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground p-2 rounded-lg bg-secondary/50">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(order.pickup_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm font-medium">Price</span>
                            <span className="text-xl font-bold text-primary">${order.price}</span>
                        </div>

                        {/* Actions */}
                        <div className="grid gap-2">
                            {userRole === 'washer' && order.status === 'pending' && (
                                <Button onClick={() => handleStatusUpdate('accepted')} disabled={loading} className="w-full bg-primary hover:bg-primary/90">
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Accept Job
                                </Button>
                            )}
                            {userRole === 'washer' && order.washer_id === user?.id && (
                                <div className="flex gap-2">
                                    {order.status === 'accepted' && (
                                        <Button onClick={() => handleStatusUpdate('washing')} disabled={loading} className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600">Start Washing</Button>
                                    )}
                                    {order.status === 'washing' && (
                                        <Button onClick={() => handleStatusUpdate('ready')} disabled={loading} className="flex-1 bg-green-500 text-white hover:bg-green-600">Ready</Button>
                                    )}
                                    {order.status === 'ready' && (
                                        <Button onClick={() => handleStatusUpdate('completed')} disabled={loading} className="flex-1" variant="outline">Complete</Button>
                                    )}
                                </div>
                            )}
                            {userRole === 'customer' && order.status === 'pending' && (
                                <Button variant="ghost" onClick={() => handleStatusUpdate('cancelled')} disabled={loading} className="text-destructive hover:text-destructive/90 hover:bg-destructive/10 w-full">Cancel Request</Button>
                            )}
                        </div>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
}
