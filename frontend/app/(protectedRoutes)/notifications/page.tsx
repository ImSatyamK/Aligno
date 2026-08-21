import { getNotifications } from "@/api/notification";
import Image from "next/image";
import { Heart, MessageCircle, UserPlus, Bell } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

interface NotificationUser {
    _id: string;
    username: string;
    profileImg?: string;
}

interface NotificationItem {
    _id: string;
    from: NotificationUser;
    message: string;
    read: boolean;
    createdAt: string;
}

function NotificationIcon({ message }: { message: string }) {
    const lower = message.toLowerCase();
    if (lower.includes("like")) return <Heart className="h-4 w-4 text-red-500 fill-red-500" />;
    if (lower.includes("comment")) return <MessageCircle className="h-4 w-4 text-[#C08A2E]" />;
    if (lower.includes("follow")) return <UserPlus className="h-4 w-4 text-[#C08A2E]" />;
    return <Bell className="h-4 w-4 text-muted-foreground" />;
}

export default async function NotificationsPage() {
    const response = await getNotifications();

    if (!response.success) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                {response.error || "Couldn't fetch notifications."}
            </div>
        );
    }

    const notifications: NotificationItem[] = response.data.notifications ?? [];

    if (notifications.length === 0) {
        return (
            <div className="px-4 py-10 text-center text-muted-foreground">
                No notifications yet.
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto">
            {notifications.map((n) => (
                <div
                    key={n._id}
                    className={`flex items-center gap-3 border-b border-foreground/10 px-4 py-4 ${
                        n.read ? "" : "bg-[#C08A2E]/5"
                    }`}
                >
                    <div className="relative shrink-0">
                        <Image
                            src={n.from?.profileImg || "/default_profile.webp"}
                            alt={n.from?.username || "User"}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                        />
                        <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border border-foreground/10">
                            <NotificationIcon message={n.message} />
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-[15px] text-foreground break-words [overflow-wrap:anywhere]">
                            <span className="font-semibold">@{n.from?.username || "unknown"}</span>{" "}
                            {n.message}
                        </p>
                        <span className="text-sm text-muted-foreground">{timeAgo(n.createdAt)}</span>
                    </div>

                    {!n.read && (
                        <span className="h-2 w-2 rounded-full bg-[#C08A2E] shrink-0" />
                    )}
                </div>
            ))}
        </div>
    );
}