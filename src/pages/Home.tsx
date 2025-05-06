import React, { useState, useEffect } from "react";
import { Avatar, Card, Carousel, Col, Layout, Row, Button } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import Title from "antd/es/typography/Title";
import ProductList from "../components/ProductList";
import FeaturedBrands from "../components/FeaturedBrands";
import NewProducts from "../components/NewProducts";
import BestSeller from "../components/BestSeller";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";
// import CustomCarousel from "../common/BaseCarousel";
// import ShopPage from "../components/ShopPage";

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.getFeaturedProducts();
        setFeaturedProducts(response);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const productTypes = [
    { name: "PC Gaming", image: "/images/pc.png", type: 1 },
    { name: "Laptops", image: "/images/laptop.png", type: 2 },
    { name: "Smartphones", image: "/images/smartphone.png", type: 3 },
    { name: "Gear", image: "/images/gear.png", type: 4 },
    { name: "Card Gaming", image: "/images/card.png", type: 5 },
  ];

  const handleProductTypeClick = (type: number) => {
    navigate(`/products?type=${type}`);
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="p-10 bg-[#bcd5fa] min-h-screen">
        <Carousel
          autoplay
          className="rounded-lg shadow-lg overflow-hidden mx-14"
        >
          {["Banner2.png", "Banner1.png"].map((banner, index) => (
            <div key={index}>
              <img
                src={`/images/${banner}`}
                alt={`Banner ${index + 1}`}
                className="w-full object-cover rounded-lg"
              />
            </div>
          ))}
        </Carousel>

        <div className="text-center mt-2">
          <Title
            level={1}
            className="!text-[#803535] font-semibold hover:!text-[#bb8570]"
          >
            Latest Technology at Your Fingertips
          </Title>
        </div>

        <Row gutter={[16, 16]} className="mt-2 flex justify-center gap-5">
          {productTypes.map((type) => (
            <Col key={type.name}>
              <Card
                className="p-5 min-w-[200px] !flex !flex-col !items-center !rounded-lg !transition-all !bg-transparent !border-none hover:!shadow-2xl hover:!border-gray-600 cursor-pointer hover:!bg-blue-200"
                onClick={() => handleProductTypeClick(type.type)}
              >
                <Row className="text-sm font-bold text-gray-800 !flex !items-center !justify-center">
                  <Avatar size={64} src={type.image} className="!shadow-sm" />
                </Row>
                <Row className="!font-bold !text-xl text-gray-800 !flex !items-center !justify-center p-3">
                  {type.name}
                </Row>
              </Card>
            </Col>
          ))}
        </Row>
        <BestSeller />
        <NewProducts />
        {/* Featured Products Section */}
        <div className="mt-10">
          <div className="flex items-center justify-center mb-8">
            <Button
              type="link"
              className="!text-gray-500 flex items-center ml-4"
              onClick={() => navigate("/products")}
            >
              <Title
                level={2}
                className="!text-[#803535] !mb-0 hover:!text-[#bb8570]"
              >
                Featured Products
              </Title>
            </Button>
          </div>
          <ProductList products={featuredProducts} loading={loading} />
        </div>
        <div className="flex items-center justify-center mb-8">
          <Button
            type="link"
            className="!text-gray-500 flex items-center ml-4"
            onClick={() => navigate("/products")}
          >
            <Title
              level={2}
              className="!text-[#803535] !mb-0 hover:!text-[#bb8570]"
            >
              See More <span>&rarr;</span>
            </Title>
          </Button>
        </div>
        <FeaturedBrands />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default HomePage;
