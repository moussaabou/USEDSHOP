import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaEdit, FaTrash, FaUser, FaPhone, FaMapMarkerAlt, FaTag, FaShareAlt } from 'react-icons/fa';
import './ProductDetails.css';

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('access');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://usdeshopbackeand-1.onrender.com/api/product/${id}/`);
        if (!response.ok) throw new Error('فشل في تحميل بيانات المنتج');
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('حدث خطأ أثناء تحميل المنتج');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      try {
        const response = await fetch(`https://usdeshopbackeand-1.onrender.com/api/delete-product/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('فشل في حذف المنتج');

        alert('تم حذف المنتج بنجاح');
        navigate('/'); // توجيه إلى الصفحة الرئيسية أو صفحة المنتجات
      } catch (err) {
        alert('حدث خطأ أثناء الحذف');
        console.error(err);
      }
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('تم نسخ رابط المنتج!');
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    rtl: true
  };

  const validImages = product.images?.filter(img => img);

  return (
    <div className="product-details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowRight /> رجوع
      </button>

      <div className="product-detail-card">
        <div className="product-images">
          {validImages && validImages.length > 0 ? (
            validImages.length === 1 ? (
              <img src={validImages[0]} alt="product" className="single-product-image" />
            ) : (
              <Slider {...sliderSettings}>
                {validImages.map((img, i) => (
                  <div key={i}>
                    <img src={img} alt={`product-${i}`} className="product-image-slide" />
                  </div>
                ))}
              </Slider>
            )
          ) : (
            <p className="no-images"><FaTag /> لا توجد صور متاحة</p>
          )}
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="price">{product.price ? `${product.price} د.ج` : 'مجاني'}</p>

          <p>
            <FaTag className="info-icon" />
            <strong>الفئة:</strong> {product.category || 'غير محددة'}
          </p>

          <p>
            <strong>الوصف:</strong> {product.description || 'لا يوجد وصف'}
          </p>

          <p>
            <FaPhone className="info-icon" />
            <strong>هاتف البائع:</strong> {product.seller_phone || 'غير متوفر'}
          </p>

          <p>
            <FaMapMarkerAlt className="info-icon" />
            <strong>عنوان البائع:</strong> {product.seller_address || 'غير متوفر'}
          </p>

          <p>
            <FaUser className="info-icon" />
            <strong>البائع:</strong>{' '}
            <span 
              className="seller-link" 
              onClick={() => navigate(`/seller-products/${product.seller_id}`)}
            >
              {product.seller}
            </span>
          </p>

          <button className="share-btn" onClick={handleShare}>
            <FaShareAlt /> مشاركة المنتج
          </button>

          {userType === 'seller' && product.seller_id === parseInt(userId) && (
            <div className="actions">
              <button className="edit-btn" onClick={() => navigate(`/edit-product/${product.id}`)}>
                <FaEdit /> تعديل
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                <FaTrash /> حذف
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
