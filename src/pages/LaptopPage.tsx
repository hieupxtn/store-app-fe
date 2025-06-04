import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Row,
  Col,
  Typography,
  Select,
  Checkbox,
  Slider,
  Input,
  Button,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import "../styles/LaptopPage.css";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface FilterState {
  brands: string[];
  screenSize: string | undefined;
  ram: string | undefined;
}

const LaptopPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    brands: [],
    screenSize: undefined,
    ram: undefined,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setSearchQuery(query);

    const brands = searchParams.get("brands")?.split(",") || [];
    const screenSize = searchParams.get("screenSize") || undefined;
    const ram = searchParams.get("ram") || undefined;

    setActiveFilters({
      brands,
      screenSize,
      ram,
    });
  }, [location.search]);

  const handleFilterChange = (
    type: keyof FilterState,
    value: string | string[]
  ) => {
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);

    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("q", searchQuery);
    if (newFilters.brands.length)
      searchParams.set("brands", newFilters.brands.join(","));
    if (newFilters.screenSize)
      searchParams.set("screenSize", newFilters.screenSize);
    if (newFilters.ram) searchParams.set("ram", newFilters.ram);

    navigate(`/laptops?${searchParams.toString()}`);
  };

  return (
    <Layout className="laptop-page">
      <AppHeader />
      <Content className="px-4 py-6">
        <Row gutter={[24, 24]} className="px-14">
          {/* Filters Section */}
          <Col span={6}>
            <div className="filters-section bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Title level={4}>Bộ lọc</Title>
                <Button
                  type="text"
                  icon={showFilters ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setShowFilters(!showFilters)}
                />
              </div>

              {showFilters && (
                <div className="space-y-6">
                  {/* Price Range */}
                  <div>
                    <Text strong>Khoảng giá</Text>
                    <Slider
                      range
                      min={0}
                      max={100000000}
                      value={priceRange}
                      onChange={setPriceRange}
                      className="mt-2"
                    />
                    <div className="flex justify-between mt-2">
                      <Input
                        value={priceRange[0]}
                        style={{ width: 100 }}
                        prefix="VND"
                      />
                      <Input
                        value={priceRange[1]}
                        style={{ width: 100 }}
                        prefix="VND"
                      />
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <Text strong>Thương hiệu</Text>
                    <div className="mt-2">
                      <Checkbox.Group
                        className="flex flex-col space-y-2"
                        value={activeFilters.brands}
                        onChange={(values) =>
                          handleFilterChange("brands", values)
                        }
                      >
                        <Checkbox value="asus">ASUS</Checkbox>
                        <Checkbox value="dell">Dell</Checkbox>
                        <Checkbox value="hp">HP</Checkbox>
                        <Checkbox value="lenovo">Lenovo</Checkbox>
                        <Checkbox value="acer">Acer</Checkbox>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* Screen Size */}
                  <div>
                    <Text strong>Screen Size</Text>
                    <Select
                      className="w-full mt-2"
                      placeholder="Select screen size"
                      value={activeFilters.screenSize}
                      onChange={(value) =>
                        handleFilterChange("screenSize", value)
                      }
                    >
                      <Option value="13">13 inch</Option>
                      <Option value="14">14 inch</Option>
                      <Option value="15">15 inch</Option>
                      <Option value="17">17 inch</Option>
                    </Select>
                  </div>

                  {/* RAM */}
                  <div>
                    <Text strong>RAM</Text>
                    <Select
                      className="w-full mt-2"
                      placeholder="Select RAM"
                      value={activeFilters.ram}
                      onChange={(value) => handleFilterChange("ram", value)}
                    >
                      <Option value="8">8GB</Option>
                      <Option value="16">16GB</Option>
                      <Option value="32">32GB</Option>
                      <Option value="64">64GB</Option>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </Col>

          {/* Products Section */}
          <Col span={18}>
            <div className="products-section">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <Title level={3}>
                  {searchQuery
                    ? `Search results for: "${searchQuery}"`
                    : "Laptops"}
                </Title>
                <div className="flex items-center space-x-4">
                  <Text>Sort by:</Text>
                  <Select defaultValue="featured" style={{ width: 200 }}>
                    <Option value="featured">Featured</Option>
                    <Option value="price_low">Price: Low to High</Option>
                    <Option value="price_high">Price: High to Low</Option>
                    <Option value="rating">Rating</Option>
                    <Option value="newest">Newest</Option>
                  </Select>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default LaptopPage;
