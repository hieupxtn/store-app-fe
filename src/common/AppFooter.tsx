import React from "react";
import { Layout } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  return (
    <Footer className="!bg-[#002d6a] text-center px-6 !shadow-md !text-blue-100">
      <p className="text-sm">
        © {new Date().getFullYear()} My Website. All rights reserved.
      </p>

      <div className="flex justify-center gap-4 mt-2">
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
    </Footer>
  );
};

export default AppFooter;
