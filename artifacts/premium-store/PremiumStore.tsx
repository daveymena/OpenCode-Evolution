import React, { useState, useEffect } from 'react';
import './index.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

const PremiumStore: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "COGEL - Belleza Ártica",
      price: 75900,
      image: "https://biblia-wordpress.ginee6.easypanel.host/wp-content/uploads/2026/04/cogel.jpg", // Placeholder until sync
      category: "Belleza",
      badge: "Más Vendido"
    },
    {
      id: 2,
      name: "Afilador De Cuchillos Pro",
      price: 55000,
      image: "https://biblia-wordpress.ginee6.easypanel.host/wp-content/uploads/2026/04/afilador.jpg",
      category: "Cocina",
      badge: "Nuevo"
    },
    {
      id: 3,
      name: "BLESSE Tratamiento Nutrición",
      price: 54700,
      image: "https://biblia-wordpress.ginee6.easypanel.host/wp-content/uploads/2026/04/blesse.jpg",
      category: "Cuidado Personal"
    },
    {
      id: 4,
      name: "Canguro para Mascotas Elite",
      price: 80000,
      image: "https://biblia-wordpress.ginee6.easypanel.host/wp-content/uploads/2026/04/canguro.jpg",
      category: "Accesorios"
    }
  ]);

  return (
    <div className="premium-container">
      <nav className="navbar">
        <div className="logo">ELITE STORE</div>
        <div className="nav-links">
          <a href="#tienda">Tienda</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
          <button className="cta-button" style={{ marginLeft: '2rem' }}>Carrito (0)</button>
        </div>
      </nav>

      <header className="hero-section">
        <h1 className="hero-title">
          La Excelencia <span className="accent-text">en cada detalle</span>
        </h1>
        <p className="hero-subtitle">
          Descubre una selección exclusiva de productos premium diseñados para el estilo de vida moderno.
          Directamente desde nuestra biblia de ofertas en Easypanel.
        </p>
        <div className="cta-group">
          <button className="cta-button">Explorar Colección</button>
        </div>
      </header>

      <main id="tienda">
        <section className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              {product.badge && <span className="badge">{product.badge}</span>}
              <div className="product-img-container">
                 {/* In a real app we'd use the sync image */}
                <div style={{ 
                  backgroundColor: '#111', 
                  height: '240px', 
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem',
                  color: '#444'
                }}>
                  PREVIEW: {product.name}
                </div>
              </div>
              <p className="product-category" style={{ fontSize: '0.7rem', color: '#3b82f6', textTransform: 'uppercase', marginTop: '1rem' }}>
                {product.category}
              </p>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-price">${product.price.toLocaleString('es-CO')}</p>
              <button 
                className="cta-button" 
                style={{ width: '100%', marginTop: '1.5rem', background: 'transparent', color: '#fff', border: '1px solid var(--glass-border)' }}
              >
                Ver Detalles
              </button>
            </div>
          ))}
        </section>
      </main>

      <footer style={{ padding: '4rem 5%', borderTop: '1px solid var(--glass-border)', textAlign: 'center', color: '#444' }}>
        <p>&copy; 2026 Elite Store. Conectado a Easypanel Bible.</p>
      </footer>
    </div>
  );
};

export default PremiumStore;
