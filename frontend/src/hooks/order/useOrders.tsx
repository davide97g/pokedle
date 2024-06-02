import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "../useAuth";
import { CheckoutItem } from "../../../../types/user.types";
import { API_PRO } from "../../services/api";
import dayjs from "dayjs";

export const useOrders = () => {
  const { user } = useAuth();
  const checkoutSessionIdList = useMemo(
    () => user?.paymentHistory?.map((record) => record.id) ?? [],
    [user]
  );

  const { data, isFetching } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      return API_PRO.getOrderHistory({
        checkoutSessionIdList,
      });
    },
  });

  const orders = useMemo(() => {
    const items: CheckoutItem[] | undefined = data?.history
      ?.flatMap((record) => record.data)
      ?.map(
        (item: {
          id: string;
          description: string;
          amount_total: number;
          quantity: number;
          price: {
            unit_amount: number;
            created: number;
          };
        }) =>
          ({
            id: item.id,
            total: item.amount_total,
            quantity: item.quantity,
            price: item.price.unit_amount,
            description: item.description,
            date: dayjs(item.price.created * 1000).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
          } as CheckoutItem)
      );
    return items;
  }, [data?.history]);

  return { orders, isLoading: isFetching };
};
