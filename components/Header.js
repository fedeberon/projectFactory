import React from "react";
import { useRouter } from "next/router";
// import Link from "next/link";

export default function Header() {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/professional">Professional</Link>
      <Link href="/professional/12-details" as="/">Professional/12-details</Link>
      <Link href="/project">Project</Link>
      <Link href="/project/21" as="/project/sarasa">Project/21-sarasa</Link>
      <Link href="/magazine">Magazine</Link>
      <Link href="/magazine/31" as="/magazine/sarasa3">Magazine/31-sarasa</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
}

const Link = ({ children, href }) => {
  const router = useRouter();
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        // typically you want to use `next/link` for this usecase
        // but this example shows how you can also access the router
        // and use it manually
        router.push(href);
      }}
    >
      {children}
      <style jsx>{`
        a {
          margin-right: 10px;
        }
      `}</style>
    </a>
  );
};