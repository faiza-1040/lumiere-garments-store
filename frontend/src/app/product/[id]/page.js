"use client";
import { useState, useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/store/cartSlice";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import FavouriteButton from "@/components/FavouriteButton";

export default function ProductPage({ params }) {
  const resolvedParams = use(params);
  const dispatch = useDispatch();
  const router = useRouter();
  
  const { userInfo } = useSelector((s) => s.auth);
  
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [loading, setLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [added, setAdded] = useState(false);
  const [error, setError] = useState(false);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewMsg, setReviewMsg] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${resolvedParams.id}`);
        setProduct(data);
        setMainImage(data.image);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return <div className="py-24 text-center text-muted-foreground">Loading product details...</div>;
  }

  if (!product) {
    return <div className="py-24 text-center">Product not found.</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      setError(true);
      return;
    }
    setError(false);
    dispatch(addToCart({ ...product, selectedSize, selectedColor }));
    setAdded(true);
    
    setTimeout(() => {
      router.push("/cart");
    }, 500);
  };
  
  const submitReview = async (e) => {
    e.preventDefault();
    if (!rating) return alert("Please select a rating.");
    setReviewLoading(true);
    setReviewMsg("");
    try {
      await axios.post(
        `http://localhost:5000/api/products/${product._id}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );
      setReviewMsg("Review added successfully!");
      // Refresh product
      const { data } = await axios.get(`http://localhost:5000/api/products/${product._id}`);
      setProduct(data);
      setRating(0);
      setComment("");
    } catch (err) {
      setReviewMsg(err.response?.data?.message || err.message);
    } finally {
      setReviewLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 w-full">
      <div className="flex flex-col md:flex-row gap-16 mb-24">
        {/* Images Gallery */}
        <div className="w-full md:w-1/2 flex gap-4">
          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="w-20 md:w-24 flex flex-col gap-4 flex-shrink-0 hide-scrollbar overflow-y-auto" style={{ maxHeight: '800px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  className={`relative w-full aspect-[3/4] overflow-hidden border-2 transition-all ${
                    mainImage === img ? 'border-primary' : 'border-transparent hover:border-secondary-foreground'
                  }`}
                  onClick={() => setMainImage(img)}
                >
                  <Image src={img?.startsWith('http') ? img : `http://localhost:5000${img}`} alt={`${product.name} ${idx + 1}`} fill className="object-cover" sizes="100px" />
                </button>
              ))}
            </div>
          )}
          
          {/* Main Image */}
          <div className="relative w-full aspect-[3/4] bg-[#e7e5e4] overflow-hidden flex-1">
             <Image src={mainImage?.startsWith('http') ? mainImage : `http://localhost:5000${mainImage}`} alt={product.name} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 flex flex-col pt-8 md:sticky md:top-24 h-fit">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4">{product.category}</p>
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-light font-poppins">{product.name}</h1>
            <FavouriteButton product={product} size={22} />
          </div>
          <p className="text-2xl font-medium mb-8">
            PKR {product.price?.toLocaleString()}
            {product.isSale && product.discountPrice && (
              <span className="ml-4 text-muted-foreground line-through text-lg">PKR {product.discountPrice?.toLocaleString()}</span>
            )}
          </p>
          
          <div className="mb-8">
            <p className="text-muted-foreground leading-relaxed font-light">{product.description}</p>
          </div>

          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm uppercase tracking-wider font-medium">Size</span>
                {product.modelSize && (
                  <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    Model wears: <strong>{product.modelSize}</strong>
                  </span>
                )}
              </div>
              <div className="flex gap-4 flex-wrap">
                {product.sizes.map((size) => (
                  <button 
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(false); }}
                    className={`px-5 py-3 flex items-center justify-center border transition text-sm font-medium ${
                      selectedSize === size 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-secondary hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-600 text-sm mt-2">Please select a size.</p>}
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm uppercase tracking-wider font-medium">Color</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                {product.colors.map((color) => (
                  <button 
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 py-3 flex items-center justify-center border transition text-sm font-medium ${
                      selectedColor === color 
                        ? 'border-primary bg-primary text-primary-foreground' 
                        : 'border-secondary hover:border-primary/50 text-foreground'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            onClick={handleAddToCart}
            disabled={product.countInStock === 0}
            className={`w-full py-5 uppercase tracking-widest text-sm font-semibold transition duration-300 ${
              product.countInStock === 0 ? 'bg-secondary text-muted-foreground cursor-not-allowed' :
              added ? 'bg-green-700 text-white' : 'bg-primary text-primary-foreground hover:bg-primary/90'
            }`}
          >
            {product.countInStock === 0 ? 'Out of Stock' : added ? 'Added to Cart ✓ Redirecting...' : 'Add to Cart'}
          </button>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="border-t border-secondary pt-16 max-w-4xl">
        <h2 className="text-2xl font-light font-poppins mb-10">Customer Reviews</h2>
        
        {product.reviews?.length === 0 ? (
          <p className="text-muted-foreground mb-12">No reviews yet. Be the first to review this product!</p>
        ) : (
          <div className="mb-12 space-y-8">
            {product.reviews?.map((review) => (
              <div key={review._id} className="pb-8 border-b border-secondary/50 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-500 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? "★" : "☆"}</span>
                    ))}
                  </div>
                  <span className="font-medium text-sm">{review.name}</span>
                  <span className="text-muted-foreground text-xs ml-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {userInfo ? (
          <div className="bg-secondary/30 p-8">
            <h3 className="text-lg font-medium mb-6">Write a Review</h3>
            {reviewMsg && (
              <div className={`p-4 mb-6 text-sm font-medium ${reviewMsg.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {reviewMsg}
              </div>
            )}
            <form onSubmit={submitReview}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Rating</label>
                <select 
                  className="w-full p-4 border border-secondary bg-transparent outline-none focus:border-primary text-sm"
                  value={rating} 
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 uppercase tracking-wider">Comment</label>
                <textarea 
                  rows="4"
                  className="w-full p-4 border border-secondary bg-transparent outline-none focus:border-primary text-sm resize-y"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about this product..."
                  required
                />
              </div>
              <button 
                type="submit" 
                disabled={reviewLoading}
                className="bg-primary text-primary-foreground px-8 py-4 uppercase tracking-widest text-xs font-semibold hover:bg-primary/90 transition-all"
              >
                {reviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-secondary p-6 text-center">
            <p className="text-sm font-medium">Please <a href="/login" className="underline hover:text-muted-foreground">login</a> to write a review.</p>
          </div>
        )}
      </div>
    </div>
  );
}
