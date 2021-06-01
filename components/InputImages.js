import React, { useMemo, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudArrowUp } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";

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
  const { setImages, images, accept, multiple, imagesEdited } = props;
  const [files, setFiles] = useState([]);
  const { t, lang } = useTranslation("common");
  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  useEffect(() => {
    const currentImages = Array.from(images);
    currentImages.forEach((img) => {
      img.preview = img.path;
      img.added = true;
      img.remove = false;
    });
    setFiles(currentImages);
    imagesEdited(currentImages);
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
          remove: false,
        });
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
      <div
        style={{
          position: "relative",
          display: "inline-flex",
          borderRadius: 2,
          border: "1px solid #eaeaea",
          marginBottom: 8,
          marginRight: 8,
          width: 100,
          height: 100,
          padding: 4,
          boxSizing: "border-box",
        }}
        key={index}
      >
        <div
          style={{
            display: "flex",
            minWidth: 0,
            overflow: "hidden",
          }}
        >
          <img
            src={file.preview}
            style={{
              display: "block",
              width: "auto",
              height: "100%",
            }}
          />
        </div>

        <button
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            background: "rgba(0,0,0,.8)",
            color: "#fff",
            border: 0,
            borderRadius: ".325em",
            cursor: "pointer",
          }}
          onClick={(event) => {
            event.preventDefault();
            removeImage(file);
          }}
        >
          {t("remove")}
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
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: 16,
        }}
      >
        {thumbs}
      </aside>
    </section>
  );
}

export default InputImages;
