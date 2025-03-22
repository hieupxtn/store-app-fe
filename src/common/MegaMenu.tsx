import { useState } from "react";
import {
  LaptopOutlined,
  PhoneOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const menuItems = [
  {
    label: "Laptops",
    icon: <LaptopOutlined />,
    subcategories: [
      {
        name: "Gaming Laptops",
        products: ["ASUS ROG", "Acer Predator", "MSI Stealth"],
      },
      {
        name: "Ultrabooks",
        products: ["MacBook Air", "Dell XPS", "HP Spectre"],
      },
    ],
  },
  {
    label: "Phones",
    icon: <PhoneOutlined />,
    subcategories: [
      {
        name: "Smartphones",
        products: ["iPhone 15", "Samsung S24", "Google Pixel"],
      },
      {
        name: "Accessories",
        products: ["Phone Cases", "Wireless Chargers", "Screen Protectors"],
      },
    ],
  },
  {
    label: "Cameras",
    icon: <CameraOutlined />,
    subcategories: [
      { name: "DSLR", products: ["Canon EOS", "Nikon D850", "Sony Alpha"] },
      {
        name: "Mirrorless",
        products: ["Sony A7III", "Fujifilm X-T4", "Canon R6"],
      },
    ],
  },
  {
    label: "TVs",
    subcategories: [
      {
        name: "Smart TVs",
        products: ["Samsung QLED", "LG OLED", "Sony Bravia"],
      },
      {
        name: "Streaming Devices",
        products: ["Apple TV", "Roku", "Amazon Fire Stick"],
      },
    ],
  },
];

export default function MegaMenu() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="sticky top-0 bg-white shadow-md z-50">
      <nav className="flex gap-6 px-8 py-3 border-b">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600">
              {item.icon} {item.label}
            </button>

            {item.subcategories.length > 0 && hoveredIndex === index && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute left-0 mt-2 w-64 bg-white border shadow-lg rounded-md p-4 grid grid-cols-2 gap-4"
              >
                {item.subcategories.map((sub, subIndex) => (
                  <div key={subIndex}>
                    <h3 className="font-semibold text-gray-700">{sub.name}</h3>
                    <ul className="mt-2 space-y-1">
                      {sub.products.map((product, prodIndex) => (
                        <li
                          key={prodIndex}
                          className="text-sm text-gray-600 hover:text-blue-500 cursor-pointer"
                        >
                          {product}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
