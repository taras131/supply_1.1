import { useState, useCallback, useEffect } from "react";
import { ChangeEvent } from "react";
import { SelectChangeEvent } from "@mui/material";

interface IBase {
  [key: string]: any;
}

type ValidationErrors = { [key: string]: string | null };

interface UseEditorOptions<T extends IBase> {
  initialValue: T;
  validate?: (editedValue: T) => ValidationErrors;
}

export function useEditor<T extends IBase>({ initialValue, validate }: UseEditorOptions<T>) {
  const [editedValue, setEditedValue] = useState<T>({ ...initialValue });
  const [errors, setErrors] = useState<ValidationErrors>(validate ? validate(initialValue) : {});

  const validateValue = useCallback(() => {
    if (!validate) {
      return true;
    }
    const validationErrors = validate(editedValue);
    setErrors(validationErrors);
    return Object.values(validationErrors).every((error) => !error);
  }, [editedValue, validate]);

  const handleFieldChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string | unknown>) => {
      const { name, value } = e.target;
      setEditedValue((prev) => {
        const newValue = { ...prev, [name]: value };
        if (validate) {
          const newErrors = validate(newValue);
          setErrors(newErrors);
        }
        return newValue;
      });
    },
    [validate],
  );

  // Сброс изменений
  const resetValue = useCallback(() => {
    setEditedValue(initialValue);
    validateValue();
  }, [initialValue, validateValue]);

  useEffect(() => {
    if (validate) {
      setErrors(validate(editedValue));
    }
  }, [editedValue, validate, validateValue]);

  return {
    editedValue,
    errors,
    setEditedValue,
    handleFieldChange,
    resetValue,
    validateValue,
  };
}
