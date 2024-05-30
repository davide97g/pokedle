import { Button, Progress } from "@nextui-org/react";
import { AUTH } from "../services/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { useEffect, useState } from "react";
import { API_ADMIN } from "../services/api";
import { useUser } from "../hooks/useUser";

export default function Admin() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    AUTH.logout().then(() => navigate("/login"));
  };

  const { isAdmin, setIsAdmin } = useUser();
  const [loading, setLoading] = useState(false);

  const createAdmin = async () => {
    const token = await auth.currentUser?.getIdToken();
    if (!token) return;
    API_ADMIN.createAdmin(token);
  };

  useEffect(() => {
    setLoading(true);
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        await user.getIdTokenResult().then((idTokenResult) => {
          setIsAdmin(!!idTokenResult.claims.admin);
        });
      } else {
        navigate("/login");
      }
      setLoading(false);
    });
  }, [navigate, setIsAdmin]);

  if (loading) {
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
      {!isAdmin && (
        <div className="flex flex-col gap-10 items-center">
          <p>Unauthorized!</p>
          <div className="flex flex-row gap-5 items-center">
            <Button color="danger" onClick={handleLogout}>
              Logout
            </Button>
            <Button onClick={() => navigate("/")}>Home</Button>
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="flex flex-col gap-10 items-center">
          <h1 className="text-2xl">Pokedle Admin</h1>
          <Button onClick={createAdmin} color="danger">
            Create Admin
          </Button>
        </div>
      )}
    </div>
  );
}
