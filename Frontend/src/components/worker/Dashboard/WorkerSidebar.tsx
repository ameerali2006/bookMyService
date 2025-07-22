import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  UserCog,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import {removeWorker  } from "@/redux/slice/workerTokenSlice";

const navItems = [
  { label: "Dashboard", icon: <LayoutDashboard />, path: "/worker/dashboard" },
  { label: "Appointments", icon: <Calendar />, path: "/worker/appointments" },
  { label: "Messages", icon: <MessageCircle />, path: "/worker/messages" },
  { label: "Profile", icon: <UserCog />, path: "/worker/profile" },
];

export const WorkerSidebar = () => {
  const dispatch = useDispatch();

  return (
    <aside className="w-64 bg-white shadow-md h-full flex flex-col justify-between">
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-black">Worker Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 p-2 rounded-lg font-medium hover:bg-muted transition ${
                  isActive ? "bg-muted text-primary" : "text-muted-foreground"
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-6 border-t">
        <button
          onClick={() => dispatch(removeWorker())}
          className="flex items-center gap-3 text-red-600 hover:text-red-800 font-medium"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};
