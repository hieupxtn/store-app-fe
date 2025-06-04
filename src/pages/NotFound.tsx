import React from "react";
import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#bcd5fa]">
      <Result
        status="404"
        title="404"
        subTitle="Trang bạn đang tìm kiếm không tồn tại."
        extra={
          <Button
            type="primary"
            icon={<HomeOutlined />}
            onClick={() => navigate("/")}
            className="!bg-[#803535] hover:!bg-[#bb8570] !border-none"
            size="large"
          >
            Trở lại trang chủ
          </Button>
        }
        className="bg-white p-8 rounded-lg shadow-lg"
      />
    </div>
  );
};

export default NotFound;
