import React from "react";
import { Avatar, Card, Carousel, Col, Layout, Row } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import Title from "antd/es/typography/Title";
// import CustomCarousel from "../common/BaseCarousel";
// import ShopPage from "../components/ShopPage";

const HomePage: React.FC = () => {
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
      <Content className="p-10 bg-gray-100 min-h-screen">
        <Carousel autoplay className="rounded-lg shadow-lg overflow-hidden">
          {["Banner1.png", "Banner2.png"].map((banner, index) => (
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
          <Title level={1} className="!text-[#8B0000] font-semibold">
            Latest Technology at Your Fingertips
          </Title>
        </div>

        <Row gutter={[16, 16]} className="mt-2 flex justify-center gap-5">
          {productTypes.map((type) => (
            <Col key={type.name}>
              <Card className="p-5 min-w-[200px] !flex !flex-col !items-center !rounded-lg !transition-all !bg-transparent !border-none hover:!shadow-2xl hover:!border-gray-600 cursor-pointer">
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

        {/* Features */}
        <Row gutter={[16, 16]} className="mt-10">
          <Col span={8}>
            <Card
              title="Top Quality Products"
              bordered={false}
              className="shadow-md"
            >
              We offer only the best technology products with guaranteed
              quality.
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="Best Prices Guaranteed"
              bordered={false}
              className="shadow-md"
            >
              Get the latest tech at unbeatable prices with amazing deals.
            </Card>
          </Col>
          <Col span={8}>
            <Card
              title="24/7 Customer Support"
              bordered={false}
              className="shadow-md"
            >
              Our support team is always available to assist you with any
              inquiries.
            </Card>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default HomePage;
