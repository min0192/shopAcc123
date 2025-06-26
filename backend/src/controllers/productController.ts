import { Request, Response } from 'express';
import Product from '../models/ProductModel';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const query: any = {};
    
    if (category) {
      query.category = category;
    }
    
    const products = await Product.find(query).populate('category');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private
export const createProduct = async (req: Request, res: Response) => {
  try {
    // Log request data for debugging
    console.log('Creating product with data:', {
      body: req.body,
      user: req.user ? 'present' : 'missing'
    });

    // Kiểm tra trùng code
    if (req.body.code) {
      const existingProduct = await Product.findOne({ code: req.body.code });
      if (existingProduct) {
        return res.status(422).json({ error: 'Code already in use!' });
      }
    }

    // Validate required fields
    const requiredFields = ['code', 'account', 'password', 'price', 'security_information', 'image', 'category'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        fields: missingFields
      });
    }

    // Validate numeric fields
    if (isNaN(Number(req.body.price)) || Number(req.body.price) <= 0) {
      return res.status(400).json({ error: 'Price must be a positive number' });
    }


    const product = new Product({
      ...req.body,
      price: Number(req.body.price),
      status: 'available',
      seller: req.user?.id
    });
    
    const createdProduct = await product.save();
    console.log('Product created successfully:', createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    // Log detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    res.status(500).json({ 
      message: 'Failed to create product',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    // Nếu muốn kiểm tra trùng code, bỏ comment dưới đây:
    if (req.body.code) {
      const existingProduct = await Product.findOne({ code: req.body.code, _id: { $ne: id } });
      if (existingProduct) {
        return res.status(422).json({ error: 'Code already in use!' });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found!' });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}; 