import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="flex justify-center py-4">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="HousieHub Logo"
            width={100} // adjust size as needed
            height={80}
            className="object-contain"
          />
        </Link>
      </div>
    </header>
  );
}
