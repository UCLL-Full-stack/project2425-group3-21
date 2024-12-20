import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import classNames from "classnames";

interface CocktailFormProps {
  initialData?: {
    name: string;
    description: string;
    strongness: number;
    image: string;
  };
  onSubmit: (formData: any) => void;
  submitButtonText: string;
}

const CocktailForm: React.FC<CocktailFormProps> = ({ initialData, onSubmit, submitButtonText }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    strongness: initialData?.strongness || 0,
    image: initialData?.image || "/placeholder.png",
  });
  const [nameError, setNameError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);
  const [strongnessError, setStrongnessError] = useState<string | null>(null);
  const [statusMessages, setStatusMessages] = useState<{ message: string; type: string }[]>([]);
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  const clearErrors = () => {
    setNameError(null);
    setDescriptionError(null);
    setStrongnessError(null);
    setStatusMessages([]);
  };
  const validate = (): boolean => {
    let result = true;
    if (!formData.name || formData.name.trim() === "") {
      setNameError(t("addCocktail.nameRequired"));
      result = false;
    }

    if (!formData.description || formData.description.trim() === "") {
      setDescriptionError(t("addCocktail.descriptionRequired"));
      result = false;
    }
    if (formData.strongness < 0 || formData.strongness > 5) {
      setStrongnessError(t("addCocktail.strongnessRange"));
      result = false;
    }
    if (formData.strongness === null || formData.strongness === undefined || isNaN(formData.strongness)) {
      setStrongnessError(t("addCocktail.strongnessRequired"));
      result = false;
    }
    return result;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    clearErrors();
    if (!validate()) {
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <h3 className="px-0">{t("addCocktail.title")}</h3>
      {statusMessages && (
        <div className="row">
          <ul className="list-none mb-3 mx-auto">
            {statusMessages.map(({ message, type }, index) => (
              <li
                key={index}
                className={classNames({
                  "text-red-800": type === "error",
                  "text-green-800": type === "success",
                })}
              >
                {message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="nameInput" className="mb-4">
          {t("addCocktail.name")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="nameInput"
            type="text"
            value={formData.name}
            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
            className="form-input"
          />
          {nameError && <div className="error-text">{nameError}</div>}
        </div>
        <label htmlFor="descriptionInput" className="mb-4">
          {t("addCocktail.description")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <textarea
            id="descriptionInput"
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            className="form-input"
          />
          {descriptionError && <div className="error-text">{descriptionError}</div>}
        </div>
        <label htmlFor="strongnessInput" className="mb-4">
          {t("addCocktail.strongness")}
        </label>
        <div className="block mb-2 text-sm font-medium">
          <input
            id="strongnessInput"
            type="number"
            value={formData.strongness}
            onChange={(event) => setFormData({ ...formData, strongness: parseInt(event.target.value) })}
            className="form-input"
          />
          {strongnessError && <div className="error-text">{strongnessError}</div>}
        </div>
        <button className="btn-primary" type="submit">
          {submitButtonText}
        </button>
      </form>
    </>
  );
};

export default CocktailForm;