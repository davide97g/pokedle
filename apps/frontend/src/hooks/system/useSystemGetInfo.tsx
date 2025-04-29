import { useQuery } from "@tanstack/react-query";

export const useSystemGetInfo = () => {
  return useQuery({
    queryKey: ["systemInfo"],
    queryFn: async () => {
      const { VITE_BACKEND_URL } = import.meta.env;
      const response = await fetch(`${VITE_BACKEND_URL}/`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.ok;
    },
  });
};
