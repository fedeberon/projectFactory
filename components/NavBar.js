import React from 'react';
import Link from "next/link";

const NavBar = ({ lang }) => {
    return (
        <div>
            <ul>
          <li>
            <Link href="/professional" lang={ lang }>
              <a>Go to [professional].js</a>
            </Link>
          </li>
          <li>
            <Link href="/professional/12-details" as="/professional/sarasa2" lang={ lang }>
              <a>Go to [professional/12-details].js</a>
            </Link>
          </li>
          <li>
            <Link href="/proyect" lang={ lang }>
              <a>Go to [proyect].js</a>
            </Link>
          </li>
          <li>
            <Link href="/proyect/21" as="/proyect/sarasa" lang={ lang }>
              <a>Go to proyect/[21-sarasa].js</a>
            </Link>
          </li>
          <li>
            <Link href="/magazine" lang={ lang }>
              <a>Go to [magazine].js</a>
            </Link>
          </li>
          <li>
            <Link href="/magazine/31" as="/magazine/sarasa3" lang={ lang }>
              <a>Go to magazine/[31-sarasa].js</a>
            </Link>
          </li>
          <li>
            <Link href="/about" lang={ lang }>
              <a>Go to [about].js</a>
            </Link>
          </li>
          <li>
            <Link href="/contact" lang={ lang }>
              <a>Go to [contact].js</a>
            </Link>
          </li>
        </ul>
        </div>
    )
}

export default NavBar;
