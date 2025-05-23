import React from "react";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import {
  MenuOutlined,
  MobileOutlined,
  LaptopOutlined,
  FundProjectionScreenOutlined,
  ToolOutlined,
  TabletOutlined,
  ClockCircleOutlined,
  AppstoreOutlined,
  CameraOutlined,
  UsbOutlined,
  DatabaseOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";

const productTypes = [
  { id: 1, name: "Phone", icon: <MobileOutlined /> },
  { id: 2, name: "Laptop", icon: <LaptopOutlined /> },
  { id: 3, name: "Screen-Speaker", icon: <FundProjectionScreenOutlined /> },
  { id: 4, name: "Gear", icon: <ToolOutlined /> },
  { id: 5, name: "Tablet", icon: <TabletOutlined /> },
  { id: 6, name: "Smartwatch", icon: <ClockCircleOutlined /> },
  { id: 7, name: "Computer-Components", icon: <AppstoreOutlined /> },
  { id: 8, name: "Camera", icon: <CameraOutlined /> },
  { id: 9, name: "Memory", icon: <UsbOutlined /> },
  { id: 10, name: "Out-Memory", icon: <DatabaseOutlined /> },
  { id: 11, name: "Accessories", icon: <CustomerServiceOutlined /> },
];

const BaseDropdown: React.FC = () => {
  const navigate = useNavigate();

  const items: MenuProps["items"] = productTypes.map((type) => ({
    label: type.name,
    key: type.id.toString(),
    icon: type.icon,
  }));

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/products?categories=${e.key}`);
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <>
      <Dropdown menu={menuProps} className="mx-5">
        <Button type="primary" size="large" className="!font-bold">
          <MenuOutlined />
          Product Catalog
        </Button>
      </Dropdown>
    </>
  );
};

export default BaseDropdown;
