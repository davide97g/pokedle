import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithGoogle, singinWithEmail } from "../services/auth";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg bg-slate-900 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Pokedle Register
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          Registering you will be able to access advance features and record
          your stats to compete in the leaderboard!
        </p>
        <Button
          variant="solid"
          color="primary"
          onPress={() => loginWithGoogle().then(() => navigate("/me"))}
        >
          Register with Google
        </Button>
        <br />
        <p>Or register with email and password</p>
        <div className="mt-4 flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />
          <Button
            variant="solid"
            color="primary"
            type="submit"
            onPress={() =>
              singinWithEmail(email, password).then(() => navigate("/me"))
            }
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
