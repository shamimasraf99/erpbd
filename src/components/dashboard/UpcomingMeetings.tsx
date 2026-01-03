import { Video, Users, MapPin, Clock, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTodayMeetings } from "@/hooks/useMeetings";
import { format } from "date-fns";

const typeIcons: Record<string, typeof Video> = {
  client: MapPin,
  internal: Users,
  online: Video,
};

const typeLabels: Record<string, string> = {
  client: "ক্লায়েন্ট",
  internal: "ইন্টার্নাল",
  online: "অনলাইন",
};

const typeColors: Record<string, string> = {
  client: "border-l-success",
  internal: "border-l-primary",
  online: "border-l-warning",
};

function toBanglaTime(date: Date): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const toBangla = (num: number) => num.toString().padStart(2, '0').split('').map(d => banglaDigits[parseInt(d)] || d).join('');
  return `${toBangla(hours)}:${toBangla(minutes)}`;
}

function toBanglaDuration(minutes: number): string {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBangla = (num: number) => num.toString().split('').map(d => banglaDigits[parseInt(d)] || d).join('');
  
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${toBangla(hours)} ঘন্টা`;
    return `${toBangla(hours)}.${toBangla(Math.round(mins / 6))} ঘন্টা`;
  }
  return `${toBangla(minutes)} মিনিট`;
}

export function UpcomingMeetings() {
  const { data: meetings, isLoading } = useTodayMeetings();

  if (isLoading) {
    return (
      <div className="chart-container flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const meetingCount = meetings?.length || 0;

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">আজকের মিটিং</h3>
          <p className="text-sm text-muted-foreground">
            {meetingCount === 0 ? "কোনো মিটিং নেই" : `${meetingCount}টি মিটিং শিডিউল আছে`}
          </p>
        </div>
        <Button variant="outline" size="sm">
          ক্যালেন্ডার
        </Button>
      </div>

      {meetings && meetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          আজকের জন্য কোনো মিটিং নেই
        </div>
      ) : (
        <div className="space-y-3">
          {meetings?.map((meeting) => {
            const meetingType = meeting.meeting_type || "internal";
            const TypeIcon = typeIcons[meetingType] || Users;
            const startTime = new Date(meeting.start_time);
            const endTime = meeting.end_time 
              ? new Date(meeting.end_time) 
              : new Date(startTime.getTime() + (meeting.duration_minutes || 60) * 60000);
            
            const participants = meeting.participants
              ?.map(p => p.employee?.full_name)
              .filter(Boolean) || [];

            return (
              <div
                key={meeting.id}
                className={cn(
                  "p-4 rounded-lg border-l-4 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer",
                  typeColors[meetingType] || "border-l-primary"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium">{meeting.title}</h4>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {toBanglaTime(startTime)} - {toBanglaTime(endTime)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <TypeIcon className="h-3 w-3 mr-1" />
                        {typeLabels[meetingType] || meetingType}
                      </Badge>
                    </div>
                  </div>
                </div>
                {meeting.location && (
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {meeting.location}
                  </div>
                )}
                {participants.length > 0 && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex -space-x-2">
                      {participants.slice(0, 3).map((name, i) => (
                        <div
                          key={i}
                          className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card flex items-center justify-center"
                        >
                          <span className="text-xs font-medium text-primary">
                            {name?.charAt(0)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {participants.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
