import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import { getAvatarInitials } from "../../services/utils";
import { PokedleLogo } from "./PokedleLogo";

type NavbarItem = {
  link: string;
  label: string;
};

export default function TopNavbar() {
  const { user } = useAuth();

  const navigate = useNavigate();
  const links: NavbarItem[] = [
    { link: "/", label: "Guess" },
    { link: "/about", label: "About" },
    { link: "/leaderboard", label: "Leaderboard" },
  ];
  return (
    <Navbar>
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
          <NavbarItem className="lg:flex">
            <Avatar
              color="secondary"
              isBordered
              radius="sm"
              src={user.photoURL ?? undefined}
              name={user.email ?? undefined}
              getInitials={getAvatarInitials}
              onClick={() => navigate("/me")}
            ></Avatar>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
