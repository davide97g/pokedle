import { Button } from "@nextui-org/react";
import { AUTH } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    AUTH.login().then((result) => {
      if (result) {
        navigate("/admin");
      }
    });
  };

  return (
    <div className="pt-28 md:pt-20 flex flex-col gap-10 items-center">
      <h1 className="text-2xl">Pokedle Login</h1>
      <Button color="primary" onClick={handleGoogleLogin}>
        Google Login
      </Button>
    </div>
  );
}
