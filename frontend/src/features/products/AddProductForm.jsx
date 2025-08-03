import {
  Caption,
  Container,
  CustomNavLink,
  PrimaryButton,
  Title,
  commonClassNameOfInput,
} from "@/components/ui/index.js";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "@/contexts/NotificationContext.jsx";
import { useUser } from "@/contexts/UserContext.jsx";
import { useAddProduct } from "@/hooks/useAddProduct.js";
import { IoCloudUploadOutline, IoImageOutline, IoTrashOutline } from "react-icons/io5";

export const AddProductForm = () => {
  const { user, loading } = useUser();
  const { showToastNotification } = useNotification();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const {
    productName,
    setProductName,
    description,
    setDescription,
    stockQuantity,
    setStockQuantity,
    uploadedImages,
    handleImageUpload,
    removeImage,
    handleSubmit,
    error,
    loading: submitting,
    uploading,
  } = useAddProduct();

  useEffect(() => {
    if (!loading && (!user?.id || user?.role !== "SELLER")) {
      showToastNotification("You must be logged in as a seller to access this page", "error");
      navigate("/auth/login");
    }
  }, [loading, navigate, showToastNotification, user]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="add-product pt-16 relative">
      <div className="bg-green w-96 h-96 rounded-full opacity-20 blur-3xl absolute top-2/3"></div>

      <div className="bg-[#241C37] pt-8 h-[40vh] relative content">
        <Container>
          <div>
            <Title level={3} className="text-white">
              Create your product
            </Title>
            <div className="flex items-center gap-3">
              <Title level={5} className="text-green font-normal text-xl">Seller Hub</Title>
              <Title level={5} className="text-white font-normal text-xl">/</Title>
              <Title level={5} className="text-white font-normal text-xl">Add Product</Title>
            </div>
          </div>
        </Container>
      </div>

      <div className="transition-all duration-500 ease-in-out transform translate-x-0">
        <div className="bg-white shadow-s3 w-2/3 m-auto my-16 p-8 rounded-xl">
          <form onSubmit={handleSubmit}>
            <div className="text-center mb-8">
              <Title level={5}>Create your product</Title>
            </div>

            {error && (
              <div className="text-center mb-6">
                <div className="text-red-500 bg-red-50 p-3 rounded-md">{error}</div>
              </div>
            )}

            {/* Photo & Video Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Title level={6} className="text-gray-800 font-semibold">PHOTO & VIDEO</Title>
                  <Caption className="text-gray-500">Add up to 10 photos</Caption>
                </div>
                <Caption className="text-blue-500 cursor-pointer hover:underline">
                  See photo options
                </Caption>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* Add Photos Section */}
                <div 
                  onClick={triggerFileInput}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-green hover:bg-green-50 transition-colors"
                >
                  <IoImageOutline size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 font-medium">Add photos</p>
                  <Caption className="text-gray-500">or drag and drop</Caption>
                  {uploading && (
                    <div className="mt-2">
                      <Caption className="text-blue-500">Uploading...</Caption>
                    </div>
                  )}
                </div>

                {/* Add Video Section - Placeholder */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-not-allowed opacity-50">
                  <IoCloudUploadOutline size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 font-medium">Add video</p>
                  <Caption className="text-gray-500">or drag and drop</Caption>
                </div>
              </div>

              {/* Uploaded Images Display */}
              {uploadedImages.length > 0 && (
                <div className="mb-6">
                  <Caption className="mb-3 text-gray-700">Uploaded Images ({uploadedImages.length})</Caption>
                  <div className="grid grid-cols-4 gap-3">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img 
                          src={imageUrl} 
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <IoTrashOutline size={12} />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Title Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <Title level={6} className="text-gray-800 font-semibold">TITLE</Title>
                <Caption className="text-blue-500 cursor-pointer hover:underline">
                  See photo options
                </Caption>
              </div>
              
              <div className="mb-2">
                <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-md mb-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <Caption className="text-blue-700">
                    Provide a title for your item. Use words people would search for when looking for your item.
                  </Caption>
                </div>
              </div>

              <div>
                <Caption className="mb-2 text-gray-700">Item title *</Caption>
                <input
                  type="text"
                  name="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`${commonClassNameOfInput} w-full`}
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <Title level={6} className="text-gray-800 font-semibold mb-4">DESCRIPTION</Title>
              <div>
                <Caption className="mb-2 text-gray-700">Product Description</Caption>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${commonClassNameOfInput} w-full min-h-[120px] resize-vertical`}
                  placeholder="Describe your product in detail..."
                  rows={5}
                />
              </div>
            </div>

            {/* Stock Quantity Section */}
            <div className="mb-8">
              <Title level={6} className="text-gray-800 font-semibold mb-4">INVENTORY</Title>
              <div>
                <Caption className="mb-2 text-gray-700">Stock Quantity *</Caption>
                <input
                  type="number"
                  name="stockQuantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className={`${commonClassNameOfInput} w-full`}
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
            </div>

            {/* Create for free section */}
            <div className="mb-8 p-6 bg-gray-50 rounded-lg text-center">
              <Title level={6} className="text-gray-800 mb-2">Create for free.</Title>
              <Caption className="text-gray-600">
                Connect with millions of buyers and grow your business
              </Caption>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center">
              <PrimaryButton 
                type="submit"
                className="px-8 py-3 bg-green text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                disabled={submitting || uploading}
              >
                {submitting ? "Creating Product..." : "Create product"}
              </PrimaryButton>
              
              <button
                type="button"
                onClick={() => navigate("/seller-hub/listings/product")}
                className="px-8 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
