import Logo from "./beefboard-logo";
import styles from "../styles/navbar.module.css";


function Navbar() {
    return (
      <div className={styles.navbar_container}>
        <div className={styles.big}>
          <Logo width={50} />
          <h1>BeefBoard</h1>
        </div>
      </div>
    );
}

export default Navbar