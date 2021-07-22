import React from 'react';
import styles from "./ContentHeader.module.css";

const ContentHeader = ({title}) => {
    return (<>
    <hr className={styles.hr}/>
    <h1 className={styles.title}>{title}</h1>
    </>)
}

export default ContentHeader
