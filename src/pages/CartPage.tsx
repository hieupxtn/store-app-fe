/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Layout, Table, Button, message, Checkbox, Spin } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import FeaturedBrands from "../components/FeaturedBrands";
import { useNavigate } from "react-router-dom";
import { cartService } from "../services/cartService";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected?: boolean;
}

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await cartService.getCart();
        const cartWithSelection = savedCart.map((item) => ({
          ...item,
          selected: true,
        }));
        setCart(cartWithSelection);
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
        message.error("Không thể tải giỏ hàng");
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = async (id: number, quantity: number) => {
    try {
      const updatedCart = await cartService.updateCartItem(id, quantity);
      setCart(
        updatedCart.map((item) => ({
          ...item,
          selected: cart.find((c) => c.id === item.id)?.selected ?? true,
        }))
      );
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      message.error("Không thể cập nhật số lượng");
    }
  };

  const removeItem = async (id: number) => {
    try {
      const updatedCart = await cartService.removeFromCart(id);
      setCart(
        updatedCart.map((item) => ({
          ...item,
          selected: cart.find((c) => c.id === item.id)?.selected ?? true,
        }))
      );
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      message.error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }
  };

  const toggleSelectItem = (id: number) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, selected: !item.selected } : item
    );
    setCart(updatedCart);
  };

  const selectAllItems = (checked: boolean) => {
    const updatedCart = cart.map((item) => ({ ...item, selected: checked }));
    setCart(updatedCart);
  };

  const selectedItems = cart.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const columns = [
    {
      title: "Chọn",
      key: "select",
      width: "80px",
      render: (_: any, record: CartItem) => (
        <Checkbox
          checked={record.selected}
          onChange={() => toggleSelectItem(record.id)}
        />
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      width: "300px",
      render: (_: any, record: CartItem) => (
        <div className="flex items-center gap-4">
          <img
            src={record.image}
            alt={record.name}
            className="w-16 h-16 object-cover rounded-lg"
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "120px",
      render: (price: number) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      width: "150px",
      key: "quantity",
      render: (_: any, record: CartItem) => (
        <input
          type="number"
          min="1"
          max="99"
          value={record.quantity}
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= 1 && value <= 99) {
              updateQuantity(record.id, value);
            }
          }}
          className="w-16 border rounded-md text-center"
        />
      ),
    },
    {
      title: "Tổng cộng",
      key: "total",
      width: "150px",
      render: (_: any, record: CartItem) =>
        `${(record.price * record.quantity).toLocaleString()} VND`,
    },
    {
      title: "Hành động",
      key: "action",
      width: "100px",
      render: (_: any, record: CartItem) => (
        <Button danger onClick={() => removeItem(record.id)}>
          Xóa
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <Layout className="min-h-screen flex flex-col">
        <AppHeader />
        <Content className="flex-grow p-6 bg-gray-100 h-full">
          <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg min-h-[463px] flex justify-center items-center">
            <Spin size="large" />
          </div>
        </Content>
        <AppFooter />
      </Layout>
    );
  }

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100 h-full">
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg min-h-[463px]">
          <h2 className="text-2xl font-bold mb-4">Giỏ hàng</h2>

          {cart.length > 0 ? (
            <>
              <div className="mb-4">
                <Checkbox
                  onChange={(e) => selectAllItems(e.target.checked)}
                  checked={cart.every((item) => item.selected)}
                >
                  Chọn tất cả
                </Checkbox>
              </div>
              <Table
                dataSource={cart}
                columns={columns}
                rowKey="id"
                pagination={false}
              />

              <div className="flex justify-between items-center mt-6">
                <h3 className="text-xl font-semibold">
                  Tổng cộng ({selectedItems.length} sản phẩm):{" "}
                  {totalPrice.toLocaleString()} VND
                </h3>
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      message.warning("Vui lòng chọn ít nhất một sản phẩm");
                      return;
                    }
                    navigate("/payment", { state: { selectedItems } });
                  }}
                >
                  Thanh toán
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Giỏ hàng của bạn trống.</p>
          )}
        </div>
        <FeaturedBrands />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default CartPage;
