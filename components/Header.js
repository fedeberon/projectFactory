import React from "react";
import { useRouter } from "next/router";
// import Link from "next/link";

export default function Header() {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/professional">Professional</Link>
      <Link href="/professional/12-details" as="/">Professional/12-details</Link>
      <Link href="/proyect">Proyect</Link>
      <Link href="/proyect/21" as="/proyect/sarasa">Proyect/21-sarasa</Link>
      <Link href="/magazine">Magazine</Link>
      <Link href="/magazine/31" as="/magazine/sarasa3">Magazine/31-sarasa</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
    </div>
  );
}

const Link = ({ children, href }) => {
  // console.log("#1 children nombre: " + children);
  // console.log("#2 href Ruta: " + href);
  // console.log("\n");
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

// const Header = ({ lang }) => {
//   return (
//     <div>
//       <ul>
//         <li>
//           <Link href="/professional" lang={lang}>
//             <a>Go to [professional].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link
//             href="/professional/12-details"
//             as="/professional/sarasa2"
//             lang={lang}
//           >
//             <a>Go to [professional/12-details].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/proyect" lang={lang}>
//             <a>Go to [proyect].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/proyect/21" as="/proyect/sarasa" lang={lang}>
//             <a>Go to proyect/[21-sarasa].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/magazine" lang={lang}>
//             <a>Go to [magazine].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/magazine/31" as="/magazine/sarasa3" lang={lang}>
//             <a>Go to magazine/[31-sarasa].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/about" lang={lang}>
//             <a>Go to [about].js</a>
//           </Link>
//         </li>
//         <li>
//           <Link href="/contact" lang={lang}>
//             <a>Go to [contact].js</a>
//           </Link>
//         </li>
//       </ul>
//     </div>
//   );
// };

// export default Header;
