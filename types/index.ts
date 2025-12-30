export type Role = 'customer' | 'washer';

export interface Profile {
    id: string;
    email: string | null;
    full_name: string | null;
    role: Role;
    dorm_block: string | null;
    room_number: string | null;
    avatar_url: string | null;
    total_washes: number;
    rating: number;
    is_verified: boolean;
}

export type OrderStatus = 'pending' | 'accepted' | 'washing' | 'ready' | 'completed' | 'cancelled';

export interface Order {
    id: string;
    customer_id: string;
    washer_id: string | null;
    status: OrderStatus;
    weight_kg: number;
    clothes_type: string;
    pickup_time: string; // ISO string
    price: number | null;
    created_at: string;
    updated_at: string;
    profiles?: Profile; // Joins
}
