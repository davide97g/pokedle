import { Link } from "@nextui-org/react";

export default function Header() {
  return (
    <div className="flex flex-row justify-between items-center gap-4 px-5 py-3">
      <div className="flex flex-row items-center gap-4">
        <img src="/logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-2xl">Pokèdle</h1>
      </div>
      <div className="flex flex-row items-center gap-4">
        <Link href="/about">About</Link>
        <Link href="/rankings">Rankings</Link>
        <Link href="/me">Me</Link>
        <Link href="/checkout">Checkout</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/login">Login</Link>
      </div>
    </div>
  );
}
