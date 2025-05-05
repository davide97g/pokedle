import { ArrowRight } from "@carbon/icons-react";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { PublicLeaderboard } from "../components/Stats/PublicLeaderboard";
import { useAuth } from "../context/AuthProvider";

export default function Leaderboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-2">
      <div className="text-2xl font-bold">Public Leaderboard</div>
      <div className="text-sm text-gray-500">
        {user ? (
          "See how you stack up against other players!"
        ) : (
          <>
            <p className="text-xl font-bold">Oops! 🙊</p>
            <div className="flex flex-row items-center gap-2">
              <p className="text-sm text-gray-500">
                You need to be logged in to see the leaderboard
              </p>
              <ArrowRight />
              <Button
                variant="solid"
                color="primary"
                onPress={() => {
                  navigate("/login", {
                    state: { from: "/leaderboard" },
                  });
                }}
              >
                Login
              </Button>
            </div>
          </>
        )}
      </div>
      {user && <PublicLeaderboard />}
    </div>
  );
}
