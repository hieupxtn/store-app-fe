import React from "react";
import { Card, Row, Col, Typography, Layout } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;

const brands = [
  {
    name: "ABS",
    logo: "/images/brands/abs.png",
    description: "Premium PC components and systems",
  },
  {
    name: "AMD",
    logo: "/images/brands/amd.png",
    description: "Advanced Micro Devices - Processors and GPUs",
  },
  {
    name: "ASUS",
    logo: "/images/brands/asus.png",
    description: "Computer hardware and electronics",
  },
  {
    name: "ASRock Rack",
    logo: "/images/brands/asrock.png",
    description: "Server and workstation solutions",
  },
  {
    name: "GIGABYTE",
    logo: "/images/brands/gigabyte.png",
    description: "Motherboards and graphics cards",
  },
  {
    name: "Intel",
    logo: "/images/brands/intel.png",
    description: "World's leading processor manufacturer",
  },
  {
    name: "MSI",
    logo: "/images/brands/msi.png",
    description: "Gaming hardware and components",
  },
  {
    name: "Meta Quest",
    logo: "/images/brands/metaquest.png",
    description: "Virtual reality headsets and accessories",
  },
];

const BrandsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName: string) => {
    navigate(`/products?brands=${encodeURIComponent(brandName)}`);
  };

  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="bg-gray-50">
        <div className="container mx-auto px-4 py-8 min-h-[751px]">
          <Typography.Title level={2} className="!text-[#0a174e] !mb-8">
            All Brands
          </Typography.Title>

          <Row gutter={[24, 24]}>
            {brands.map((brand) => (
              <Col xs={24} sm={12} md={8} lg={6} key={brand.name}>
                <Card
                  className="!rounded-xl !bg-[#fafbfc] !border-none hover:!shadow-lg transition-all cursor-pointer h-full"
                  onClick={() => handleBrandClick(brand.name)}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-16 object-contain mb-4"
                      style={{ maxWidth: "160px" }}
                    />
                    <Typography.Title
                      level={4}
                      className="!mb-2 !text-[#0a174e]"
                    >
                      {brand.name}
                    </Typography.Title>
                    <Typography.Text className="text-gray-600 text-center">
                      {brand.description}
                    </Typography.Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default BrandsPage;
