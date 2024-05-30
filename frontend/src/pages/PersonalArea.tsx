import { Button, Chip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import User from "../components/User";
import { useAuth } from "../hooks/useAuth";
import { AUTH } from "../services/auth";

export default function PersonalArea() {
  const { isLogged, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  if (!isLogged || !user) navigate("/login");

  const handleLogout = async () => {
    AUTH.logout().then(() => navigate("/"));
  };

  return (
    <div className="flex flex-col justify-center items-center gap-10 px-10">
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">Personal Area</h1>
      </div>
      <div className="flex flex-col gap-5">
        {isAdmin && (
          <Chip color="primary" variant="shadow">
            Admin
          </Chip>
        )}
        <div className="flex flex-row gap-5">
          <h2 className="text-lg">Name:</h2>
          <p>{user?.displayName}</p>
        </div>
        <div className="flex flex-row gap-5">
          <h2 className="text-lg">Email:</h2>
          <p>{user?.email}</p>
        </div>
        <User interactive={false} />

        {/* actions */}

        <div className="flex flex-row gap-5">
          <Button onClick={() => navigate("/")}>Home</Button>
          <Button color="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
