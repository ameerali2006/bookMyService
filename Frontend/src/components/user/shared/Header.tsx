import { Search, Calendar, User, Menu, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authService } from "@/api/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { removeUser } from "@/redux/slice/userTokenSlice";
import type { RootState } from "@/redux/store";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();

  // ✅ Get user and city from Redux
  const user = useSelector((state: RootState) => state.userTokenSlice.user);
  const city = useSelector((state: RootState) => state.userTokenSlice.user?.location?.city || "Your City");

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(removeUser());
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900 px-4 py-3 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-1">
            <img
              src="https://res.cloudinary.com/dp1sx1dx2/image/upload/v1752927468/assets_task_01k0gjp6nqeyrsgd985mke9ef1_1752903217_img_1_twx4l0_c_crop_w_1200_h_310_yhb86f.webp"
              alt="BookMyService Logo"
              className="h-10 -my-2"
            />
          </Link>
        </div>

        {/* ✅ City Name from Redux */}
        <div className="flex items-center text-white text-sm space-x-1">
          <MapPin className="h-4 w-4 text-yellow-400" />
          <span className="truncate max-w-[120px]">{city}</span>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            className="w-full rounded-full bg-white py-2 pl-10 pr-4 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Navigation and Icons */}
        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/service" className="text-white hover:text-blue-200 transition-colors">
              Service
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-200 transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  // variant="ghost"
                  // size="icon"
                  to="/bookings"
                  className="flex items-center justify-center w-8 h-8 text-white hover:text-blue-200 transition-colors"
                >
                  <Calendar className="h-5 w-5" />
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-400 text-black hover:bg-yellow-300 transition-colors">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="mt-2 w-32 bg-white rounded shadow-md z-50">
                    <DropdownMenuItem asChild>
                      <Link
                        to="/profile"
                        className="block w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="text-sm bg-white text-blue-900 hover:bg-gray-100"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="text-sm bg-yellow-400 text-black hover:bg-yellow-300"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden flex items-center justify-center w-8 h-8 text-white"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-blue-700">
          <nav className="flex flex-col space-y-2 pt-4">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors px-2 py-1">
              Home
            </Link>
            <Link to="/service" className="text-white hover:text-blue-200 transition-colors px-2 py-1">
              Service
            </Link>
            <Link to="/contact" className="text-white hover:text-blue-200 transition-colors px-2 py-1">
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
