import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

const salesData = {
  facebook: {
    demographics: { ages: "25-45", genders: "F/M", interests: "tecnologia,moda,deportes" },
    bestFormats: ["image", "video", "carousel"],
    optimalTimes: ["12:00", "15:00", "19:00"],
    cta: ["Comprar ahora", "Ver oferta", "Aprovechar"]
  },
  instagram: {
    demographics: { ages: "18-35", genders: "F/M", interests: "moda,belleza,tecnologia" },
    bestFormats: ["reel", "story", "post"],
    optimalTimes: ["11:00", "14:00", "17:00"],
    cta: ["Descubrir", "Probar", "Obtener"]
  },
  tiktok: {
    demographics: { ages: "16-30", genders: "F/M", interests: "entretenimiento,tendencias" },
    bestFormats: ["video", "duet", "stitch"],
    optimalTimes: ["18:00", "20:00", "22:00"],
    cta: ["¡Quiero!", "Ver más", "Probar ya"]
  }
};

const productTemplates = {
  tecnologia: {
    hooks: ["¿Cansado de los viejos equipos?", "La tecnología que cambia todo", "Innovación que necesitas"],
    benefits: ["Rápido y eficiente", "Ahorras dinero", "Fácil de usar"],
    tone: "profesional"
  },
  moda: {
    hooks: ["¡Únete a la tendencia!", "Diseño exclusivo para ti", "Estilo que te define"],
    benefits: ["Calidad premium", "Perfecto para ti", "Tendencia 2025"],
    tone: "elegante"
  },
  electronica: {
    hooks: ["No te quedes atrás", "La mejor tecnología", "Potencia y velocidad"],
    benefits: ["Rendimiento máximo", "Garantía incluida", "Envíos rápidos"],
    tone: "dinamico"
  }
};

const generateAdCopy = (product, platform) => {
  const category = product.category?.toLowerCase() || 'tecnologia';
  const template = productTemplates[category] || productTemplates.tecnologia;
  const platformData = salesData[platform] || salesData.facebook;
  
  const hook = template.hooks[Math.floor(Math.random() * template.hooks.length)];
  const benefit = template.benefits[Math.floor(Math.random() * template.benefits.length)];
  const cta = platformData.cta[Math.floor(Math.random() * platformData.cta.length)];
  
  const adCopy = {
    platform,
    product: product.name,
    headline: hook,
    primaryText: `${product.tagline}\n\n${product.description.substring(0, 100)}...`,
    benefits: product.benefits || template.benefits,
    callToAction: cta,
    optimalTime: platformData.optimalTimes[Math.floor(Math.random() * platformData.optimalTimes.length)],
    demographics: platformData.demographics,
    format: platformData.bestFormats[0],
    price: product.price,
    timestamp: new Date().toISOString()
  };
  
  return adCopy;
};

app.get('/api/ad-architect/generate', (req, res) => {
  const { platform, name, tagline, description, benefits, price, category } = req.query;
  
  if (!platform || !name) {
    return res.status(400).json({ 
      error: 'platform and name are required',
      example: '/api/ad-architect/generate?platform=facebook&name=Producto&price=$29.99'
    });
  }
  
  const product = {
    name,
    tagline: tagline || '¡Descubre esta increíble oferta!',
    description: description || 'Producto de alta calidad con beneficios únicos',
    benefits: benefits ? benefits.split(',') : ['Calidad premium', 'Garantía incluida'],
    price: price || 'Desde $19.99',
    category: category || 'tecnologia'
  };
  
  const adCopy = generateAdCopy(product, platform);
  res.json(adCopy);
});

app.get('/api/ad-architect/platforms', (req, res) => {
  res.json({
    platforms: Object.keys(salesData),
    demographics: salesData,
    description: 'Plataformas con datos de audiencia y optimización'
  });
});

app.get('/api/ad-architect/categories', (req, res) => {
  res.json({
    categories: Object.keys(productTemplates),
    templates: productTemplates
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Ad Architect Pro corriendo en http://localhost:${PORT}`);
  console.log(`📊 Generador de anuncios con IA y datos de ventas`);
});