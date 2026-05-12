const Product = require('../models/Product');

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яөөнүёүэ_\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeArray(value) {
  if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean);
  if (typeof value === 'string') return value.split(',').map(item => item.trim()).filter(Boolean);
  return [];
}

function productPayload(body) {
  return {
    name: body.name,
    slug: body.slug ? slugify(body.slug) : slugify(body.name),
    description: body.description || '',
    price: Number(body.price || 0),
    stock: Number(body.stock || 0),
    category: body.category || null,
    imageUrl: body.imageUrl || '',
    colors: normalizeArray(body.colors),
    sizes: normalizeArray(body.sizes),
    material: body.material || '',
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  };
}

async function getProducts(req, res) {
  const filter = req.query.includeInactive === 'true' ? {} : { isActive: true };
  const products = await Product.find(filter).populate('category').sort({ createdAt: -1 });
  res.json({ products });
}

async function getProduct(req, res) {
  const product = await Product.findById(req.params.id).populate('category');
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json({ product });
}

async function createProduct(req, res) {
  const payload = productPayload(req.body);

  if (!payload.name || !payload.slug || !payload.price) {
    return res.status(400).json({ message: 'Product name and price are required.' });
  }

  try {
    const product = await Product.create(payload);
    res.status(201).json({ product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product slug already exists.' });
    }
    throw error;
  }
}

async function updateProduct(req, res) {
  const payload = productPayload(req.body);

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    }).populate('category');

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.json({ product });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Product slug already exists.' });
    }
    throw error;
  }
}

async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found.' });
  }
  res.json({ message: 'Product deleted.' });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
