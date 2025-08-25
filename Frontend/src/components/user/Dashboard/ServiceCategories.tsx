import { authService } from "@/api/AuthService";
import userAxios from "@/config/axiosSevice/UserAxios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface ServiceCategory {
  _id: string;
  category: string;
  image?: string;
  slug?: string; // optional if backend provides
}

export const ServiceCategories = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authService.getUserServices(); // replace with your backend
        const data = await res.data;
        console.log(data)
        setCategories(data.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleClick = (category: ServiceCategory) => {
    // navigate to details page
    if (category.slug) {
      navigate(`/services/${category.slug}`);
    } else {
      navigate(`/services/${category._id}`);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              onClick={() => handleClick(category)} // ✅ navigate on click
              className="flex flex-col items-center p-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.category}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-400 rounded"></div>
                )}
              </div>
              <span className="text-xs text-center font-medium text-gray-700">
                {category.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};


