import React from "react";
import { Select, Slider } from "antd";

interface FilterBarProps {
  setCategory: (value: string) => void;
  setPriceRange: (value: [number, number]) => void;
  setSearch: (value: string) => void;
}

const categories = ["All", "Laptop", "Phone", "Accessories"];

const FilterBar: React.FC<FilterBarProps> = ({
  setCategory,
  setPriceRange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Select
        className="w-full sm:w-48"
        placeholder="Select Category"
        onChange={setCategory}
      >
        {categories.map((cat) => (
          <Select.Option key={cat} value={cat}>
            {cat}
          </Select.Option>
        ))}
      </Select>

      {/* Lọc theo giá */}
      <div className="w-full sm:w-64">
        <Slider
          range
          min={0}
          max={2000}
          defaultValue={[0, 2000]}
          onChange={(value) => setPriceRange(value as [number, number])}
        />
      </div>
    </div>
  );
};

export default FilterBar;
