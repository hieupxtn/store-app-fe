import React, { useState } from "react";
import { Drawer, Badge, Button, Row } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

const products = [
  {
    id: 1,
    name: "Laptop Gaming",
    price: 1200,
    image: "https://via.placeholder.com/200",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Smartphone",
    price: 800,
    image: "https://via.placeholder.com/200",
    rating: 4.0,
  },
  {
    id: 3,
    name: "Wireless Headphone",
    price: 150,
    image: "https://via.placeholder.com/200",
    rating: 3.8,
  },
  {
    id: 4,
    name: "Gaming Mouse",
    price: 50,
    image: "https://via.placeholder.com/200",
    rating: 4.2,
  },
];

const ShopPage: React.FC = () => {
  const [cart, setCart] = useState<number[]>([]);
  const [category, setCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  const addToCart = (id: number) => {
    setCart([...cart, id]);
  };

  const filteredProducts = products.filter((product) => {
    return (
      (category === "All" || product.name.includes(category)) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1] &&
      product.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <Row className="flex py-5 justify-center w-full">
      <Row className="w-2/3 min-w-2/3">
        <Row className="w-full">
          <FilterBar
            setCategory={setCategory}
            setPriceRange={setPriceRange}
            setSearch={setSearch}
          />
        </Row>
        <Row className="flex justify-around w-full">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              addToCart={addToCart}
            />
          ))}
        </Row>
      </Row>

      <div className="fixed bottom-6 right-6">
        <Badge count={cart.length} size="small">
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            shape="circle"
            size="large"
            onClick={() => setCartOpen(true)}
          />
        </Badge>
      </div>

      <Drawer
        title="Your Cart"
        placement="right"
        onClose={() => setCartOpen(false)}
        open={cartOpen}
      >
        <p>Items in cart: {cart.length}</p>
        <Button type="primary" className="mt-4 w-full">
          Checkout
        </Button>
      </Drawer>
    </Row>
  );
};

export default ShopPage;
