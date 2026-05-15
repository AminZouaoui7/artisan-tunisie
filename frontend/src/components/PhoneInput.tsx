import { useMemo, useState } from "react";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
  usePhoneInput,
} from "react-international-phone";
import "react-international-phone/style.css";
import "../styles/PhoneInput.css";

type PhoneInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

const allowedIso2 = ["tn", "fr", "dz", "ma", "it", "de", "gb", "us"];

export default function PhoneInput({
  value,
  onChange,
  placeholder = "Phone number",
  className = "",
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const countries = useMemo(
    () =>
      defaultCountries.filter((country) =>
        allowedIso2.includes(parseCountry(country).iso2)
      ),
    []
  );

  const { inputValue, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: "tn",
      value,
      countries,
      onChange: (data) => {
        onChange(data.phone);
      },
    });

  return (
    <div className={`phone-field ${className}`}>
      <button
        type="button"
        className="phone-field__country-btn"
        onClick={() => setIsOpen((current) => !current)}
      >
        <FlagImage iso2={country.iso2} size="24px" />
        <span>+{country.dialCode}</span>
        <span className="phone-field__chevron">⌄</span>
      </button>

      <input
        ref={inputRef}
        className="phone-field__input"
        value={inputValue}
        onChange={handlePhoneValueChange}
        placeholder={placeholder}
      />

      {isOpen && (
        <div className="phone-field__dropdown">
          {countries.map((item) => {
            const parsedCountry = parseCountry(item);

            return (
              <button
                key={parsedCountry.iso2}
                type="button"
                className="phone-field__country-item"
                onClick={() => {
                  setCountry(parsedCountry.iso2);
                  setIsOpen(false);
                }}
              >
                <FlagImage iso2={parsedCountry.iso2} size="22px" />
                <span>{parsedCountry.name}</span>
                <strong>+{parsedCountry.dialCode}</strong>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}