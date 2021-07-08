import React from "react";
import styles from "./Company.module.css";
import Link from "next/link";

const Company = (props) => {
    const { company } = props;

    return <div>
        <img className={styles.img} src={company.previewImage}/>
        <span>
            <Link href={`/companies/${company.id}`}>
                <a>{company.name}</a>
            </Link>
        </span>
    </div>
};

export default Company;