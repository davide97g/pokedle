import { Warning } from "@carbon/icons-react";
import { Button, Code, Divider, Snippet } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_PRO } from "../services/api";
import { CheckoutItem } from "../types/payments";
import { CheckoutItemSummary } from "../components/CheckoutItemSummary";
import dayjs from "dayjs";

export default function Checkout() {
  const navigate = useNavigate();
  const checkoutSessionId = new URLSearchParams(window.location.search).get(
    "checkout_session_id"
  );

  const [lineItems, setLineItems] = useState<CheckoutItem[]>();

  useEffect(() => {
    if (!checkoutSessionId) return;
    API_PRO.getCheckoutSession(checkoutSessionId).then((data) => {
      console.log(data);
      const items: CheckoutItem[] = data?.lineItems?.data?.map(
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
      setLineItems(items);
    });
  }, [checkoutSessionId]);

  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">Checkout</h1>
      </div>
      {checkoutSessionId && (
        <div className="flex flex-col justify-center items-center gap-4 px-10">
          <p
            className="text-center"
            style={{ maxWidth: "400px", lineHeight: "1.5" }}
          >
            Thank you for your purchase!
            <br />
            You have successfully checked out.
          </p>
          <Divider />
          <h3
            className="text-lg text-center"
            style={{ maxWidth: "400px", lineHeight: "1.5" }}
          >
            Order Information
          </h3>
          <div className="flex flex-row gap-2 items-center">
            <p className="text-sm text-default-500">Checkout Session ID: </p>
            <Snippet hideSymbol>{checkoutSessionId}</Snippet>
          </div>
          <div className="flex flex-col gap-4">
            {lineItems?.map((item) => (
              <CheckoutItemSummary key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
      {!checkoutSessionId && (
        <div className="flex flex-row justify-center items-center gap-2 px-10">
          <Warning color="yellow" size={24} />
          <Code>Invalid Checkout Session ID.</Code>
        </div>
      )}

      <Divider />
      <Button color="primary" onClick={() => navigate("/")}>
        Home
      </Button>
    </div>
  );
}
