import '../styles/ExcelUpload.css'
function ExcelUpload({ fields }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Apenas arquivos Excel são permitidos!"); 
      e.target.value = null;
    }
  };

  return (
    <div style={{ marginTop: "2rem", padding: "1rem", border: "1px dashed gray" }}>
      <p style={{ fontWeight: "bold", color: "red" }}>
        ⚠️ Os nomes das colunas no arquivo Excel devem corresponder exatamente aos nomes atuais dos campos do formulário: 
      </p>
      <ul>
        {fields.map(f => (
          <li key={f.name}>{f.name}</li>
        ))}
      </ul>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
    </div>
  );
}

export default ExcelUpload;