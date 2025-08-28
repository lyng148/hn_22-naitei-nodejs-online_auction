import { useState, useCallback } from 'react';
import { auctionService } from '@/services/auction.service.js';
import { productService } from '@/services/product.service.js';
import { useNotification } from '@/contexts/NotificationContext.jsx';
import { useNavigate } from 'react-router-dom';

export const useCreateAuction = () => {
    const navigate = useNavigate();
    const { showToastNotification } = useNotification();

    // Auction form state
    const [title, setTitle] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [minimumBidIncrement, setMinimumBidIncrement] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);

    // Additional states
    const [availableProducts, setAvailableProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    // Load available products
    const loadAvailableProducts = useCallback(async () => {
        setLoadingProducts(true);
        setError('');
        try {
            const response = await productService.getMyActiveProducts();
            // Handle the correct response structure: response.data.products
            setAvailableProducts(response.data?.products || response.products || []);
        } catch (err) {
            console.error('Error loading products:', err);
            setError(err.message || 'Failed to load products');
            showToastNotification(err.message || 'Failed to load products', 'error');
        } finally {
            setLoadingProducts(false);
        }
    }, [showToastNotification]);

    // Add product to auction
    const addProduct = useCallback((product, quantity = 1) => {
        setSelectedProducts(prev => {
            const existingIndex = prev.findIndex(p => p.productId === product.productId);
            if (existingIndex >= 0) {
                const updated = [...prev];
                updated[existingIndex] = { ...updated[existingIndex], quantity };
                return updated;
            }
            return [...prev, { productId: product.productId, quantity, product }];
        });
    }, []);

    // Remove product from auction
    const removeProduct = useCallback((productId) => {
        setSelectedProducts(prev => prev.filter(p => p.productId !== productId));
    }, []);

    // Update product quantity
    const updateProductQuantity = useCallback((productId, quantity) => {
        if (quantity <= 0) {
            removeProduct(productId);
            return;
        }
        setSelectedProducts(prev =>
            prev.map(p =>
                p.productId === productId ? { ...p, quantity } : p
            )
        );
    }, [removeProduct]);

    // Handle image upload
    const handleImageUpload = useCallback(async (file) => {
        if (!file) return null;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            setError('Only image files (JPEG, PNG, WebP, GIF) are allowed');
            return null;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setError('File size must be less than 5MB');
            return null;
        }

        setUploading(true);
        setError("");

        try {
            const response = await auctionService.uploadImage(file, file.name);
            const uploadedImageUrl = response.imageUrl;
            setImageUrl(uploadedImageUrl);
            showToastNotification('Image uploaded successfully!', 'success');
            return uploadedImageUrl;
        } catch (err) {
            console.error('Image upload error:', err);
            setError(err.message || 'Image upload failed');
            showToastNotification(err.message || 'Image upload failed', 'error');
            return null;
        } finally {
            setUploading(false);
        }
    }, [showToastNotification]);

    // Remove image
    const removeImage = useCallback(() => {
        setImageUrl('');
    }, []);

    // Validate form
    const validateForm = useCallback(() => {
        if (!title.trim()) {
            throw new Error('Auction title is required');
        }
        if (!startTime) {
            throw new Error('Start time is required');
        }
        if (!endTime) {
            throw new Error('End time is required');
        }
        if (!startingPrice || parseFloat(startingPrice) <= 0) {
            throw new Error('Starting price must be greater than 0');
        }
        if (!minimumBidIncrement || parseFloat(minimumBidIncrement) <= 0) {
            throw new Error('Minimum bid increment must be greater than 0');
        }
        if (selectedProducts.length === 0) {
            throw new Error('At least one product must be selected');
        }

        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        const now = new Date();

        if (startDate <= now) {
            throw new Error('Start time must be in the future');
        }
        if (endDate <= startDate) {
            throw new Error('End time must be after start time');
        }

        // Check if all selected products have valid quantities
        for (const selectedProduct of selectedProducts) {
            if (selectedProduct.quantity <= 0) {
                throw new Error(`Invalid quantity for product: ${selectedProduct.product?.name || selectedProduct.productId}`);
            }

            const availableProduct = availableProducts.find(p => p.productId === selectedProduct.productId);
            if (availableProduct && selectedProduct.quantity > availableProduct.stockQuantity) {
                throw new Error(`Quantity exceeds available stock for product: ${availableProduct.name}`);
            }
        }
    }, [title, startTime, endTime, startingPrice, minimumBidIncrement, selectedProducts, availableProducts]);

    // Submit auction
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        try {
            validateForm();

            const auctionData = {
                title: title.trim(),
                imageUrl: imageUrl || undefined, // Only include if image was uploaded
                startTime,
                endTime,
                startingPrice: startingPrice.toString(),
                minimumBidIncrement: minimumBidIncrement.toString(),
                products: selectedProducts.map(p => ({
                    productId: p.productId,
                    quantity: p.quantity
                }))
            };

            const response = await auctionService.createAuction(auctionData);

            showToastNotification('Auction created successfully!', 'success');

            // Reset form
            setTitle('');
            setImageUrl('');
            setStartTime('');
            setEndTime('');
            setStartingPrice('');
            setMinimumBidIncrement('');
            setSelectedProducts([]);

            // Navigate to auction listing or detail page
            navigate('/seller-hub/listings/auction');

            return response;
        } catch (err) {
            console.error('Error creating auction:', err);
            const errorMessage = err.message || 'Failed to create auction';
            setError(errorMessage);
            showToastNotification(errorMessage, 'error');
        } finally {
            setSubmitting(false);
        }
    }, [
        validateForm,
        title,
        startTime,
        endTime,
        startingPrice,
        minimumBidIncrement,
        selectedProducts,
        showToastNotification,
        navigate
    ]);

    // Reset form
    const resetForm = useCallback(() => {
        setTitle('');
        setImageUrl('');
        setStartTime('');
        setEndTime('');
        setStartingPrice('');
        setMinimumBidIncrement('');
        setSelectedProducts([]);
        setError('');
    }, []);

    return {
        // Form data
        title,
        setTitle,
        imageUrl,
        setImageUrl,
        startTime,
        setStartTime,
        endTime,
        setEndTime,
        startingPrice,
        setStartingPrice,
        minimumBidIncrement,
        setMinimumBidIncrement,
        selectedProducts,
        availableProducts,

        // States
        loading,
        submitting,
        loadingProducts,
        uploading,
        error,

        // Actions
        loadAvailableProducts,
        addProduct,
        removeProduct,
        updateProductQuantity,
        handleImageUpload,
        removeImage,
        handleSubmit,
        resetForm,
    };
};
