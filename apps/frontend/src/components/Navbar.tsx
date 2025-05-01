import { Link } from "@heroui/link";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { useAuth } from "../context/AuthProvider";
import { PokedleLogo } from "./PokedleLogo";

type NavbarItem = {
  link: string;
  label: string;
};

export default function TopNavbar() {
  // TODO: transform into SPA navigation

  const { user } = useAuth();

  console.log("user", user);

  const links: NavbarItem[] = [
    { link: "/", label: "Guess" },
    { link: "/about", label: "About" },
    { link: "/me", label: "Personal Area" },
  ];
  return (
    <Navbar>
      <NavbarBrand>
        <PokedleLogo />
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {links.map(({ link, label }) => (
          <a
            className="text-foreground hover:text-primary"
            href={link}
            key={label}
          >
            {label}
          </a>
        ))}
      </NavbarContent>
      <NavbarContent justify="end">
        {!user && (
          <NavbarItem className="lg:flex">
            <Link href="/login">Login</Link>
          </NavbarItem>
        )}
      </NavbarContent>
    </Navbar>
  );
}
