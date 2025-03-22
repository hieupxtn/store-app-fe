import { Menu } from "antd";
import type { MenuProps } from "antd";
import { FC } from "react";

interface CustomSubMenuProps {
  items: MenuProps["items"];
}

const CustomSubMenu: FC<CustomSubMenuProps> = ({ items }) => {
  return (
    <>
      {items?.map((item) => {
        if (!item || "type" in item) return null;
        return <Menu.Item key={item.key}>{item.label}</Menu.Item>;
      })}
    </>
  );
};

export default CustomSubMenu;
