import React from 'react';
import styles from "./Sidebar.module.css";

const Sidebar = ({children}) => {
    return (
        <aside className={styles.sidebar}>
          <div className="module-filter">
            {children}
          </div>
        </aside>
    )
};

export default Sidebar
