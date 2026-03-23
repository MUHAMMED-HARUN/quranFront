import { useQuery } from "@tanstack/react-query";
import { countryService } from "../services/countryService";

export const useCountriesQuery = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const response = await countryService.getAll();
      console.log("Raw API Response:", response.Value); // تحقق من البيانات الخام
      return response.Value; // نعيد البيانات فقط
    },
  });
};
