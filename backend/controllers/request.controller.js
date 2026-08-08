import FoodRequest from '../models/FoodRequest.js';

const ALLOWED_FOOD_TYPES = [
  'Vegetarian Meals',
  'Non-Vegetarian Meals',
  'Bakery Items',
  'Fresh Produce',
  'Dairy Products',
  'Grains & Cereals',
  'Fruits',
  'Beverages',
  'Other',
];

const ALLOWED_UNITS = ['meals', 'kg', 'pieces', 'litres', 'boxes', 'packets'];

/**
 * @desc    Get the authenticated receiver's active food request (if any)
 * @route   GET /api/requests/active
 * @access  Private (RECEIVER only)
 */
export const getActiveRequest = async (req, res) => {
  try {
    const receiverId = req.user._id;
    const activeRequest = await FoodRequest.findOne({ receiverId, status: 'ACTIVE' })
      .sort({ createdAt: -1 })
      .limit(1);

    if (!activeRequest) {
      return res.status(200).json({ success: true, data: null });
    }

    res.status(200).json({ success: true, data: activeRequest });
  } catch (error) {
    console.error('[Request Controller - GetActive Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

/**
 * @desc    Update an existing food request
 * @route   PUT /api/requests/:id
 * @access  Private (RECEIVER owner only)
 */
export const updateFoodRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { foodType, quantity, unit, dietaryInformation, description } = req.body;

    const foodRequest = await FoodRequest.findById(id);
    if (!foodRequest) {
      return res.status(404).json({ success: false, message: 'Food request not found.' });
    }
    if (foodRequest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Forbidden: You cannot edit this request.' });
    }

    if (foodType) foodRequest.foodType = foodType.trim();
    if (quantity) foodRequest.quantity = Number(quantity);
    if (unit) foodRequest.unit = unit.trim().toLowerCase();
    if (dietaryInformation !== undefined) foodRequest.dietaryInformation = dietaryInformation.trim();
    if (description !== undefined) foodRequest.description = description.trim();

    await foodRequest.save();

    res.status(200).json({ success: true, message: 'Food request updated successfully', data: foodRequest });
  } catch (error) {
    console.error('[Request Controller - Update Error]:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error updating food request' });
  }
};

/**
 * @desc    Create a new Receiver food request
 * @route   POST /api/requests
 * @access  Private (RECEIVER only)
 */
export const createFoodRequest = async (req, res) => {
  try {
    const { foodType, quantity, unit, dietaryInformation, description } = req.body;

    // Frontend validation checks
    if (!foodType || !foodType.trim()) {
      return res.status(400).json({ success: false, message: 'Food type is required.' });
    }

    if (!ALLOWED_FOOD_TYPES.includes(foodType.trim())) {
      return res.status(400).json({ success: false, message: 'Please select a valid food type.' });
    }

    const numQuantity = Number(quantity);
    if (isNaN(numQuantity) || numQuantity <= 0) {
      return res.status(400).json({ success: false, message: 'Please enter a valid quantity greater than 0.' });
    }

    if (!unit || !unit.trim()) {
      return res.status(400).json({ success: false, message: 'Unit is required.' });
    }

    if (!ALLOWED_UNITS.includes(unit.trim().toLowerCase())) {
      return res.status(400).json({ success: false, message: 'Please select a valid unit.' });
    }

    // Authenticated receiver ID derived strictly from JWT
    const receiverId = req.user._id;

    const foodRequest = await FoodRequest.create({
      receiverId,
      foodType: foodType.trim(),
      quantity: numQuantity,
      unit: unit.trim().toLowerCase(),
      dietaryInformation: dietaryInformation ? dietaryInformation.trim() : '',
      description: description ? description.trim() : '',
      status: 'ACTIVE',
    });

    res.status(201).json({
      success: true,
      message: 'Food request created successfully',
      data: foodRequest,
    });
  } catch (error) {
    console.error('[Request Controller - Create Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error creating food request',
    });
  }
};

/**
 * @desc    Get a single Food Request by ID (Protected by Receiver Ownership)
 * @route   GET /api/requests/:id
 * @access  Private (RECEIVER owner only)
 */
export const getFoodRequestById = async (req, res) => {
  try {
    const { id } = req.params;
    const foodRequest = await FoodRequest.findById(id);

    if (!foodRequest) {
      return res.status(404).json({ success: false, message: 'Food request not found.' });
    }

    // Ownership check: Ensure request belongs to authenticated receiver
    if (foodRequest.receiverId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You are not authorized to view this request.',
      });
    }

    res.status(200).json({
      success: true,
      data: foodRequest,
    });
  } catch (error) {
    console.error('[Request Controller - GetById Error]:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching food request',
    });
  }
};
