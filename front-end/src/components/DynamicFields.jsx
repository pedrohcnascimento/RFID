import '../styles/DynamicFields.css'
function DynamicFields({ fields, onChange }) {
  const dynamic = fields.filter(f => f.name !== "Description" && f.name !== "SKU");

  return (
    <div>
      {dynamic.map(field => (
        <div key={field.name} style={{ marginBottom: "1rem" }}>
          <label>
            {field.name}: 
            <input
              type="text"
              value={field.value}
              onChange={(e) => onChange(field.name, e.target.value)}
              style={{ marginLeft: "0.5rem", width: "100%" }}
            />
          </label>
        </div>
      ))}
    </div>
  );
}

export default DynamicFields;