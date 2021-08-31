import React, { useEffect, useRef } from "react";
import useSize from "../../hooks/window/useSize";
import styles from "./BackgroundDefault.module.css";

const BackgroundDefault = (props) => {
  const { className, image } = props;

  const { width, height } = useSize();
  const cotainerDiv = useRef();
  const backgroundDefault = useRef();

  // useEffect(() => {
  //   if (cotainerDiv) {
  //     let width =
  //       parseInt(
  //         window
  //           .getComputedStyle(cotainerDiv.current, null)
  //           .getPropertyValue("width")
  //           .split("px")[0]
  //       );
  //     backgroundDefault.current.style.height = width + "px";
  //   }
  // }, [width]);

  return (
    <div className={`${styles.containerDiv}`} ref={cotainerDiv}>
      <div
        className={
          className
            ? `${className} ${styles.containerDivCircle}`
            : image != false
            ? `${styles.backgroundDefault}`
            : `${styles.backgroundNone}`
        }
        ref={backgroundDefault}
      ></div>
    </div>
  );
};

export default BackgroundDefault;
