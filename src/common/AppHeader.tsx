import React, { useEffect, useState } from "react";
import { Layout, Col, Badge, Button } from "antd";
import { Link } from "react-router-dom";
import CustomSearch from "./SearchBox";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";

const { Header } = Layout;

const AppHeader: React.FC = () => {
  const [cartCount, setCartCount] = useState(2);

  useEffect(() => {
    setCartCount(2);
  }, [cartCount]);

  return (
    <Header className="!bg-[#dbedf7] text-gray-900 flex items-center justify-center px-6 shadow-md">
      <Col className="flex items-center mx-15 !text-xl !font-bold">
        <Link to="/" className="text-gray-900 hover:text-blue-600 transition">
          MyLogo
        </Link>
      </Col>
      <Col className="flex items-center justify-center w-[30%] h-full">
        <CustomSearch onSearch={() => console.log("first")} />
      </Col>
      <Col className="flex items-center gap-4">
        <Link to="/login" className="text-gray-900 hover:text-blue-600">
          <Button
            type="text"
            icon={<UserOutlined className="text-gray-900 text-xl" />}
            className="hidden md:inline-flex"
          >
            Login
          </Button>
        </Link>
        <Link to="/cart" className="text-gray-900 hover:text-blue-600">
          <Badge count={cartCount} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined className="text-gray-900 text-xl" />}
              className="hidden md:inline-flex"
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
