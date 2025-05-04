import React from "react";
import { Card, Row, Col, Typography, Button } from "antd";

const brands = [
  { name: "ABS", logo: "/images/brands/abs.png" },
  { name: "AMD", logo: "/images/brands/amd.png" },
  { name: "ASUS", logo: "/images/brands/asus.png" },
  { name: "ASRock Rack", logo: "/images/brands/asrock.png" },
  { name: "GIGABYTE", logo: "/images/brands/gigabyte.png" },
  { name: "intel", logo: "/images/brands/intel.png" },
  { name: "msi", logo: "/images/brands/msi.png" },
  { name: "Meta Quest", logo: "/images/brands/metaquest.png" },
];

const FeaturedBrands: React.FC = () => {
  return (
    <div className="mt-16 px-14">
      <div className="flex items-center mb-4">
        <Typography.Title level={3} className="!mb-0 !mr-4 !text-[#0a174e]">
          Featured Brands
        </Typography.Title>
        <Button type="link" className="!text-gray-500 flex items-center">
          See More <span className="ml-1">&rarr;</span>
        </Button>
      </div>
      <Row gutter={[16, 16]} className="flex-nowrap overflow-x-auto pb-2">
        {brands.map((brand) => (
          <Col key={brand.name} className="min-w-[180px]">
            <Card
              className="!flex !items-center !justify-center !rounded-xl !bg-[#fafbfc] !border-none hover:!shadow-lg transition-all cursor-pointer h-[120px]"
              bodyStyle={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
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
    </div>
  );
};

export default FeaturedBrands;
