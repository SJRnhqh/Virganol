import { Monitor } from "lucide-react";

interface Props {
  name: string;
}

export const ComingSoonPanel = ({ name }: Props) => (
  <div className="flex flex-col items-center justify-center h-64 text-slate-400">
    <div className="p-4 rounded-full bg-slate-50 dark:bg-[#252526] mb-4">
      <Monitor className="w-8 h-8 opacity-20" />
    </div>
    <p>Settings for {name} are coming soon.</p>
  </div>
);