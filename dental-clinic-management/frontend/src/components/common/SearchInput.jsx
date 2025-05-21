import React from "react";

const SearchInput = ({ value, onChange, onSearch, placeholder }) => (
  <div className="flex">
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="border rounded-l px-3 py-2 w-full"
    />
    <button
      onClick={onSearch}
      className="bg-blue-500 text-white px-4 rounded-r"
      type="button"
    >
      Tìm
    </button>
  </div>
);

export default SearchInput;