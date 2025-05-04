import React, { useState } from "react";
import { Typography, Button, Tag, Rate } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import styles from "./NewProductsCarousel.module.css";

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
  {
    id: 7,
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
    id: 8,
    name: "MSI Gaming GeForce RTX 5060 Ti Graphics Card RTX 5060 Ti 16G...",
    image: "/images/new/msi-rtx5060.png",
    price: 539.99,
    play: true,
    rating: 4,
    reviews: 2,
  },
  {
    id: 9,
    name: "ASUS ROG G700TF (2025) Gaming Desktop PC, Intel Core Ultra 7...",
    image: "/images/new/asus-pc.png",
    price: 1389.99,
    oldPrice: 1399.99,
    rating: 2,
    reviews: 2,
  },
  {
    id: 10,
    name: "MSI Prestige 16'' Intel Ultra 9 288V Laptop 32GB Memory 2 TB NVM...",
    image: "/images/new/msi-prestige.png",
    price: 1849.99,
    badge: "Copilot+ PC",
    rating: 2,
    reviews: 2,
  },
  {
    id: 11,
    name: "CORSAIR VOID WIRELESS v2 Gaming Headset, White",
    image: "/images/new/corsair-headset.png",
    price: 119.99,
    rating: 2,
    reviews: 2,
  },
  {
    id: 12,
    name: "Rosewill NVMe SSD Cloner, M.2 Duplicator Dual Bay NVMe...",
    image: "/images/new/rosewill-ssd.png",
    price: 59.99,
    play: true,
    rating: 5,
    reviews: 2,
  },
];

const PRODUCTS_PER_PAGE = 6;

const NewProducts: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const canPrev = startIndex > 0;
  const canNext = startIndex + PRODUCTS_PER_PAGE < products.length;

  const handlePrev = () => {
    if (canPrev) setStartIndex(startIndex - 1);
  };
  const handleNext = () => {
    if (canNext) setStartIndex(startIndex + 1);
  };

  const visibleProducts = products.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

  return (
    <div className="w-full mt-10">
      <div className="flex items-center mb-4 px-14">
        <Typography.Title
          level={2}
          className="!mb-0 !mr-2 !text-[#0a174e] font-bold"
        >
          New Products
        </Typography.Title>
        <Button type="link" className="!text-gray-500 flex items-center">
          See More <span>&rarr;</span>
        </Button>
      </div>
      <div className="w-full px-14 relative">
        {canPrev && (
          <button
            className={`${styles["slick-arrow"]} ${styles["slick-prev"]}`}
            onClick={handlePrev}
            disabled={!canPrev}
            style={{
              position: "absolute",
              left: 2,
              top: "40%",
              transform: "translateY(-50%)",
              opacity: canPrev ? 1 : 0.3,
              pointerEvents: canPrev ? "auto" : "none",
            }}
          >
            <LeftOutlined className="text-2xl text-[#0a174e]" />
          </button>
        )}
        <div className="flex justify-between items-stretch">
          {visibleProducts.map((p) => (
            <div key={p.id} className="px-2 flex-1 min-w-0 max-w-[260px]">
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
            </div>
          ))}
        </div>
        {canNext && (
          <button
            className={`${styles["slick-arrow"]} ${styles["slick-next"]}`}
            onClick={handleNext}
            disabled={!canNext}
            style={{
              position: "absolute",
              right: 2,
              top: "40%",
              transform: "translateY(-50%)",
              opacity: canNext ? 1 : 0.3,
              pointerEvents: canNext ? "auto" : "none",
            }}
          >
            <RightOutlined className="text-2xl text-[#0a174e]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default NewProducts;
