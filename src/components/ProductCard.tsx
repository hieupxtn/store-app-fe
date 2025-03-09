import React from "react";
import { Card, Button } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  addToCart: (id: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, addToCart }) => {
  return (
    <Card
      hoverable
      className="w-full sm:w-64 border rounded-lg shadow-md"
      cover={
        <img
          alt={product.name}
          src={product.image}
          className="h-48 object-cover rounded-t-lg"
        />
      }
    >
      <h3 className="text-lg font-semibold">{product.name}</h3>
      <p className="text-gray-500">${product.price.toFixed(2)}</p>
      <Button
        type="primary"
        icon={<ShoppingCartOutlined />}
        className="mt-2 w-full bg-blue-500 hover:bg-blue-600"
        onClick={() => addToCart(product.id)}
      >
        Add to Cart
      </Button>
    </Card>
  );
};

export default ProductCard;
