import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductFilterPage = () => {
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    let url = '/api/filter-products/?';

    if (category) url += `category=${encodeURIComponent(category)}&`;
    // ملاحظة: حسب ما تفضلت، هذه الفلاتر لن ترسل minPrice و maxPrice و sortPrice للسيرفر
    // لو تريد ترسلها أزل التعليقات عن الأسطر التالية:
    /*
    if (minPrice) url += `min_price=${minPrice}&`;
    if (maxPrice) url += `max_price=${maxPrice}&`;
    if (sortPrice) url += `sort_price=${sortPrice}&`;
    */

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('فشل في جلب المنتجات');
        return res.json();
      })
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setProducts([]);
        setLoading(false);
      });
  }, [category]); // نراقب فقط تغير النوع category لجلب جديد من السيرفر

  // فلترة محلية حسب البحث و السعر بعد جلب المنتجات من السيرفر:
  let filteredProducts = products
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(product => {
      if (minPrice && product.price < Number(minPrice)) return false;
      if (maxPrice && product.price > Number(maxPrice)) return false;
      return true;
    });

  // ترتيب حسب السعر
  if (sortPrice === 'asc') {
    filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortPrice === 'desc') {
    filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
  }

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="App">
      <h1>تصفية المنتجات حسب النوع والسعر والبحث</h1>

      <div className="filter-controls">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">اختر نوع المنتج</option>
          <option value="هاتف">هاتف</option>
          <option value="إلكترونيات">إلكترونيات</option>
          <option value="غيارات سيارات">غيارات سيارات</option>
          <option value="حاسوب">حاسوب</option>
        </select>

        <input
          type="search"
          placeholder="ابحث عن منتج..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="filter-input search-input"
        />

        <input
          type="number"
          placeholder="أقل سعر"
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="filter-input price-input"
          min="0"
        />

        <input
          type="number"
          placeholder="أعلى سعر"
          value={maxPrice}
          onChange={e => setMaxPrice(e.target.value)}
          className="filter-input price-input"
          min="0"
        />

        <select
          value={sortPrice}
          onChange={e => setSortPrice(e.target.value)}
          className="filter-select"
        >
          <option value="">ترتيب السعر</option>
          <option value="asc">من الأقل إلى الأعلى</option>
          <option value="desc">من الأعلى إلى الأقل</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">جاري التحميل...</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-results-text">لا توجد منتجات مطابقة.</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map(product => (
            <li
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
              title={`عرض تفاصيل ${product.name}`}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price} د.ج</p>
                <p className="seller">البائع: {product.seller}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductFilterPage;
