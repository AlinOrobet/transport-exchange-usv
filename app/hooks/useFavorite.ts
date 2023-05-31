import axios from "axios";
import {useRouter} from "next/navigation";
import {useCallback, useMemo} from "react";
import toast from "react-hot-toast";
import {SafeUser} from "../types";

interface IUseFavorite {
  orderId: string;
  currentUser?: SafeUser | null;
}

const useFavorite = ({orderId, currentUser}: IUseFavorite) => {
  const router = useRouter();
  const hasFavorited = useMemo(() => {
    const list = currentUser?.favoriteIds || [];

    return list.includes(orderId);
  }, [currentUser, orderId]);

  const toggleFavorite = useCallback(
    async (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      try {
        let request;

        if (hasFavorited) {
          request = () => axios.delete(`/api/favorites/${orderId}`);
        } else {
          request = () => axios.post(`/api/favorites/${orderId}`);
        }

        await request();
        router.refresh();
        toast.success("Success");
      } catch (error) {
        toast.error("Something went wrong.");
      }
    },
    [hasFavorited, orderId, router]
  );

  return {
    hasFavorited,
    toggleFavorite,
  };
};
export default useFavorite;
