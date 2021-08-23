import React, { useState } from "react";
import {
  TabContent,
  TabPane,
  Nav,
  Row,
  Tab,
  Tabs,
  Col,
} from "react-bootstrap";
import classnames from "classnames";
import useTranslation from "next-translate/useTranslation";

const CustomTabs = (props) => {
  const [activeTab, setActiveTab] = useState(1);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const { children, titles } = props;
  const { t, lang } = useTranslation("common");

  const changeTab = (selectedKey) => {
    setActiveTab(selectedKey);
  };
  return (
    <>
      <Tabs
        variant="tabs"
        defaultActiveKey={1}
        onSelect={changeTab}
        activeKey={activeTab}
      >
        <Tab eventKey={1} title={titles[0]}>
          <Row>
            <Col sm="12">
              <h4>{`${t("tabs.list-of")} ${titles[0]}`}</h4>
              {children[0]}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey={2} title={titles[1]}>
          <Row>
            <Col sm="12">
              <h4>{`${t("tabs.list-of")} ${titles[1]}`}</h4>
              {children[1]}
            </Col>
          </Row>
        </Tab>

        <Tab eventKey={3} title={titles[2]}>
          <Row>
            <Col sm="12">
              <h4>{`${t("tabs.list-of")} ${titles[2]}`}</h4>
              {children[2]}
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </>
  );
};

export default CustomTabs;
