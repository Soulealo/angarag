const Category = require('../models/Category');

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9а-яөөнүёүэ_\s-]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function categoryPayload(body) {
  return {
    name: body.name,
    slug: body.slug ? slugify(body.slug) : slugify(body.name),
    description: body.description || '',
    imageUrl: body.imageUrl || '',
    isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
  };
}

async function getCategories(req, res) {
  const filter = req.query.includeInactive === 'true' ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ name: 1 });
  res.json({ categories });
}

async function getCategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.json({ category });
}

async function createCategory(req, res) {
  const payload = categoryPayload(req.body);
  if (!payload.name || !payload.slug) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const category = await Category.create(payload);
    res.status(201).json({ category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Category name or slug already exists.' });
    }
    throw error;
  }
}

async function updateCategory(req, res) {
  const payload = categoryPayload(req.body);

  try {
    const category = await Category.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.json({ category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Category name or slug already exists.' });
    }
    throw error;
  }
}

async function deleteCategory(req, res) {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: 'Category not found.' });
  }
  res.json({ message: 'Category deleted.' });
}

module.exports = {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};
