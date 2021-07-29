import React, { useMemo, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { CloudArrowUp } from "react-bootstrap-icons";
import useTranslation from "next-translate/useTranslation";
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
    images, // Current images in the input
    accept, // Type of images in the input
    multiple, // False if accept only one image or true if accept more than one
    imagesEdited, // Function to set new images
    onAdd, // Function on click to add button
    withTags, // Boolean, true to show button add tags or false to hidde the button of tags
  } = props;
  const spansProgress = useRef([]);
  spansProgress.current = [];
  const { t } = useTranslation("common");

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
          remove: false,
        });

        if (withTags) {
          Object.assign(file, { tags: [] });
        }
      });
      const newFiles = images.concat(acceptedFiles);
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
    const newFiles = Array.from(images);

    if (file.added) {
      file.remove = true;
    } else {
      const index = newFiles.indexOf(file);
      if (index > -1) {
        newFiles.splice(index, 1);
        imagesEdited(newFiles);
      }
    }
    // revoke preview URL for old image
    if (file.preview) URL.revokeObjectURL(file.preview);

    imagesEdited(newFiles);
    removeSpanProgress(file.preview);
  };

  const addSpanProgress = (span, file) => {
    if (span && !spansProgress.current.includes(span)) {
      span.setAttribute("name", file.preview);
      file.setProgress = (progress) => onUpdateProgressFile(progress, span);
      spansProgress.current.push(span);
    }
  };

  const onUpdateProgressFile = (progress, span) => {
    span.style.setProperty("left", progress - 100 + "%");
  };

  const removeSpanProgress = (key) => {
    const spanToRemove = spansProgress.current.filter(
      (span) => span.getAttribute("name") === key
    )[0];
    const index = spansProgress.current.indexOf(spanToRemove);
    if (index > -1) {
      spansProgress.current.splice(index, 1);
    }
    return spansProgress.current;
  };

  const thumbs = images
    .filter((file) => !file.remove)
    .map((file, index) => (
      <div key={index} className={inputStyles.container}>
        <div className={inputStyles.divImg}>
          <img src={file.preview} className={inputStyles.img} />
        </div>

        <button
          className={inputStyles.buttonClose}
          onClick={(event) => {
            event.preventDefault();
            removeImage(file);
          }}
        >
          X
        </button>

        <button
          className={inputStyles.buttonAdd}
          onClick={(event) => {
            event.preventDefault();
            onAdd(file);
          }}
        >
          {withTags && t("add-tags")}
          {!withTags && t("add-title")}
        </button>
        <div className={inputStyles.progressBar}>
          <span
            ref={(span) => addSpanProgress(span, file)}
            className={`${inputStyles.spanProgressBar} js-progress`}
          ></span>
        </div>
      </div>
    ));

  return (
    <section className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <CloudArrowUp size={45} />
        <p>{`${t(
          "drag-and-drop-some-files-here-or-click-to-select-files"
        )}`}</p>
      </div>
      <aside className={inputStyles.aside}>{thumbs}</aside>
    </section>
  );
}

export default InputImages;
