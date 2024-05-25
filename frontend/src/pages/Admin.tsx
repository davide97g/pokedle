import { Button, Progress } from "@nextui-org/react";
import { AUTH } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    AUTH.logout().then(() => navigate("/login"));
  };

  const [user, setUser] = useState<User>();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  if (!user) {
    return (
      <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="absolute w-screen z-50 top-0"
      />
    );
  }

  return (
    <div className="pt-28 md:pt-20 flex flex-col gap-10 items-center">
      <h1 className="text-2xl">Pokedle Admin</h1>
      <Button color="primary" onClick={handleLogout}>
        Logout
      </Button>
    </div>
  );
}
