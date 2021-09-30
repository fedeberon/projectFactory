// Frameworks
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { Images, PencilSquare, ThreeDotsVertical } from "react-bootstrap-icons";
import Image from "next/image";

// Styles
import filteredImagesStyles from "../../FilteredImages/FilteredImages.module.css";
import styles from "./CustomButtonToggle.module.css";

const CustomButtonToggle = ({ id, editBuildingWork, imageSize }) => {
  return (
    <>
      <Dropdown drop="left" align="end">
        <Dropdown.Toggle
          variant="light"
          id="dropdown-autoclose-true"
          className={styles.afterLess}
        >
          <ThreeDotsVertical 
          // color={"dark"} 
          size={25} />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Header>
            {/* <Images
              className={`${filteredImagesStyles.heart}`}
              color={"white"}
              size={25}
            /> */}
            <Image
              src={`/icon-camera.svg`}
              width={17}
              height={15}
              alt=""
              // className={`${styles.svg}`}
            />{" "}
            {` ${imageSize} Photos`}
          </Dropdown.Header>
          <Dropdown.Divider />
          <Dropdown.Item
            onClick={() => {
              editBuildingWork(id);
            }}
          >
            <PencilSquare color={"red"} size={25} />
            {` Edit`}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
};

export default CustomButtonToggle;
