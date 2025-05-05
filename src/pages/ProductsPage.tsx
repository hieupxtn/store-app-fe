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
import ProductList from "../components/ProductList";
import "../styles/LaptopPage.css";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | undefined;
}

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 5000],
    rating: undefined,
  });

  // Mock data - replace with actual API call
  const products = [
    {
      id: 1,
      name: "ASUS ROG Zephyrus G14",
      price: 1499.99,
      image: "https://via.placeholder.com/300x200",
      description: "AMD Ryzen 9, 16GB RAM, 1TB SSD, RTX 3060",
      rating: 4.5,
      category: "Laptops",
      brand: "ASUS",
    },
    {
      id: 2,
      name: "iPhone 13 Pro",
      price: 999.99,
      image: "https://via.placeholder.com/300x200",
      description: "A15 Bionic, 128GB, 6.1-inch Super Retina XDR",
      rating: 4.8,
      category: "Phones",
      brand: "Apple",
    },
    {
      id: 3,
      name: "Samsung QLED TV",
      price: 1299.99,
      image: "https://via.placeholder.com/300x200",
      description: "65-inch 4K QLED Smart TV",
      rating: 4.6,
      category: "TVs",
      brand: "Samsung",
    },
    // Add more products here
  ];

  // Get search parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setSearchQuery(query);

    const categories = searchParams.get("categories")?.split(",") || [];
    const brands = searchParams.get("brands")?.split(",") || [];
    const priceRange = [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 5000,
    ] as [number, number];
    const rating = searchParams.get("rating")
      ? Number(searchParams.get("rating"))
      : undefined;

    setActiveFilters({
      categories,
      brands,
      priceRange,
      rating,
    });
  }, [location.search]);

  const handleFilterChange = (
    type: keyof FilterState,
    value: string | string[] | [number, number] | number
  ) => {
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);

    // Update URL with new filters
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("q", searchQuery);
    if (newFilters.categories.length)
      searchParams.set("categories", newFilters.categories.join(","));
    if (newFilters.brands.length)
      searchParams.set("brands", newFilters.brands.join(","));
    if (newFilters.priceRange[0] > 0)
      searchParams.set("minPrice", newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < 5000)
      searchParams.set("maxPrice", newFilters.priceRange[1].toString());
    if (newFilters.rating)
      searchParams.set("rating", newFilters.rating.toString());

    navigate(`/products?${searchParams.toString()}`);
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeFilters.categories.length === 0 ||
      activeFilters.categories.includes(product.category);

    const matchesBrand =
      activeFilters.brands.length === 0 ||
      activeFilters.brands.includes(product.brand);

    const matchesPrice =
      product.price >= activeFilters.priceRange[0] &&
      product.price <= activeFilters.priceRange[1];

    const matchesRating =
      !activeFilters.rating || product.rating >= activeFilters.rating;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesRating
    );
  });

  return (
    <Layout className="products-page">
      <AppHeader />
      <Content className="px-4 py-6">
        <Row gutter={[24, 24]} className="px-14 min-h-[703px]">
          {/* Filters Section */}
          <Col span={6}>
            <div className="filters-section bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <Title level={4}>Filters</Title>
                <Button
                  type="text"
                  icon={showFilters ? <UpOutlined /> : <DownOutlined />}
                  onClick={() => setShowFilters(!showFilters)}
                />
              </div>

              {showFilters && (
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <Text strong>Categories</Text>
                    <div className="mt-2">
                      <Checkbox.Group
                        className="flex flex-col space-y-2"
                        value={activeFilters.categories}
                        onChange={(values) =>
                          handleFilterChange("categories", values)
                        }
                      >
                        <Checkbox value="Laptops">Laptops</Checkbox>
                        <Checkbox value="Phones">Phones</Checkbox>
                        <Checkbox value="TVs">TVs</Checkbox>
                        <Checkbox value="Accessories">Accessories</Checkbox>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* Brands */}
                  <div>
                    <Text strong>Brands</Text>
                    <div className="mt-2">
                      <Checkbox.Group
                        className="flex flex-col space-y-2"
                        value={activeFilters.brands}
                        onChange={(values) =>
                          handleFilterChange("brands", values)
                        }
                      >
                        <Checkbox value="ASUS">ASUS</Checkbox>
                        <Checkbox value="Apple">Apple</Checkbox>
                        <Checkbox value="Samsung">Samsung</Checkbox>
                        <Checkbox value="Dell">Dell</Checkbox>
                        <Checkbox value="HP">HP</Checkbox>
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Text strong>Price Range</Text>
                    <Slider
                      range
                      min={0}
                      max={5000}
                      value={activeFilters.priceRange}
                      onChange={(value) =>
                        handleFilterChange(
                          "priceRange",
                          value as [number, number]
                        )
                      }
                      className="mt-2"
                    />
                    <div className="flex justify-between mt-2">
                      <Input
                        value={activeFilters.priceRange[0]}
                        style={{ width: 100 }}
                        prefix="$"
                      />
                      <Input
                        value={activeFilters.priceRange[1]}
                        style={{ width: 100 }}
                        prefix="$"
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <Text strong>Minimum Rating</Text>
                    <Select
                      className="w-full mt-2"
                      placeholder="Select minimum rating"
                      value={activeFilters.rating}
                      onChange={(value) => handleFilterChange("rating", value)}
                    >
                      <Option value={4}>4 stars & up</Option>
                      <Option value={3}>3 stars & up</Option>
                      <Option value={2}>2 stars & up</Option>
                      <Option value={1}>1 star & up</Option>
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
                    : "All Products"}
                  <Text type="secondary" className="ml-2">
                    ({filteredProducts.length} products)
                  </Text>
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

              {/* Product List */}
              <ProductList products={filteredProducts} />
            </div>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProductsPage;
