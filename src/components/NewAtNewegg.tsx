import React from "react";
import { Row, Col, Typography, Button, Tag, Rate } from "antd";

const products = [
  {
    id: 1,
    name: "MSI - 18'' GeForce RTX 5090 Laptop GPU - Intel Core Ultra 9 285HX",
    image: "/images/new/msi-laptop.png",
    price: 4899.99,
    oldPrice: 5389.99,
    badge: "AI Ready",
    discount: "Save 9%",
    play: true,
    rating: 4,
    reviews: 2,
  },
  {
    id: 2,
    name: "MSI Gaming GeForce RTX 5060 Ti Graphics Card RTX 5060 Ti 16G...",
    image: "/images/new/msi-rtx5060.png",
    price: 539.99,
    play: true,
    rating: 4,
    reviews: 2,
  },
  {
    id: 3,
    name: "ASUS ROG G700TF (2025) Gaming Desktop PC, Intel Core Ultra 7...",
    image: "/images/new/asus-pc.png",
    price: 1389.99,
    oldPrice: 1399.99,
    rating: 2,
    reviews: 2,
  },
  {
    id: 4,
    name: "MSI Prestige 16'' Intel Ultra 9 288V Laptop 32GB Memory 2 TB NVM...",
    image: "/images/new/msi-prestige.png",
    price: 1849.99,
    badge: "Copilot+ PC",
    rating: 2,
    reviews: 2,
  },
  {
    id: 5,
    name: "CORSAIR VOID WIRELESS v2 Gaming Headset, White",
    image: "/images/new/corsair-headset.png",
    price: 119.99,
    rating: 2,
    reviews: 2,
  },
  {
    id: 6,
    name: "Rosewill NVMe SSD Cloner, M.2 Duplicator Dual Bay NVMe...",
    image: "/images/new/rosewill-ssd.png",
    price: 59.99,
    play: true,
    rating: 5,
    reviews: 2,
  },
];

const NewProducts: React.FC = () => {
  return (
    <div className="w-full mt-10">
      <div className="flex items-center mb-4 px-4">
        <Typography.Title level={2} className="!mb-0 !mr-4 !text-[#0a174e]">
          New Products
        </Typography.Title>
        <Button type="link" className="!text-gray-500 flex items-center">
          See More <span className="ml-1">&rarr;</span>
        </Button>
      </div>
      <div className="w-full overflow-x-auto">
        <Row
          gutter={[32, 16]}
          className="flex-nowrap w-max min-w-full px-4 py-5"
          style={{ margin: 0 }}
        >
          {products.map((p) => (
            <Col key={p.id} className="min-w-[220px] max-w-[260px]">
              <div className="flex flex-col items-start">
                <div
                  style={{ minHeight: 32 }}
                  className="w-full flex items-center"
                >
                  {p.badge ? (
                    <Tag
                      color="#2563eb"
                      className="mb-2 text-xs font-semibold px-2 py-1 rounded"
                    >
                      {p.badge}
                    </Tag>
                  ) : (
                    <div className="mb-2" style={{ height: 24 }}></div>
                  )}
                </div>
                <div className="relative w-full flex justify-center">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="rounded-lg object-contain w-full h-[150px] bg-white"
                  />
                  {p.play && (
                    <span className="absolute bottom-2 right-2 bg-white rounded-full shadow p-1 cursor-pointer">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle cx="12" cy="12" r="12" fill="#2563eb" />
                        <polygon points="10,8 16,12 10,16" fill="#fff" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="mt-2 font-semibold text-base line-clamp-2 min-h-[20px]">
                  {p.name}
                </div>
                {p.rating && (
                  <div className="flex items-center gap-1 text-xs mt-1">
                    <Rate
                      disabled
                      defaultValue={p.rating}
                      count={5}
                      style={{ fontSize: 12 }}
                    />
                    <span>({p.reviews})</span>
                  </div>
                )}
                {p.discount && (
                  <Tag color="#e53e3e" className="mt-1">
                    {p.discount}
                  </Tag>
                )}
                <div className="flex items-end gap-2 mt-1">
                  <span className="text-2xl font-bold text-[#222]">
                    ${p.price.toLocaleString()}
                  </span>
                  {p.oldPrice && (
                    <span className="text-sm line-through text-gray-400">
                      ${p.oldPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default NewProducts;
