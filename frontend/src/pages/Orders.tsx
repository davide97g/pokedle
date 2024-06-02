// import { CheckoutItemSummary } from "../components/CheckoutItemSummary";
// import { useOrders } from "../hooks/order/useOrders";
import { PaymentRecordSummary } from "../components/PaymentRecordSummary";
import { useAuth } from "../hooks/useAuth";

export default function Orders() {
  const { user } = useAuth();

  // const { orders } = useOrders();

  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      {
        <div className="flex flex-col justify-center items-center gap-4 px-10">
          <h3
            className="text-lg text-center"
            style={{ maxWidth: "400px", lineHeight: "1.5" }}
          >
            Order History
          </h3>
          {/* <div className="flex flex-col gap-4">
            {orders?.map((item) => (
              <CheckoutItemSummary key={item.id} item={item} />
            ))}
          </div> */}
          <div className="flex flex-col gap-4">
            {user?.paymentHistory?.map((item) => (
              <PaymentRecordSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
      }
    </div>
  );
}
