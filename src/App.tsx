
import { useEffect, useState } from "react";
import "./App.scss";

type Product = {
  productName: string;
  descriptionShort: string;
  photo: string;
  price: number;
};

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/produtos");

        if (!response.ok) {
          throw new Error("Não foi possível carregar os produtos.");
        }

        const data = await response.json();
        setProducts(data.products);
      } catch {
        setError(
          "Não conseguimos carregar os produtos. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main>
      <h1>Vitrine de Produtos</h1>
      <p>Projeto de teste Front-end - Econverse/fslipe17</p>

      {loading && <p>Carregando produtos...</p>}

      {error && <p role="alert">{error}</p>}

      {!loading && !error && (
        <section className="product-grid" aria-label="Lista de produtos">
          {products.map((product, index) => (
            <article
              className="product-card"
              key={`${product.productName}-${index}`}
              onClick={() => setSelectedProduct(product)}
              tabIndex={0}
              role="button"
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedProduct(product);
                }
              }}
            >
              <img
                src={product.photo}
                alt={product.productName}
              />

              <h2>{product.productName}</h2>

              <p>{product.descriptionShort}</p>

              <strong>
                {Number(product.price).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </strong>
            </article>
          ))}
        </section>
      )}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <section 
            className="modal-content" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setSelectedProduct(null)}
              aria-label="Fechar Janela"
            >
              X
            </button>

            <img 
              src={selectedProduct.photo} 
              alt={selectedProduct.productName} 
              />

            <h2 id="modal-title">{selectedProduct.productName}</h2>

            <p>{selectedProduct.descriptionShort}</p>

            <strong>{Number(selectedProduct.price).toLocaleString("pt-br", {
              style: "currency",
              currency: "BRL",
            })}
            </strong>
          </section>
        </div>
      )}

    </main>
  );
}

export default App;

