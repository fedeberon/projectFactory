import React from "react";
import filteredImagesStyles from "./FilteredImages.module.css";

const FilteredImages = ({ images }) => {
    const imagesGrid = images.map( (image, index) => <img key={index} className={filteredImagesStyles.img} src={image.path}/> );

    return (<>
        {imagesGrid}
        </>
    )
};

export default FilteredImages;