import '../styles/AddFieldButton.css'
function AddFieldButton({ onAddField }) {
  const handleClick = () => {
    const fieldName = prompt("Insira o nome do novo campo:"); 
    if (fieldName) {
      onAddField(fieldName.trim());
    }
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      
      <button type="button" onClick={handleClick}>
        Adicionar Informação
      </button>
    </div>
  );
}

export default AddFieldButton;