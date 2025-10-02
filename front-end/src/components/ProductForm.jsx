import { useState } from "react";
import StandardFields from "./StandardFields";
import DynamicFields from "./DynamicFields";
import AddFieldButton from "./AddFieldButton";
import SubmitButton from "./SubmitButton";
import ExcelUpload from "./ExcelUpload";
import '../styles/ProductForm.css'

function ProductForm() {
  const [fields, setFields] = useState([
    { name: "Description", value: "" },
    { name: "SKU", value: "" }
  ]);

  const handleChange = (name, value) => {
    setFields(prev =>
      prev.map(f => (f.name === name ? { ...f, value } : f))
    );
  };

  const handleAddField = (fieldName) => {
    if (!fieldName) return;
    if (fields.some(f => f.name.toLowerCase() === fieldName.toLowerCase())) {
      alert("O campo já existe!");
      return;
    }
    setFields([...fields, { name: fieldName, value: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados do formulário:", fields); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <StandardFields fields={fields} onChange={handleChange} />
      <DynamicFields fields={fields} onChange={handleChange} />
      <AddFieldButton onAddField={handleAddField} />
      <SubmitButton />
      <ExcelUpload fields={fields} />
    </form>
  );
}

export default ProductForm;