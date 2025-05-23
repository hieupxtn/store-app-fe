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
  Button,
} from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import ProductList from "../components/ProductList";
import "../styles/LaptopPage.css";
import AppHeader from "../common/AppHeader";
import AppFooter from "../common/AppFooter";
import { api, Brand, ProductType } from "../services/api";

const { Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

interface FilterState {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number | undefined;
}

interface Product {
  id: number;
  productCode: string;
  productName: string;
  productType: number;
  price: number;
  quantity: number;
  quantityLimit: number;
  rating: number;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  ProductType?: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
  };
  Brand?: {
    id: number;
    name: string;
    description: string;
    logo: string;
    createdAt: string;
    updatedAt: string;
  };
}

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    categories: [],
    brands: [],
    priceRange: [0, 5000],
    rating: undefined,
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<string>("featured");

  // Fetch brands and product types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, typesResponse] = await Promise.all([
          api.getBrands(),
          api.getAllProductTypes(),
        ]);
        setBrands(brandsResponse);
        setProductTypes(typesResponse.types);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSortChange = (value: string) => {
    setSortBy(value);
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    navigate(`/products?${searchParams.toString()}`);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();

      // Add search query
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      // Add price range
      if (activeFilters.priceRange[0] > 0) {
        params.append("minPrice", activeFilters.priceRange[0].toString());
      }
      if (activeFilters.priceRange[1] < 5000) {
        params.append("maxPrice", activeFilters.priceRange[1].toString());
      }

      // Add category and brand filters
      if (activeFilters.categories.length > 0) {
        activeFilters.categories.forEach((category) => {
          params.append("typeId", category);
        });
      }
      if (activeFilters.brands.length > 0) {
        activeFilters.brands.forEach((brand) => {
          params.append("brandId", brand);
        });
      }

      // Add rating filter
      if (activeFilters.rating) {
        params.append("minRating", activeFilters.rating.toString());
      }

      // Add sort parameter
      params.append("sort", sortBy);

      const response = await api.getProducts(params);
      setProducts(response.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when filters or search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeFilters]);

  // Get search parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("search") || "";
    setSearchQuery(query);

    const categories = searchParams.get("categories")?.split(",") || [];
    const brands = searchParams.get("brands")?.split(",") || [];
    const priceRange = [
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 5000,
    ] as [number, number];
    const rating = searchParams.get("minRating")
      ? Number(searchParams.get("minRating"))
      : undefined;
    const sort = searchParams.get("sort") || "featured";
    setSortBy(sort);

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
    console.log("Filter change:", type, value);
    const newFilters = { ...activeFilters, [type]: value };
    setActiveFilters(newFilters);

    // Update URL with new filters
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set("search", searchQuery);
    if (newFilters.categories.length)
      searchParams.set("categories", newFilters.categories.join(","));
    if (newFilters.brands.length)
      searchParams.set("brands", newFilters.brands.join(","));
    if (newFilters.priceRange[0] > 0)
      searchParams.set("minPrice", newFilters.priceRange[0].toString());
    if (newFilters.priceRange[1] < 5000)
      searchParams.set("maxPrice", newFilters.priceRange[1].toString());
    if (newFilters.rating)
      searchParams.set("minRating", newFilters.rating.toString());

    navigate(`/products?${searchParams.toString()}`);
  };

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
                        {productTypes.map((type) => (
                          <Checkbox key={type.id} value={type.id.toString()}>
                            {type.name}
                          </Checkbox>
                        ))}
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
                        {brands.map((brand) => (
                          <Checkbox key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </Checkbox>
                        ))}
                      </Checkbox.Group>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <Text strong>Price Range</Text>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-2">
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
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>${activeFilters.priceRange[0]}</span>
                        <span>${activeFilters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <Text strong>Rating</Text>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <Slider
                          min={0}
                          max={5}
                          step={0.5}
                          value={activeFilters.rating || 0}
                          onChange={(value) => {
                            handleFilterChange("rating", value);
                          }}
                          className="flex-1"
                        />
                        <span className="text-sm font-medium min-w-[40px] text-right">
                          {activeFilters.rating
                            ? `${activeFilters.rating}★`
                            : ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>0★</span>
                        <span>5★</span>
                      </div>
                    </div>
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
                    ({products.length} products)
                  </Text>
                </Title>
                <div className="flex items-center space-x-4">
                  <Text>Sort by:</Text>
                  <Select
                    value={sortBy}
                    onChange={handleSortChange}
                    style={{ width: 200 }}
                  >
                    <Option value="featured">Featured</Option>
                    <Option value="price_low">Price: Low to High</Option>
                    <Option value="price_high">Price: High to Low</Option>
                    <Option value="rating">Rating</Option>
                    <Option value="newest">Newest</Option>
                  </Select>
                </div>
              </div>

              {/* Product List */}
              <ProductList products={products} loading={loading} />
            </div>
          </Col>
        </Row>
      </Content>
      <AppFooter />
    </Layout>
  );
};

export default ProductsPage;
