import { Construction } from "lucide-react";

interface ComingSoonProps {
  title?: string;
}

export default function ComingSoon({ title = "এই ফিচার" }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 rounded-full bg-primary/10 mb-6">
        <Construction className="h-16 w-16 text-primary" />
      </div>
      <h1 className="text-3xl font-bold mb-3">{title}</h1>
      <p className="text-xl text-muted-foreground mb-2">শীঘ্রই আসছে!</p>
      <p className="text-muted-foreground max-w-md">
        এই ফিচারটি বর্তমানে ডেভেলপমেন্টে আছে। খুব শীঘ্রই এটি ব্যবহার করতে পারবেন।
      </p>
    </div>
  );
}
