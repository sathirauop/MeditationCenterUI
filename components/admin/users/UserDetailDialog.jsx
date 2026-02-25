'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Phone, Calendar, Shield, BookOpen, Heart, CalendarCheck } from 'lucide-react';
import { useAdminUser } from '@/lib/hooks/use-admin-users';

export default function UserDetailDialog({ userId, open, onOpenChange }) {
    const { data: user, isLoading, error } = useAdminUser(open ? userId : null);

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>User Details</DialogTitle>
                    <DialogDescription>
                        View full user profile and activity statistics.
                    </DialogDescription>
                </DialogHeader>

                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    </div>
                )}

                {error && (
                    <p className="text-sm text-destructive py-4">
                        {error.message || 'Failed to load user details'}
                    </p>
                )}

                {user && !isLoading && (
                    <div className="space-y-6">
                        {/* Profile Info */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-14 w-14 rounded-full bg-teal-100 flex items-center justify-center">
                                    <span className="text-xl font-bold text-teal-700">
                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">{user.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge
                                            variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                                            className={user.role === 'ADMIN'
                                                ? 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                                                : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                                            }
                                        >
                                            <Shield className="h-3 w-3 mr-1" />
                                            {user.role}
                                        </Badge>
                                        <Badge
                                            variant={user.is_active ? 'default' : 'secondary'}
                                            className={user.is_active
                                                ? 'bg-green-100 text-green-800 hover:bg-green-100'
                                                : 'bg-gray-200 text-gray-600'
                                            }
                                        >
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                        {user.email_verified && (
                                            <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                Verified
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
                            <div className="grid gap-3 text-sm border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {user.mobile_number && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                                        <span>{user.mobile_number}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                                    <span>Joined {formatDate(user.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        {user.statistics && (
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                    Activity Statistics
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <StatCard
                                        icon={BookOpen}
                                        label="Total Bookings"
                                        value={user.statistics.totalBookings}
                                        color="teal"
                                    />
                                    <StatCard
                                        icon={CalendarCheck}
                                        label="Active Bookings"
                                        value={user.statistics.activeBookings}
                                        color="blue"
                                    />
                                    <StatCard
                                        icon={Heart}
                                        label="Total Donations"
                                        value={`Rs. ${Number(user.statistics.totalDonations || 0).toLocaleString()}`}
                                        color="rose"
                                    />
                                    <StatCard
                                        icon={Calendar}
                                        label="Event Registrations"
                                        value={user.statistics.eventRegistrations}
                                        color="amber"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Timestamps */}
                        <div className="text-xs text-muted-foreground border-t pt-3 space-y-1">
                            <p>Created: {formatDate(user.created_at)}</p>
                            <p>Last Updated: {formatDate(user.updated_at)}</p>
                            <p>User ID: {user.user_id}</p>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    const colorMap = {
        teal: 'bg-teal-50 text-teal-700 border-teal-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        rose: 'bg-rose-50 text-rose-700 border-rose-200',
        amber: 'bg-amber-50 text-amber-700 border-amber-200',
    };

    return (
        <div className={`rounded-lg border p-3 ${colorMap[color] || colorMap.teal}`}>
            <div className="flex items-center gap-2 mb-1">
                <Icon className="h-4 w-4" />
                <span className="text-xs font-medium">{label}</span>
            </div>
            <p className="text-lg font-bold">{value}</p>
        </div>
    );
}
