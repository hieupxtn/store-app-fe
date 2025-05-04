import React, { useState, useEffect } from "react";
import { Avatar, Card, Carousel, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import Title from "antd/es/typography/Title";
import ProductList from "../components/ProductList";
import FeaturedBrands from "../components/FeaturedBrands";
import NewProducts from "../components/NewProducts";
import BestSeller from "../components/BestSeller";
import { api } from "../services/api";
// import CustomCarousel from "../common/BaseCarousel";
// import ShopPage from "../components/ShopPage";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.getFeaturedProducts();
        setFeaturedProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch featured products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const productTypes = [
    { name: "PC Gaming", image: "/images/pc.png" },
    { name: "Laptops", image: "/images/laptop.png" },
    { name: "Smartphones", image: "/images/smartphone.png" },
    { name: "Gear", image: "/images/gear.png" },
    { name: "Card Gaming", image: "/images/card.png" },
  ];

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="p-10 bg-[#bcd5fa] min-h-screen">
        <Carousel autoplay className="rounded-lg shadow-lg overflow-hidden">
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
              <Card className="p-5 min-w-[200px] !flex !flex-col !items-center !rounded-lg !transition-all !bg-transparent !border-none hover:!shadow-2xl hover:!border-gray-600 cursor-pointer hover:!bg-blue-200">
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
        {/* Featured Products Section */}
        <div className="mt-10">
          <Title level={2} className="text-center mb-8 !text-[#803535]">
            Featured Products
          </Title>
          <ProductList products={featuredProducts} loading={loading} />
        </div>
        <BestSeller />
        <NewProducts />
        <FeaturedBrands />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default HomePage;
