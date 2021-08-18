import Link from "next/link";
import styles from "./AnchorButton.module.css";

const AnchorButton = (props) => {
  const { title, href } = props;
  return (
    <Link href={href}>
      <a
        className={`${styles.ancor} m-0 text-muted border-0 p-0 bg-transparent`}
      >
        {title}
      </a>
    </Link>
  );
};

export default AnchorButton;
