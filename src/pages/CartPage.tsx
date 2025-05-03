/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Layout, Table, Button, message } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import FeaturedBrands from "../components/FeaturedBrands";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const initialCart: CartItem[] = [
  {
    id: 1,
    name: "Laptop Gaming",
    price: 1200,
    quantity: 1,
    image: "https://via.placeholder.com/80",
  },
  {
    id: 2,
    name: "Smartphone",
    price: 800,
    quantity: 2,
    image: "https://via.placeholder.com/80",
  },
  {
    id: 3,
    name: "Wireless Headphone",
    price: 150,
    quantity: 1,
    image: "https://via.placeholder.com/80",
  },
];

const CartPage: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>(initialCart);

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    message.success("Removed item from cart!");
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (_: any, record: CartItem) => (
        <input
          type="number"
          min="1"
          value={record.quantity}
          onChange={(e) => updateQuantity(record.id, Number(e.target.value))}
          className="w-16 border rounded-md text-center"
        />
      ),
    },
    {
      title: "Total",
      key: "total",
      render: (_: any, record: CartItem) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: CartItem) => (
        <Button danger onClick={() => removeItem(record.id)}>
          Remove
        </Button>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen flex flex-col">
      <AppHeader />
      <Content className="flex-grow p-6 bg-gray-100 h-full">
        <div className="max-w-4xl mx-auto bg-white p-6 shadow-md rounded-lg min-h-[463px]">
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

          {cart.length > 0 ? (
            <>
              <Table
                dataSource={cart}
                columns={columns}
                rowKey="id"
                pagination={false}
              />

              <div className="flex justify-between items-center mt-6">
                <h3 className="text-xl font-semibold">
                  Total: ${totalPrice.toFixed(2)}
                </h3>
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Checkout
                </Button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500">Your cart is empty.</p>
          )}
        </div>
        <FeaturedBrands />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default CartPage;
