import { Button } from "@heroui/button";
import { useAuth } from "../context/AuthProvider";
import { logout } from "../services/auth";

export default function PersonalArea() {
  const { user } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <div className="text-2xl font-bold">Personal Area</div>
      <div className="text-md">Welcome to your personal area!</div>
      <div className="text-md">Here you can manage your account settings.</div>
      <div className="flex flex-row gap-4 mt-10 items-center">
        <p>Your are currently logged in as: {user?.email}</p>
        <Button color="danger" onPress={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
}
