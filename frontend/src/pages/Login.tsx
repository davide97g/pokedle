import { Button } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { AUTH } from "../services/auth";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { isLogged } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    AUTH.login().then((result) => {
      if (result) navigate("/");
    });
  };

  useEffect(() => {
    if (isLogged) navigate("/me");
  }, [isLogged, navigate]);

  return (
    <div className="pt-28 md:pt-20 flex flex-col gap-10 items-center">
      <h1 className="text-2xl">Pokedle Login</h1>
      <p className="text-center text-sm px-10">
        Welcome to Pokedle! Please login to continue.
        <br />
        By logging in you will be able to record stats from your games and
        participate in the ranking.
      </p>
      <Button color="primary" onClick={handleGoogleLogin}>
        Google Login
      </Button>
    </div>
  );
}
