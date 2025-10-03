import { useEffect, useState } from "react";
import { getMessage } from "./services/api";
import ProductForm from "./components/ProductForm"
import TableOutput from "./components/TableOutput";
import "./styles/App.css"

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    getMessage().then(data => setMessage(data.message)).catch(console.error);
  }, []);

  return (
    <div>
      <ProductForm />
      <hr />
      <TableOutput />
    </div>
  );
}

export default App;
