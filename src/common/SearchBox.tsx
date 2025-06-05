import React, { useState, useEffect, useRef } from "react";
import { Input, List, Spin } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { api } from "../services/api";

const { Search } = Input;

interface CustomSearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

interface SearchResult {
  id: number;
  productName: string;
  price: number;
  image: string;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder = "Tìm kiếm...",
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setSearchValue(value);
    setShowDropdown(true);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (value.trim()) {
      setLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const params = new URLSearchParams();
          params.append("search", value.trim());
          const response = await api.getProducts(params);
          setSearchResults(response.products);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setLoading(false);
        }
      }, 300);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setShowDropdown(false);
    onSearch(result.productName);
  };

  return (
    <div className="relative w-full h-full" ref={dropdownRef}>
      <div className="flex items-center justify-center h-full">
        <Search
          placeholder={placeholder}
          value={searchValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onSearch={onSearch}
          enterButton={<SearchOutlined className="text-white" />}
          className="w-full md:w-96"
          size="large"
          style={{
            borderRadius: "8px",
            overflow: "hidden",
          }}
          rootClassName="border border-gray-300 focus-within:border-blue-500 rounded-lg"
        />
      </div>
      {showDropdown && (searchValue.trim() || loading) && (
        <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center p-4">
              <Spin />
            </div>
          ) : searchResults.length > 0 ? (
            <List
              dataSource={searchResults}
              renderItem={(item) => (
                <List.Item
                  className="hover:bg-gray-100 cursor-pointer p-2"
                  onClick={() => handleResultClick(item)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-red-500 font-semibold">
                        {item.price.toLocaleString("vi-VN")}đ
                      </div>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <div className="p-4 text-center text-gray-500">
              Không tìm thấy sản phẩm
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomSearch;
