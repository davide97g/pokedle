import { Avatar } from "@nextui-org/react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function User({
  interactive = true,
}: {
  interactive?: boolean;
}) {
  const { isLogged, isAdmin, user } = useAuth();
  const navigate = useNavigate();
  if (!isLogged) return null;

  return (
    <Avatar
      className={`absolute top-3 right-3 ${
        interactive ? "cursor-pointer" : ""
      }`}
      isBordered
      radius="full"
      color={isAdmin ? "primary" : "default"}
      src={user?.photoURL ?? "https://i.pravatar.cc/150?u=a04258114e29026708c"}
      onClick={() => (interactive ? navigate("/me") : undefined)}
    />
  );
}
