import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudArrowUp } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import inputStyles from "./InputImages.module.css";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};
const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function InputImages(props) {
  const { 
    images,       // Current images in the input
    accept,       // Type of images in the input
    multiple,     // False if accept only one image or true if accept more than one
    imagesEdited, // Function to set new images
    onAdd,        // Function on click to add button
    withTags      // Boolean, true to show button add tags or false to hidde the button of tags
   } = props;
  const [files, setFiles] = useState([]);
  const { t, lang } = useTranslation("common");
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => {
        if (file.remove)
          URL.revokeObjectURL(file.preview)
      });
    },
    [files]
  );

  useEffect(() => {
    if (images) {
      const currentImages = Array.from(images);
      currentImages.forEach((img) => {
        img.preview = img.path;
        img.added = true;
        img.remove = false;
        if (withTags && img.tags === undefined) {
          img.tags = [];
        }
      });
      setFiles(currentImages);
      imagesEdited(currentImages);
    }
  }, [images]);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: accept,
    onDrop: (acceptedFiles) => {
      acceptedFiles.map((file) => {
        Object.assign(file, {
          preview: URL.createObjectURL(file),
          added: false,
          remove: false
        });

        if (withTags) {
          Object.assign(file, { tags : [] });
        }
      });
      const newFiles = files.concat(acceptedFiles);
      setFiles(newFiles);
      imagesEdited(newFiles);
    },
    multiple: multiple,
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );

  const removeImage = (file) => {
    const newFiles = Array.from(files);

    if (file.added) {
      file.remove = true;
    } else {
      const index = newFiles.indexOf(file);
      if (index > -1) {
        newFiles.splice(index, 1);
        setFiles(newFiles);
      }
    }
    // revoke preview URL for old image
    if (file.preview) URL.revokeObjectURL(file.preview);

    imagesEdited(newFiles);
  };

  const thumbs = files
    .filter((file) => !file.remove)
    .map((file, index) => (
      <div key={index} className={inputStyles.container}>

        <div className={inputStyles.divImg}>
          <img src={file.preview} className={inputStyles.img}/>
        </div>
        
        <button className={inputStyles.buttonClose}
          onClick={(event) => {
            event.preventDefault();
            removeImage(file);
          }}
        >
          X
        </button>
        
        
        <button className={inputStyles.buttonAdd}
          onClick={(event) => {
            event.preventDefault();
            onAdd(file);
          }}
        >
          {withTags  && t("AddTags")  }
          {!withTags && t("AddTitle") }
        </button>
      </div>
    ));

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <CloudArrowUp size={45} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside
        className={inputStyles.aside}
      >
        {thumbs}
      </aside>
    </section>
  );
}

export default InputImages;
