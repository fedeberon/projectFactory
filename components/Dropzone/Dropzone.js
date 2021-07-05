import React, { useEffect, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { CloudArrowUp, X, FileEarmarkZipFill } from "react-bootstrap-icons";
import { Container } from "reactstrap";
import dropzoneStyle from "./Dropzone.module.css";
import { Card, Button, CardBody, Row, Col } from "reactstrap";
import useTranslation from "next-translate/useTranslation";

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
  const { newFiles, setFile, accept, multiple, name, height } = props;
  const [flagShow, setFlagShow] = useState(true);

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
        });
      });
      multiple
        ? setFile(newFiles.concat(acceptedFiles))
        : setFile(acceptedFiles);
      toggle();
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

  const toggle = () => setFlagShow(!flagShow);

  const removeImage = (file) => {
    const files = Array.from(newFiles);

    if (file.added) {
      file.remove = true;
    } else {
      const index = files.indexOf(file);
      if (index > -1) {
        files.splice(index, 1);
        setFile(files);
      }
    }
    // revoke preview URL for old image
    if (file.preview) URL.revokeObjectURL(file.preview);

    setFile(files);
    toggle();
  };

  useEffect(() => {
    if (newFiles.length > 0) {
      toggle();
    }
  }, [newFiles]);

  const thumbs = newFiles
    .filter((file) => !file.remove)
    .map((file, index) => (
      <Card key={index}>
        <CardBody>
          <Row className="row-cols-1 text-end g-2">
            <Col className="text-align-end">
              <Button
                color={"danger"}
                className="p-0"
                onClick={(event) => {
                  event.preventDefault();
                  removeImage(file);
                }}
              >
                <X size={25} />
              </Button>
            </Col>
            <Col></Col>
            <Col>
              {accept === "application/x-zip-compressed, application/zip" ? (
                <Row className="row-cols-1 text-center">
                  <Col>
                    <FileEarmarkZipFill size={35} />
                  </Col>
                  <Col>
                    <h5>
                      {file.name} - {file.size} bytes
                    </h5>
                  </Col>
                </Row>
              ) : (
                <figure className={"figure m-0"}>
                  <img
                    src={file.preview}
                    className={`img-fluid ${dropzoneStyle.imgMid}`}
                    style={{ height: height }}
                  />
                </figure>
              )}
            </Col>
          </Row>
        </CardBody>
      </Card>
    ));

  return (
    <Container fluid={true}>
      <Row>
        <Col>
          {flagShow ? (
            <div {...getRootProps({ style })}>
              <input name={name} {...getInputProps()} />
              <CloudArrowUp size={45} />
              <p>{`${t(
                "drag-and-drop-some-files-here-or-click-to-select-files"
              )}`}</p>
            </div>
          ) : (
            <aside>{thumbs}</aside>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default Dropzone;
