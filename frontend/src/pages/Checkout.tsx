import { Warning } from "@carbon/icons-react";
import { Button, Code, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const checkoutSessionId = new URLSearchParams(window.location.search).get(
    "checkout_session_id"
  );

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
          <Code>Checkout Session ID: {checkoutSessionId}</Code>
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
