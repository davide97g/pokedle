import { ReactNode, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

export default function AuthenticatedPage({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && location.pathname !== "/login") {
      navigate("/login", {
        state: { from: location },
        replace: true,
      });
    }
  }, [user, location, navigate]);
  return children;
}
