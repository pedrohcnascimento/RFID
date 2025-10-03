
import React, { useState, useEffect } from 'react';
import '../styles/TableOutput.css'; 

function TableOutput() {
  const [products, setProducts] = useState([]);
  const [headers, setHeaders] = useState([]);

  const loadProducts = () => {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || [];
    setProducts(storedProducts);

    if (storedProducts.length > 0) {
      const allKeys = new Set();
      storedProducts.forEach(product => {
        Object.keys(product).forEach(key => {
          if (key !== 'id') { // Não exibir o ID como uma coluna
            allKeys.add(key);
          }
        });
      });
      setHeaders(Array.from(allKeys));
    } else {
      setHeaders([]); // Limpa os cabeçalhos se não houver produtos
    }
  };

  useEffect(() => {
    loadProducts();

    window.addEventListener('storage', loadProducts);

    return () => {
      window.removeEventListener('storage', loadProducts);
    };
  }, []);

  const handleDelete = (productId) => {
    if (window.confirm("Tem certeza que deseja deletar este item?")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      loadProducts(); 
    }
  };

  const handleEdit = (productId) => {
    const productToEdit = products.find(p => p.id === productId);
    if (!productToEdit) return;

    const updatedProduct = { ...productToEdit };
    
    headers.forEach(header => {
      const currentValue = updatedProduct[header] || '';
      const newValue = prompt(`Editar ${header}:`, currentValue);
      
      if (newValue !== null) {
        updatedProduct[header] = newValue;
      }
    });

    const updatedProducts = products.map(p => (p.id === productId ? updatedProduct : p));
    localStorage.setItem('products', JSON.stringify(updatedProducts));
    loadProducts(); 
  };
  
  if (products.length === 0) {
    return <p>Nenhum produto cadastrado ainda.</p>;
  }

  return (
    <div className="table-container">
      <h2>Produtos Cadastrados</h2>
      <table className="data-table">
        <thead>
          <tr>
            {headers.map(header => <th key={header} scope="col">{header}</th>)}
            <th scope="col">Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              {headers.map(header => <td key={`${product.id}-${header}`}>{product[header] || 'N/A'}</td>)}
              <td className="actions-cell">
                <button onClick={() => handleEdit(product.id)} className="edit-btn">
                  Editar
                </button>
                <button onClick={() => handleDelete(product.id)} className="delete-btn">
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableOutput;