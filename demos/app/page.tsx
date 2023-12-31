import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const links = [
    {
      name: "Reading Data From Network",
      path: "/reading-data",
    },
    {
      name: "Writing Data To Network",
      path: "/writing-data",
    },
    {
      name: "Send SOL to Friend's Wallet with Phantom",
      path: "/interact-with-wallets",
    },
    {
      name: "Ping With Approval",
      path: "/ping-with-approval",
    },
    {
      name: "Movie Review App (Serialize Instruction Data)",
      path: "/serialize-instruction-data",
    },
  ];
  return (
    <main className="m-10">
      <h1 className="text-3xl">List of Demos: </h1>
      <ul className="ml-4 mt-5">
        {links.map((link, i) => (
          <li key={i} className="p-2">
            <Link
              className="text-gray-200 hover:text-gray-100 hover:underline"
              href={link.path}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
