import Logo from "./beefboard-logo";
import styles from "../styles/navbar.module.css";
import Link from "next/link";
import { useRef } from "react";

function Navbar() {
  const navbarref = useRef<any>(null);
  return (
    <>
      <div className={styles.navbar_container} ref={navbarref}>
        <Link href="/">
          <a className={styles.logo + " " + styles.link}>
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
    </>
  );
}

export default Navbar;
