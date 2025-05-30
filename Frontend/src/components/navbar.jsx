import React from 'react';
import styles from './navbar.module.css';

const Navbar = () => {
  return (
    <div className={styles.mainheader}>
      <div className={styles.clglogo}>
        <img src="/images/iips_logo.png" alt="IIPS Logo" />
      </div>
      <div className={styles.clgdescription}>
        <h2>
          Takshashila Campus<br />
          Khandwa Road <br />
          Indore (M.P)<br />
          452001
        </h2>
      </div>
    </div>
  );
};

export default Navbar;