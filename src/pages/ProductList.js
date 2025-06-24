import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductList.css';

const ProductFilterPage = ({ language }) => {
  const [category, setCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const translations = {
    ar: {
      title: 'تصفية المنتجات حسب النوع والسعر والبحث',
      selectCategory: 'اختر نوع المنتج',
      categories: ['هاتف', 'إلكترونيات', 'غيارات سيارات', 'حاسوب'],
      searchPlaceholder: 'ابحث عن منتج...',
      minPrice: 'أقل سعر',
      maxPrice: 'أعلى سعر',
      sortPrice: 'ترتيب السعر',
      asc: 'من الأقل إلى الأعلى',
      desc: 'من الأعلى إلى الأقل',
      loading: 'جاري التحميل...',
      noResults: 'لا توجد منتجات مطابقة.',
      seller: 'البائع',
      viewDetails: 'عرض تفاصيل',
      priceUnit: 'د.ج',
    },
    fr: {
      title: 'Filtrer les produits par catégorie, prix et recherche',
      selectCategory: 'Choisir la catégorie',
      categories: ['هاتف', 'إلكترونيات', 'غيارات سيارات', 'حاسوب'],
      searchPlaceholder: 'Rechercher un produit...',
      minPrice: 'Prix min',
      maxPrice: 'Prix max',
      sortPrice: 'Trier par prix',
      asc: 'Du moins cher au plus cher',
      desc: 'Du plus cher au moins cher',
      loading: 'Chargement...',
      noResults: 'Aucun produit trouvé.',
      seller: 'Vendeur',
      viewDetails: 'Voir détails',
      priceUnit: 'DA',
    },
    en: {
      title: 'Filter products by category, price, and search',
      selectCategory: 'Select category',
      categories: ['هاتف', 'إلكترونيات', 'غيارات سيارات', 'حاسوب'],
      searchPlaceholder: 'Search for a product...',
      minPrice: 'Min price',
      maxPrice: 'Max price',
      sortPrice: 'Sort by price',
      asc: 'Low to high',
      desc: 'High to low',
      loading: 'Loading...',
      noResults: 'No matching products.',
      seller: 'Seller',
      viewDetails: 'View details',
      priceUnit: 'DZD',
    },
  };
  const t = translations[language] || translations.ar;

  useEffect(() => {
    setLoading(true);
    let url = 'https://usdeshopbackeand-1.onrender.com/api/filter-products/?';

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
      <h1>{t.title}</h1>

      <div className="filter-controls">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="filter-select"
        >
          <option value="">{t.selectCategory}</option>
          {t.categories.map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>

        <input
          type="search"
          placeholder={t.searchPlaceholder}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="filter-input search-input"
        />

        <input
          type="number"
          placeholder={t.minPrice}
          value={minPrice}
          onChange={e => setMinPrice(e.target.value)}
          className="filter-input price-input"
          min="0"
        />

        <input
          type="number"
          placeholder={t.maxPrice}
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
          <option value="">{t.sortPrice}</option>
          <option value="asc">{t.asc}</option>
          <option value="desc">{t.desc}</option>
        </select>
      </div>

      {loading ? (
        <p className="loading-text">{t.loading}</p>
      ) : filteredProducts.length === 0 ? (
        <p className="no-results-text">{t.noResults}</p>
      ) : (
        <ul className="product-list">
          {filteredProducts.map(product => (
            <li
              key={product.id}
              className="product-item"
              onClick={() => handleProductClick(product.id)}
              title={`${t.viewDetails} ${product.name}`}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={product.images?.[0]}
                alt={product.name}
                className="product-image"
              />
              <div className="product-info">
                <h3>{product.name}</h3>
                <p className="price">{product.price} {t.priceUnit}</p>
                <p className="seller">{t.seller}: {product.seller}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductFilterPage;
