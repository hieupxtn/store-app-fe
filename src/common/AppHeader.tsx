import React, { useEffect, useState } from "react";
import { Layout, Col, Badge, Button, Avatar } from "antd";
import { Link } from "react-router-dom";
import CustomSearch from "./SearchBox";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import BaseDropdown from "./BaseDropdown";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    setCartCount(0);
  }, [cartCount]);

  return (
    <Header className="!bg-[#002d6a] flex items-center justify-center px-6 !shadow-md !sticky top-0 z-10">
      <Col className="flex items-center mx-15 !text-xl !font-bold">
        <Link
          to="/"
          className="flex items-center !font-bold !text-blue-100 hover:!text-blue-600 !transition"
        >
          <Avatar
            size={64}
            src={"/images/deskstore.png"}
            className="!shadow-sm"
          />
          DeskStore
        </Link>
      </Col>
      <Col className="flex items-center justify-center h-full">
        <BaseDropdown />
      </Col>
      <Col className="flex items-center justify-center w-[30%] h-full">
        <CustomSearch onSearch={() => console.log("first")} />
      </Col>
      <Col className="flex items-center gap-4">
        <Link to="/login" className="!text-blue-100 hover:text-blue-600">
          <Button
            type="text"
            icon={<UserOutlined className="!text-blue-100 !text-xl" />}
            className="hidden md:inline-flex !text-lg !text-blue-100"
          >
            Login
          </Button>
        </Link>
        <Link to="/cart" className="!text-blue-100 hover:text-blue-600">
          <Badge count={cartCount} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined className="!text-blue-100 text-xl" />}
              className="hidden md:inline-flex !text-lg !text-blue-100"
            >
              Cart
            </Button>
          </Badge>
        </Link>
      </Col>
    </Header>
  );
};

export default AppHeader;
