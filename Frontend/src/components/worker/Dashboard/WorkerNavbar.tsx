import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell } from "lucide-react";

export const Navbar = () => {
  const workerData  = useSelector((state: RootState) => state.workerTokenSlice.worker);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm">
      <h1 className="text-xl font-semibold text-black">Dashboard</h1>

      <div className="flex items-center gap-4">
        <button className="relative text-muted-foreground hover:text-black">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <Avatar>
          <AvatarImage src={workerData?.image} alt={workerData?.name} />
          <AvatarFallback>
            {workerData?.name?.[0]?.toUpperCase() ?? "W"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
};
