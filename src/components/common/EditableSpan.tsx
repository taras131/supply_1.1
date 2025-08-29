import React, {useState, FC, useEffect} from "react";

const baseStyle: React.CSSProperties = {
    display: "inline-block",
    width: "100%",
    minWidth: 200,
    height: 34,
    boxSizing: "border-box",
    padding: "4px 8px",
    borderRadius: 4,
    border: "1px solid transparent",
    font: "inherit",
    lineHeight: "20px",
    color: "inherit",
    verticalAlign: "middle",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
};

interface IProps  {
    value: number | string;
    onChange: (newValue: number | string) => void;
    fieldName?: string;
    label?: string;
    maxWidth?: number;
}

export const EditableSpan: FC<IProps> = ({ value, onChange, fieldName, label ="Добавить комментарий" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(String(value ?? ""));

    useEffect(() => {
        if (!isEditing) setInputValue(String(value ?? ""));
    }, [value, isEditing]);

    const handleSpanClick = () => setIsEditing(true);

    const handleBlur = () => {
        onChange(inputValue);
        setIsEditing(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            (e.target as HTMLInputElement).blur();
        } else if (e.key === "Escape") {
            setInputValue(String(value ?? ""));
            setIsEditing(false);
        }
    };

    const isEmpty = String(value ?? "").length === 0;

    return isEditing ? (
        <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            name={fieldName ?? "EditableSpan"}
            placeholder={isEmpty ? label : undefined}
            style={{
                ...baseStyle,
                borderColor: "background.paper",
                outline: "none",
                maxWidth: ``
            }}
        />
    ) : (
        <span
            onClick={handleSpanClick}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSpanClick();
                }
            }}
            role="button"
            tabIndex={0}
            style={{
                ...baseStyle,
                cursor: "pointer",
                userSelect: "none",
                borderColor: isEmpty ? "text.primary" : "transparent",
                color: isEmpty ? "#9e9e9e" : "inherit",
            }}
            title={isEmpty ? "Кликните, чтобы добавить" : "Кликните, чтобы редактировать"}
        >
      {isEmpty ? label : String(value)}
    </span>
    );
};
