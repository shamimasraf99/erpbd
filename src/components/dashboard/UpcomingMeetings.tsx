import { Video, Users, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Meeting {
  id: number;
  title: string;
  type: "zoom" | "onsite" | "call";
  time: string;
  duration: string;
  participants: string[];
  color: string;
}

const meetings: Meeting[] = [
  {
    id: 1,
    title: "প্রজেক্ট কিকঅফ মিটিং",
    type: "zoom",
    time: "১০:০০ - ১১:০০",
    duration: "১ ঘন্টা",
    participants: ["আহমেদ", "করিম", "সাবরিনা"],
    color: "border-l-primary",
  },
  {
    id: 2,
    title: "ক্লায়েন্ট প্রেজেন্টেশন",
    type: "onsite",
    time: "১৪:০০ - ১৫:৩০",
    duration: "১.৫ ঘন্টা",
    participants: ["রহিম", "তানভীর"],
    color: "border-l-success",
  },
  {
    id: 3,
    title: "টিম স্ট্যান্ডআপ",
    type: "call",
    time: "১৭:০০ - ১৭:৩০",
    duration: "৩০ মিনিট",
    participants: ["সবাই"],
    color: "border-l-warning",
  },
];

const typeIcons = {
  zoom: Video,
  onsite: MapPin,
  call: Users,
};

const typeLabels = {
  zoom: "জুম মিটিং",
  onsite: "অফিসে",
  call: "কল",
};

export function UpcomingMeetings() {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">আজকের মিটিং</h3>
          <p className="text-sm text-muted-foreground">৩টি মিটিং শিডিউল আছে</p>
        </div>
        <Button variant="outline" size="sm">
          ক্যালেন্ডার
        </Button>
      </div>

      <div className="space-y-3">
        {meetings.map((meeting) => {
          const TypeIcon = typeIcons[meeting.type];
          return (
            <div
              key={meeting.id}
              className={cn(
                "p-4 rounded-lg border-l-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer",
                meeting.color
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{meeting.title}</h4>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {meeting.time}
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      <TypeIcon className="h-3 w-3 mr-1" />
                      {typeLabels[meeting.type]}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 3).map((participant, i) => (
                    <div
                      key={i}
                      className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                    >
                      <span className="text-xs font-medium text-primary">
                        {participant.charAt(0)}
                      </span>
                    </div>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {meeting.participants.join(", ")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
