'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase';
import { useUserStore } from '@/store/useUserStore';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
                    price: 15.00 // Fixed price or calculate
                });

            if (error) throw error;
            toast.success("Order Created!");
            setFormData({ weight_kg: '', clothes_type: '', pickup_time: '', price: '' });
        } catch (e: any) {
            toast.error(e.message || "Failed to create order");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Request Laundry Service</CardTitle>
                <CardDescription>Fill in the details for your laundry pickup.</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="weight">Estimation Weight (kg)</Label>
                        <Input
                            id="weight"
                            type="number"
                            placeholder="e.g. 5"
                            value={formData.weight_kg}
                            onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type">Clothes Type</Label>
                        <select
                            id="type"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={formData.clothes_type}
                            onChange={(e) => setFormData({ ...formData, clothes_type: e.target.value })}
                            required
                        >
                            <option value="" disabled>Select Type</option>
                            <option value="daily">Daily Wear (T-shirts, Jeans)</option>
                            <option value="bedding">Bedsheets / Towels</option>
                            <option value="delicate">Delicates</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="time">Preferred Pickup Time</Label>
                        <Input
                            id="time"
                            type="datetime-local"
                            value={formData.pickup_time}
                            onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Post Request
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
