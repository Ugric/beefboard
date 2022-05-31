import Logo from "./beefboard-logo";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Navbar({ setheight }: {
  setheight: (height: number) => void;
}) {
  const height = useState(0)
  const navbarref = useRef<any>(null);
  useEffect(
    () => {
      if (navbarref.current) {
        setheight(navbarref.current.offsetHeight);
        height[1](navbarref.current.offsetHeight);
      }
    }
  )
  return (
    <>
      <div className={styles.navbar_container} ref={navbarref}>
        <Link href="/">
          <a className={styles.logo}>
            <Logo width={50} />
            <div className={styles.big}>
              <h2 className={styles.name}>BeefBoard</h2>
            </div>
            <div className={styles.small}>
              <h4 className={styles.name}>BeefBoard</h4>
            </div>
          </a>
        </Link>
      </div>
      <div style={{ height: height[0] }}></div>
    </>
  );
}

export default Navbar;
