import React from "react";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Search } = Input;

interface CustomSearchProps {
  placeholder?: string;
  onSearch: (value: string) => void;
}

const CustomSearch: React.FC<CustomSearchProps> = ({
  placeholder = "Search...",
  onSearch,
}) => {
  return (
    <Search
      placeholder={placeholder}
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
  );
};

export default CustomSearch;
