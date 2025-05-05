import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Layout, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { api, Brand } from "../services/api";

const { Content } = Layout;

const BrandsPage: React.FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.getBrands();
        setBrands(response); // The response is already an array of brands
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

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

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Spin size="large" />
            </div>
          ) : (
            <Row gutter={[24, 24]}>
              {brands.map((brand) => (
                <Col xs={24} sm={12} md={8} lg={6} key={brand.id}>
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
          )}
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default BrandsPage;
