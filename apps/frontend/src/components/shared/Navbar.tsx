import { VolumeMute, VolumeUp } from "@carbon/icons-react";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { useStatus } from "../../hooks/useStatus";
import { getAvatarInitials } from "../../services/utils";
import { PokedleLogo } from "./PokedleLogo";

type NavbarItem = {
  link: string;
  label: string;
};

export default function TopNavbar() {
  const { user } = useAuth();
  const { mute, toggleMute } = useStatus();

  const navigate = useNavigate();
  const links: NavbarItem[] = [
    { link: "/", label: "Guess" },
    { link: "/about", label: "About" },
    { link: "/leaderboard", label: "Leaderboard" },
  ];

  return (
    <Navbar
      classNames={{
        wrapper: "pl-2 pr-4",
      }}
    >
      <NavbarBrand>
        <PokedleLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {links.map(({ link, label }) => (
          <Link
            className="text-foreground hover:text-primary"
            onClick={() => navigate(link)}
            key={label}
          >
            {label}
          </Link>
        ))}
      </NavbarContent>

      <NavbarContent justify="end">
        {!user && (
          <NavbarItem className="lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
        )}
        {user && (
          <NavbarItem className="flex gap-2 items-center">
            <Button
              isIconOnly
              color={mute ? "default" : "primary"}
              variant="light"
              size="sm"
              onPress={toggleMute}
            >
              {mute ? <VolumeMute /> : <VolumeUp />}
            </Button>
            <Avatar
              color="secondary"
              isBordered
              radius="sm"
              src={user.photoURL ?? undefined}
              name={user.email ?? undefined}
              getInitials={getAvatarInitials}
              onClick={() => navigate("/me")}
            />
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
