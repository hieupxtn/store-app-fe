import React from "react";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LaptopOutlined,
  DesktopOutlined,
  AudioOutlined,
  UsbOutlined,
  CustomerServiceOutlined,
  ToolOutlined,
  FundProjectionScreenOutlined,
  AppstoreOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Button, Dropdown } from "antd";

const BaseDropdown: React.FC = () => {
  const navigate = useNavigate();
  const items: MenuProps["items"] = [
    {
      label: "PC / Computer",
      key: "1",
      icon: <DesktopOutlined />,
    },
    {
      label: "Screen - Speaker",
      key: "2",
      icon: <FundProjectionScreenOutlined />,
    },
    {
      label: "Laptop - Handheld",
      key: "3",
      icon: <LaptopOutlined />,
    },
    {
      label: "Mouse - Keyboard - Headphones",
      key: "4",
      icon: <AudioOutlined />,
    },
    {
      label: "PC/Laptops Components",
      key: "5",
      icon: <ToolOutlined />,
    },
    {
      label: "RAM - SSD - HDD",
      key: "6",
      icon: <AppstoreOutlined />,
    },
    {
      label: "USB - Memory card",
      key: "7",
      icon: <UsbOutlined />,
    },
    {
      label: "Accessories",
      key: "8",
      icon: <CustomerServiceOutlined />,
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(`/products?category=${e.key}`);
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
