import { ChangeEvent, useEffect, useState } from "react";
import { validateEmail } from "../utils/services";

interface IValidations {
  [key: string]: string | number | boolean;
}

const useValidation = (value: string | number, validations: IValidations) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const [minLengthError, setMinLengthError] = useState(false);
  const [maxLengthError, setMaxLengthError] = useState(false);
  const [minValueError, setMinValueError] = useState(false);
  const [maxValueError, setMaxValueError] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  useEffect(() => {
    for (const validation in validations) {
      if (typeof value === "string") {
        switch (validation) {
          case "minLength":
            setMinLengthError(value.length < validations[validation]);
            break;
          case "maxLength":
            setMaxLengthError(value.length > validations[validation]);
            break;
          case "isEmpty":
            setIsEmpty(!value);
            break;
          case "isEmail":
            setIsEmailError(!validateEmail(value));
            break;
        }
      }
      if (typeof value === "number") {
        switch (validation) {
          case "minValue":
            setMinValueError(value < validations[validation]);
            break;
          case "maxValue":
            setMaxValueError(value > validations[validation]);
            break;
        }
      }
    }
  }, [value]);
  return { isEmpty, minLengthError, isEmailError, maxLengthError, minValueError, maxValueError };
};

export const useInput = (initialValue: string | number, validations: IValidations) => {
  const [value, setValue] = useState<string | number>(initialValue);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState("");
  const [isHappenedChange, setIsHappenedChange] = useState(false);
  const valid = useValidation(value, validations);
  let timeout: NodeJS.Timeout;
  const setErrorText = () => {
    setError("");
    if (isHappenedChange) {
      if (valid.isEmpty) {
        setError("поле не может быть пустым");
      } else if (valid.minLengthError) {
        setError(`поле не может быть короче ${validations.minLength} символов`);
      } else if (valid.maxLengthError) {
        setError(`поле не может быть длиннее ${validations.maxLength} символов`);
      } else if (valid.isEmailError) {
        setError("не является email");
      } else if (valid.minValueError) {
        setError(`Значение не может быть меньше ${validations.minValue}`);
      } else if (valid.maxValueError) {
        setError(`Значение не может быть больше ${validations.maxValue}`);
      }
    }
  };
  useEffect(() => {
    if (!valid.isEmpty && !valid.minLengthError && !valid.maxLengthError && !valid.isEmailError) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
    const timeout = setTimeout(setErrorText, 800);
    return () => clearTimeout(timeout);
  }, [valid]);
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isHappenedChange) {
      setIsHappenedChange(true);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    setError("");
    const { value: inputValue } = e.target;
    if (typeof initialValue === "number") {
      setValue(inputValue === "" ? "" : +inputValue);
    } else {
      setValue(inputValue);
    }
  };
  const set = (str: string | number) => {
    setValue(str);
  };
  return { value, onChange, isValid, error, set };
};
