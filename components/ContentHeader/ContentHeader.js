import React from 'react';
import styles from "./ContentHeader.module.css";

const ContentHeader = ({title}) => {
    return (<>
    <div className={styles.div}>
        <h1>{title}</h1>
    </div>
    </>)
}

export default ContentHeader
