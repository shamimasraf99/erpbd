import {
  UserPlus,
  FileText,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
  id: number;
  type: "user" | "invoice" | "payment" | "task" | "message" | "meeting";
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: "payment",
    title: "পেমেন্ট গৃহীত",
    description: "টেক সলিউশন্স থেকে ৳৫০,০০০ পেমেন্ট",
    time: "১০ মিনিট আগে",
  },
  {
    id: 2,
    type: "user",
    title: "নতুন কর্মী যোগ",
    description: "রহিম উদ্দিন - সফটওয়্যার ডেভেলপার",
    time: "৩০ মিনিট আগে",
  },
  {
    id: 3,
    type: "task",
    title: "টাস্ক সম্পন্ন",
    description: "UI ডিজাইন রিভিউ - ই-কমার্স প্রজেক্ট",
    time: "১ ঘন্টা আগে",
  },
  {
    id: 4,
    type: "invoice",
    title: "নতুন ইনভয়েস",
    description: "ইনভয়েস #২০২৫-০০১ তৈরি হয়েছে",
    time: "২ ঘন্টা আগে",
  },
  {
    id: 5,
    type: "meeting",
    title: "মিটিং শিডিউল",
    description: "ক্লায়েন্ট মিটিং - আজ বিকাল ৪টা",
    time: "৩ ঘন্টা আগে",
  },
  {
    id: 6,
    type: "message",
    title: "নতুন মেসেজ",
    description: "প্রজেক্ট ম্যানেজার থেকে মেসেজ এসেছে",
    time: "৪ ঘন্টা আগে",
  },
];

const iconMap = {
  user: UserPlus,
  invoice: FileText,
  payment: DollarSign,
  task: CheckCircle,
  message: MessageSquare,
  meeting: Calendar,
};

const colorMap = {
  user: "bg-primary/10 text-primary",
  invoice: "bg-warning/10 text-warning",
  payment: "bg-success/10 text-success",
  task: "bg-accent/10 text-accent",
  message: "bg-info/10 text-info",
  meeting: "bg-destructive/10 text-destructive",
};

export function RecentActivities() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">সাম্প্রতিক কার্যক্রম</h3>
          <p className="text-sm text-muted-foreground">আজকের আপডেট</p>
        </div>
        <button className="text-sm text-primary hover:underline">
          সব দেখুন
        </button>
      </div>

      <div className="space-y-1">
        {activities.map((activity, index) => {
          const Icon = iconMap[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  colorMap[activity.type]
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
