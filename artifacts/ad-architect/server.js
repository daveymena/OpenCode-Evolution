import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const adTemplates = {
  facebook: (product) => `
    🎯 **${product.name}** - ${product.tagline}
    
    ${product.description.substring(0, 150)}...
    
    ✅ ${product.benefits.join(' | ')}
    💰 Oferta especial: ${product.price}
    
    📲 ¡Compra ya! Limited time offer
  `,
  
  instagram: (product) => `
    ${product.name.toUpperCase()}
    ${product.tagline}
    
    Swipe para ver más →
    ${product.benefits[0]}
    ${product.benefits[1]}
    
    #Oferta #${product.category.replace(/\s+/g, '')}
  `,
  
  tiktok: (product) => `
    🚀 ${product.name}
    ${product.tagline}
    
    ¡Tienes que ver!
    ${product.benefits[0]}
    ${product.benefits[1]}
    
    #Trending #${product.category.replace(/\s+/g, '')}
  `
};

const generateAd = (platform, product) => {
  const template = adTemplates[platform];
  if (!template) return null;
  return template(product);
};

app.get('/api/ad/generate', (req, res) => {
  const { platform, name, tagline, description, benefits, price, category } = req.query;
  
  if (!platform || !name) {
    return res.status(400).json({ error: 'platform and name are required' });
  }
  
  const product = {
    name,
    tagline: tagline || '¡Descubre esta increíble oferta!',
    description: description || 'Producto excelente con beneficios únicos.',
    benefits: benefits ? benefits.split(',') : ['Calidad premium', 'Garantía incluida'],
    price: price || 'Desde $19.99',
    category: category || 'General'
  };
  
  const adContent = generateAd(platform, product);
  
  res.json({
    platform,
    product: name,
    content: adContent,
    timestamp: new Date().toISOString()
  });
});

app.get('/api/ad/platforms', (req, res) => {
  res.json({
    platforms: ['facebook', 'instagram', 'tiktok'],
    description: 'Plataformas soportadas para generación de anuncios'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ad Architect corriendo en http://localhost:${PORT}`);
  console.log(`📢 Generador de anuncios automático listo`);
});