import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Button, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { api, Brand } from "../services/api";

const FeaturedBrands: React.FC = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await api.getBrands();
        setBrands(response);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="mt-16 px-14">
      <div className="flex items-center mb-4">
        <Typography.Title level={3} className="!mb-0 !mr-4 !text-[#0a174e]">
          Featured Brands
        </Typography.Title>
        <Button
          type="link"
          className="!text-gray-500 flex items-center"
          onClick={() => navigate("/brands")}
        >
          See More <span className="ml-1">&rarr;</span>
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-[120px]">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} className="flex-nowrap overflow-x-auto pb-2">
          {brands.map((brand) => (
            <Col key={brand.id} className="min-w-[180px]">
              <Card
                className="!flex !items-center !justify-center !rounded-xl !bg-[#fafbfc] !border-none hover:!shadow-lg transition-all cursor-pointer h-[120px]"
                styles={{
                  body: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                  },
                }}
                onClick={() =>
                  navigate(`/products?brands=${encodeURIComponent(brand.name)}`)
                }
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-12 object-contain"
                  style={{ maxWidth: "120px" }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FeaturedBrands;
