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
        // Initialize all items as selected by default
        const cartWithSelection = savedCart.map((item) => ({
          ...item,
          selected: true,
        }));
        setCart(cartWithSelection);
      } catch (error) {
        console.error("Error loading cart:", error);
        message.error("Failed to load cart");
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
      // Trigger storage event to update cart count in header
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error updating quantity:", error);
      message.error("Failed to update quantity");
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
      message.success("Item removed from cart");
      // Trigger storage event to update cart count in header
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error removing item:", error);
      message.error("Failed to remove item from cart");
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
      title: "Select",
      key: "select",
      render: (_: any, record: CartItem) => (
        <Checkbox
          checked={record.selected}
          onChange={() => toggleSelectItem(record.id)}
        />
      ),
    },
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
          <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

          {cart.length > 0 ? (
            <>
              <div className="mb-4">
                <Checkbox
                  onChange={(e) => selectAllItems(e.target.checked)}
                  checked={cart.every((item) => item.selected)}
                >
                  Select All Items
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
                  Total ({selectedItems.length} items): ${totalPrice.toFixed(2)}
                </h3>
                <Button
                  type="primary"
                  size="large"
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    if (selectedItems.length === 0) {
                      message.warning(
                        "Please select at least one item to checkout"
                      );
                      return;
                    }
                    navigate("/payment", { state: { selectedItems } });
                  }}
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
