import React, { useEffect, useState } from "react";
import { Layout, Col, Badge, Button, Avatar, Dropdown, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import CustomSearch from "./SearchBox";
import {
  UserOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import BaseDropdown from "./BaseDropdown";
import { cartService } from "../services/cartService";
import { wishlistService } from "../services/wishlistService";
import { api } from "../services/api";

const { Header } = Layout;

interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  gender: boolean;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const AppHeader: React.FC = () => {
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [user, setUser] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounts = async () => {
      try {
        const cart = await cartService.getCart();
        const wishlist = wishlistService.getWishlist();
        setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
        setWishlistCount(wishlist.length);
      } catch (error) {
        console.error("Error updating counts:", error);
      }
    };

    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    updateCounts();

    window.addEventListener("storage", updateCounts);
    return () => window.removeEventListener("storage", updateCounts);
  }, []);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      message.success("Đăng xuất thành công");
      navigate("/");
    }
  };

  const userMenuItems = [
    {
      key: "profile",
      label: "Hồ sơ",
      icon: <UserOutlined />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "purchase-history",
      label: "Lịch sử mua hàng",
      icon: <ShoppingCartOutlined />,
      onClick: () => navigate("/purchase-history"),
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  const buildSearchUrl = (searchValue: string) => {
    const params = new URLSearchParams();
    if (searchValue.trim()) {
      params.append("search", searchValue.trim());
    }
    return `/products?${params.toString()}`;
  };

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(buildSearchUrl(value));
    }
  };

  return (
    <Header className="!bg-[#002d6a] flex items-center justify-center px-6 !shadow-md !sticky top-0 z-10">
      <Col className="flex items-center mx-15 !text-xl !font-bold">
        <Link
          to={user?.role === "admin" ? "/admin" : "/"}
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
        <CustomSearch onSearch={handleSearch} />
      </Col>
      <Col className="flex items-center gap-4">
        {user ? (
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Button
              type="text"
              className="hidden md:inline-flex !text-lg !text-blue-100"
            >
              <Avatar size="small" icon={<UserOutlined />} className="mr-2" />
              {user.firstName} {user.lastName}
            </Button>
          </Dropdown>
        ) : (
          <Link to="/login" className="!text-blue-100 hover:text-blue-600">
            <Button
              type="text"
              icon={<UserOutlined className="!text-blue-100 !text-xl" />}
              className="hidden md:inline-flex !text-lg !text-blue-100"
            >
              Đăng nhập
            </Button>
          </Link>
        )}
        <Link to="/wishlist" className="!text-blue-100 hover:text-blue-600">
          <Badge count={wishlistCount} size="small">
            <Button
              type="text"
              icon={<HeartOutlined className="!text-red-500 text-xl" />}
              className="hidden md:inline-flex !text-lg !text-blue-100"
            >
              Yêu thích
            </Button>
          </Badge>
        </Link>
        <Link to="/cart" className="!text-blue-100 hover:text-blue-600">
          <Badge count={cartCount} size="small">
            <Button
              type="text"
              icon={<ShoppingCartOutlined className="!text-blue-100 text-xl" />}
              className="hidden md:inline-flex !text-lg !text-blue-100"
            >
              Giỏ hàng
            </Button>
          </Badge>
        </Link>
      </Col>
    </Header>
  );
};

export default AppHeader;
