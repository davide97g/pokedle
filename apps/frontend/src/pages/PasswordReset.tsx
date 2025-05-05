import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Input } from "@heroui/input";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../services/auth";

export default function PasswordReset() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-sm rounded-lg bg-slate-900 p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold">
          Pokedle Reset Password
        </h1>
        <p className="mb-6 text-center text-sm text-slate-400">
          If you have forgotten your password, please enter your email address
          below. We will send you a link to reset your password.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 p-2 text-slate-200 focus:border-blue-500 focus:outline-none"
          />

          <Button
            variant="solid"
            color="primary"
            type="submit"
            onPress={() =>
              resetPassword(email).then(() => {
                navigate("/login");
              })
            }
          >
            Reset
          </Button>
        </div>
        <Divider className="my-4" />
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
