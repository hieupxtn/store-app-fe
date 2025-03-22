import React, { useState } from "react";
import type { MenuProps } from "antd";
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
import { Button, Dropdown, message } from "antd";

const BaseDropdown: React.FC = () => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  console.log("hoveredKey", hoveredKey);
  const items: MenuProps["items"] = [
    {
      label: "PC / Computer",
      key: "1",
      onMouseEnter: () => setHoveredKey("1"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <DesktopOutlined />,
    },
    {
      label: "Screen - Speaker",
      key: "2",
      onMouseEnter: () => setHoveredKey("2"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <FundProjectionScreenOutlined />,
    },
    {
      label: "Laptop - Handheld",
      key: "3",
      onMouseEnter: () => setHoveredKey("3"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <LaptopOutlined />,
    },
    {
      label: "Mouse - Keyboard - Headphones",
      key: "4",
      onMouseEnter: () => setHoveredKey("4"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <AudioOutlined />,
    },
    {
      label: "PC/Laptops Components",
      key: "5",
      onMouseEnter: () => setHoveredKey("5"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <ToolOutlined />,
    },
    {
      label: "RAM - SSD - HDD",
      key: "6",
      onMouseEnter: () => setHoveredKey("6"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <AppstoreOutlined />,
    },
    {
      label: "USB - Memory card",
      key: "7",
      onMouseEnter: () => setHoveredKey("7"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <UsbOutlined />,
    },
    {
      label: "Accessories",
      key: "8",
      onMouseEnter: () => setHoveredKey("8"),
      onMouseLeave: () => setHoveredKey(null),
      icon: <CustomerServiceOutlined />,
    },
  ];
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    message.info(`Clicked on menu item: ${e.key}`);
    console.log("Clicked:", e.key);
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
