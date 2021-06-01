import React, { useState, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { CloudArrowUp } from "react-bootstrap-icons";
import { Container } from "reactstrap";

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

function Dropzone(props) {
  const { newFiles, setFile, accept, multiple, name } = props;

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
        });
      });
      multiple
        ? setFile(newFiles.concat(acceptedFiles))
        : setFile(acceptedFiles);
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

  const files = newFiles?.map((file, index) => (
    <li key={index}>
      {file.name} - {file.size} bytes
    </li>
  ));

  return (
    <Container fluid={true}>
      <div {...getRootProps({ style })}>
        <input name={name} {...getInputProps()} />
        <CloudArrowUp size={45} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </Container>
  );
}

export default Dropzone;
