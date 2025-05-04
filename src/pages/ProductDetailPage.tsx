import React from "react";
import { Layout } from "antd";
import ProductDetail from "../components/ProductDetail";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;

const ProductDetailPage: React.FC = () => {
  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content className="bg-gray-50">
        <div className="container mx-auto py-8 min-h-[751px]">
          <ProductDetail />
        </div>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProductDetailPage;
