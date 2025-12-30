'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'sonner';
import { Loader2, Shirt, BedDouble, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function CreateOrderForm() {
    const { user } = useUserStore();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        weight_kg: '',
        clothes_type: '',
        pickup_time: '',
        price: ''
    });

    const clothesTypes = [
        { id: 'daily', label: 'Daily Wear', icon: Shirt, desc: 'T-shirts, Jeans' },
        { id: 'bedding', label: 'Bedding', icon: BedDouble, desc: 'Sheets, Towels' },
        { id: 'delicate', label: 'Delicates', icon: Sparkles, desc: 'Hand wash only' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            const { error } = await supabase
                .from('orders')
                .insert({
                    customer_id: user.id,
                    weight_kg: parseFloat(formData.weight_kg),
                    clothes_type: formData.clothes_type,
                    pickup_time: new Date(formData.pickup_time).toISOString(),
                    status: 'pending',
                    price: 15.00
                });

            if (error) throw error;
            toast.success("Order request posted!", {
                description: "Washers nearby have been notified."
            });
            setFormData({ weight_kg: '', clothes_type: '', pickup_time: '', price: '' });
        } catch (e: any) {
            toast.error(e.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GlassCard className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight">New Laundry Request</h2>
                <p className="text-muted-foreground">Select details for your pickup.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Clothes Type Tiles */}
                <div className="space-y-3">
                    <Label className="text-base font-semibold">What are we washing?</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {clothesTypes.map((type) => {
                            const Icon = type.icon;
                            const isSelected = formData.clothes_type === type.id;
                            return (
                                <div
                                    key={type.id}
                                    onClick={() => setFormData({ ...formData, clothes_type: type.id })}
                                    className={cn(
                                        "cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:border-primary/50 relative overflow-hidden",
                                        isSelected
                                            ? "border-primary bg-primary/5"
                                            : "border-transparent bg-secondary"
                                    )}
                                >
                                    <div className="flex flex-col items-center text-center gap-2">
                                        <Icon className={cn("h-6 w-6", isSelected ? "text-primary" : "text-muted-foreground")} />
                                        <span className={cn("font-medium", isSelected ? "text-primary" : "text-foreground")}>{type.label}</span>
                                        <span className="text-xs text-muted-foreground">{type.desc}</span>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="check"
                                            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary"
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Inputs */}
                <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="weight" className="text-base font-semibold">Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder="Ex: 5"
                            className="h-12 text-lg bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary"
                            value={formData.weight_kg}
                            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time" className="text-base font-semibold">Pickup Time</Label>
                        <Input
                            id="time"
                            type="datetime-local"
                            className="h-12 text-base bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-200 dark:border-zinc-800 focus:ring-primary"
                            value={formData.pickup_time}
                            onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] mt-8"
                    disabled={loading}
                >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Order Laundry ($15)"}
                </Button>
            </form>
        </GlassCard>
    );
}
