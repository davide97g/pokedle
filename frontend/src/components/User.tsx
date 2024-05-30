import { Avatar } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function User({
  interactive = true,
}: {
  interactive?: boolean;
}) {
  const { isLogged, isAdmin, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Avatar
      className={`absolute top-3 right-3 ${
        interactive ? "cursor-pointer" : ""
      }`}
      isBordered
      radius="full"
      color={isAdmin ? "primary" : "default"}
      showFallback={!isLogged}
      src={user?.photoURL ?? undefined}
      onClick={() => (interactive ? navigate("/me") : undefined)}
    />
  );
}
