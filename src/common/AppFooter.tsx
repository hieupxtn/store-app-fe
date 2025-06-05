import React from "react";
import { Layout } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="!bg-[#002d6a] px-6 !shadow-md !text-blue-100 bottom-0 z-10">
      <div className="flex justify-between items-start">
        <div className="text-left pl-[200px]">
          <h3 className="text-lg font-semibold mb-2">Liên hệ</h3>
          <div className="flex flex-col gap-2 text-sm">
            <p className="flex items-center gap-2">
              <PhoneOutlined /> 0328.058.287
            </p>
            <p className="flex items-center gap-2">
              <EnvironmentOutlined /> Khu đô thị Văn Phú - Hà Đông - Hà Nội
            </p>
          </div>
        </div>

        <div className="text-right pr-[200px]">
          <p className="text-sm mb-2">
            © {new Date().getFullYear()} DeskStore. All rights reserved.
          </p>
          <div className="flex justify-end gap-4">
            <a
              href="#"
              className="text-xl text-gray-400 hover:text-blue-400 transition"
            >
              <FacebookOutlined />
            </a>
            <a
              href="#"
              className="text-xl text-gray-400 hover:text-blue-400 transition"
            >
              <TwitterOutlined />
            </a>
            <a
              href="#"
              className="text-xl text-gray-400 hover:text-blue-400 transition"
            >
              <LinkedinOutlined />
            </a>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default AppFooter;
