import React, { useEffect, useRef } from "react";
import style from "./ButtonFixed.module.css";

const ButtonFixed = (props) => {
  const { onClick, children } = props;

  return (
    <div className={`${style.contenedor}`}>
      <button className={`${style.botonF1}`} onClick={onClick}>
        <span className={`${style.span}`}>
          {children}
        </span>
      </button>
      <button className={`${style.btn} ${style.botonF2}`}>
        <span className={`${style.span}`}>+</span>
      </button>
      <button className={`${style.btn} ${style.botonF3}`}>
        <span className={`${style.span}`}>+</span>
      </button>
      <button className={`${style.btn} ${style.botonF4}`}>
        <span className={`${style.span}`}>+</span>
      </button>
      <button className={`${style.btn} ${style.botonF5}`}>
        <span className={`${style.span}`}>+</span>
      </button>
    </div>
  );
};

export default ButtonFixed;
