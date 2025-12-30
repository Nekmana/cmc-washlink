import { GlassCard } from "@/components/ui/glass-card";

export default function ProfilePage() {
    return (
        <div className="container py-8 max-w-md">
            <h1 className="text-2xl font-bold mb-6">My Profile</h1>
            <GlassCard className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-slate-200"></div>
                    <div>
                        <h2 className="text-lg font-bold">Student Name</h2>
                        <p className="text-muted-foreground text-sm">Block A, Room 101</p>
                    </div>
                </div>
                <hr className="border-gray-100" />
                <div className="space-y-2">
                    <p className="text-sm font-medium">Verify Status</p>
                    <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                        Verified Student
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
