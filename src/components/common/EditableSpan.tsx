import React, { useState, useRef, useEffect, FC } from "react";

type IProps = {
  value: number;
  onChange: (newValue: number) => void;
};

export const EditableSpan: FC<IProps> = ({ value, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(String(value));
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  const handleSpanClick = () => {
    setIsEditing(true);
  };
  const handleBlur = () => {
    const parsed = Number(inputValue);
    if (!isNaN(parsed)) {
      onChange(parsed);
    } else {
      setInputValue(String(value));
    }
    setIsEditing(false);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setInputValue(String(value));
      setIsEditing(false);
    }
  };
  return isEditing ? (
    <input
      type="text"
      ref={inputRef}
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      style={{ width: "60px" }}
    />
  ) : (
    <span onClick={handleSpanClick} style={{ cursor: "pointer" }}>
      {value}
    </span>
  );
};
