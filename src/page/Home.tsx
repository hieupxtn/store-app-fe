import React from "react";
import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import ShopPage from "../components/ShopPage";

const HomePage: React.FC = () => {
  return (
    <Layout className="flex flex-col min-h-screen w-full">
      <AppHeader />
      <Content>
        <ShopPage />
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default HomePage;
