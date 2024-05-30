import { Button, Chip, Divider, Input, Tooltip } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import User from "../components/User";

import { AUTH } from "../services/auth";

import { lazy, Suspense, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "../components/Loader";
import { ArrowLeft } from "@carbon/icons-react";
import { useUserUpdateUser } from "../hooks/database/user/useUserUpdateUser";

const Stats = lazy(() => import("../components/Stats"));

export default function PersonalArea() {
  const { isLogged, user, isAdmin, refetch } = useAuth();
  const { mutateAsync: updateUser, isPending } = useUserUpdateUser();
  const isMobile = window.innerWidth < 768;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login");
    }
  }, [isLogged, navigate]);

  const handleLogout = async () => {
    AUTH.logout().then(() => navigate("/"));
  };

  const add10BestGuesses = () =>
    updateUser({
      id: user!.id!,
      numberOfBestGuesses: (user?.numberOfBestGuesses ?? 0) + 10,
    }).then(refetch);

  return (
    <div className="w-full sm:w-6/12 flex flex-col justify-center items-center gap-4 px-10">
      {isPending && <Loader />}
      <div className="pt-28 md:pt-20 flex flex-row items-center">
        <img src="./logo.png" alt="logo" height={45} width={45} />
        <h1 className="text-2xl">Personal Area</h1>
      </div>
      <Button
        isIconOnly={isMobile}
        size={isMobile ? "sm" : "md"}
        className="text-xs sm:text-sm absolute top-2 left-2 sm:top-4 sm:left-4"
        onClick={() => navigate("/")}
        variant="ghost"
        startContent={<ArrowLeft />}
      >
        {isMobile ? "" : "Home"}
      </Button>
      <User interactive={false} />
      <div className="flex flex-col gap-5 w-full">
        {isAdmin && (
          <Chip
            color="primary"
            variant="shadow"
            className="cursor-pointer text-xs sm:text-sm self-center"
            classNames={{
              base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/10 shadow-pink-500/30",
              content: "drop-shadow shadow-black text-white",
            }}
          >
            Admin
          </Chip>
        )}
        <Input
          isReadOnly
          type="email"
          label="Email"
          color="secondary"
          variant="bordered"
          value={user?.displayName}
          className="max-w-xs"
        />
        <Input
          isReadOnly
          type="email"
          label="Email"
          color="secondary"
          variant="bordered"
          value={user?.email}
          className="max-w-xs"
        />
        <div className="flex flex-row gap-2 sm:gap-4">
          <Tooltip color="foreground" content="Number of best guess remaining">
            <Chip
              variant="flat"
              color="secondary"
              className="cursor-pointer text-xs sm:text-sm"
            >
              Best Guesses: {user?.numberOfBestGuesses ?? 0}
            </Chip>
          </Tooltip>
          <Button
            radius="full"
            size="sm"
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
            onClick={add10BestGuesses}
          >
            Add 10 Best Guesses
          </Button>
        </div>

        <Divider className="my-2" />

        <Suspense fallback={<Loader />}>
          <Stats />
        </Suspense>

        <Divider className="my-2" />

        <div className="flex flex-col gap-5">
          <Button
            variant="bordered"
            color="primary"
            onClick={() =>
              window.open("https://buy.stripe.com/test_00g7subgM8AXbG8dQQ")
            }
          >
            Become Pro
          </Button>
        </div>

        <Divider className="my-2" />

        <div className="flex flex-row gap-2 sm:gap-4">
          <Button
            color="danger"
            onClick={handleLogout}
            size={isMobile ? "sm" : "md"}
            className="text-xs sm:text-sm"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
