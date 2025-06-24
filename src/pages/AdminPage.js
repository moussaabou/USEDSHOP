import React, { useEffect, useState } from 'react';
import './AdminPage.css';
import { FaUsers, FaBoxOpen, FaUserShield, FaStore, FaCubes, FaEye, FaTrash } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminPage({ language = 'ar' }) {
  const [sellers, setSellers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('sellers');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('userType') !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const translations = {
    ar: {
      adminPanel: '...لوحة تحكم الأدمن',
      stats: 'إحصائيات',
      sellers: 'البائعين',
      products: 'المنتجات',
      totalSellers: 'عدد البائعين',
      totalProducts: 'عدد المنتجات',
      viewSellers: 'الاطلاع على البائعين',
      viewProducts: 'الاطلاع على المنتجات',
      loading: 'جاري التحميل...',
      error: 'حدث خطأ:',
      delete: 'حذف',
      view: 'عرض',
      confirmDeleteSeller: 'هل أنت متأكد من حذف هذا البائع وجميع منتجاته؟',
      deleted: 'تم حذف البائع مع جميع منتجاته.',
      deleteError: 'حدث خطأ أثناء الحذف.',
      seller: 'البائع',
      email: 'البريد الإلكتروني',
      product: 'المنتج',
      price: 'السعر',
      category: 'الفئة',
      sellerName: 'اسم البائع',
      goToProducts: 'منتجات البائع',
    },
    en: {
      adminPanel: 'Admin Dashboard',
      stats: 'Statistics',
      sellers: 'Sellers',
      products: 'Products',
      totalSellers: 'Total Sellers',
      totalProducts: 'Total Products',
      viewSellers: 'View Sellers',
      viewProducts: 'View Products',
      loading: 'Loading...',
      error: 'Error:',
      delete: 'Delete',
      view: 'View',
      confirmDeleteSeller: 'Are you sure you want to delete this seller and all their products?',
      deleted: 'Seller and all their products deleted.',
      deleteError: 'Error occurred while deleting.',
      seller: 'Seller',
      email: 'Email',
      product: 'Product',
      price: 'Price',
      category: 'Category',
      sellerName: 'Seller Name',
      goToProducts: 'Seller Products',
    },
    fr: {
      adminPanel: 'Tableau de bord Admin',
      stats: 'Statistiques',
      sellers: 'Vendeurs',
      products: 'Produits',
      totalSellers: 'Nombre de vendeurs',
      totalProducts: 'Nombre de produits',
      viewSellers: 'Voir les vendeurs',
      viewProducts: 'Voir les produits',
      loading: 'Chargement...',
      error: 'Erreur :',
      delete: 'Supprimer',
      view: 'Voir',
      confirmDeleteSeller: 'Êtes-vous sûr de vouloir supprimer ce vendeur et tous ses produits ?',
      deleted: 'Vendeur et tous ses produits supprimés.',
      deleteError: 'Erreur lors de la suppression.',
      seller: 'Vendeur',
      email: 'Email',
      product: 'Produit',
      price: 'Prix',
      category: 'Catégorie',
      sellerName: 'Nom du vendeur',
      goToProducts: 'Produits du vendeur',
    },
  };
  const t = translations[language] || translations['ar'];

  useEffect(() => {
    fetchData();
  }, [language]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sellersRes, productsRes] = await Promise.all([
        fetch('https://usdeshopbackeand-1.onrender.com/api/sellers/'),
        fetch('https://usdeshopbackeand-1.onrender.com/api/products/'),
      ]);
      if (!sellersRes.ok || !productsRes.ok) throw new Error('Fetch error');
      const sellersData = await sellersRes.json();
      const productsData = await productsRes.json();
      setSellers(sellersData);
      setProducts(productsData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = (sellerId) => {
    if (window.confirm(t.confirmDeleteSeller)) {
      fetch(`https://usdeshopbackeand-1.onrender.com/api/delete-seller-simple/${sellerId}/`, { method: 'DELETE' })
        .then(res => {
          if (res.ok) {
            setSellers(prev => prev.filter(s => s.id !== sellerId));
            alert(t.deleted);
          } else {
            alert(t.deleteError);
          }
        })
        .catch(() => {
          alert(t.deleteError);
        });
    }
  };

  return (
    <div className="admin-dashboard">
      <h2 className="admin-title"><FaUserShield /> {t.adminPanel}</h2>
      <div className="admin-stats">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div>
            <div className="stat-number">{sellers.length}</div>
            <div className="stat-label">{t.totalSellers}</div>
          </div>
        </div>
        <div className="stat-card">
          <FaBoxOpen className="stat-icon" />
          <div>
            <div className="stat-number">{products.length}</div>
            <div className="stat-label">{t.totalProducts}</div>
          </div>
        </div>
      </div>
      <div className="admin-tabs">
        <button className={activeTab === 'sellers' ? 'active' : ''} onClick={() => setActiveTab('sellers')}>
          <FaStore /> {t.viewSellers}
        </button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
          <FaCubes /> {t.viewProducts}
        </button>
      </div>
      <div className="admin-content">
        {loading ? (
          <p className="admin-loading">{t.loading}</p>
        ) : error ? (
          <p className="admin-error">{t.error} {error}</p>
        ) : activeTab === 'sellers' ? (
          <div className="admin-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.seller}</th>
                  <th>{t.email}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller, idx) => (
                  <tr key={seller.id}>
                    <td>{idx + 1}</td>
                    <td>{seller.name || seller.username}</td>
                    <td>{seller.email}</td>
                    <td>
                      <div className="seller-btn-group">
                        <Link to={`/seller-profile-page/${seller.id}`} className="view-btn"><FaEye /> {t.view}</Link>
                        <Link to={`/seller-products/${seller.id}`} className="view-btn alt"><FaBoxOpen /> {t.goToProducts}</Link>
                        <button className="delete-btn" onClick={() => handleDelete(seller.id)}><FaTrash /> {t.delete}</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-list">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>{t.product}</th>
                  <th>{t.price}</th>
                  <th>{t.category}</th>
                  <th>{t.sellerName}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product.id}>
                    <td>{idx + 1}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.category}</td>
                    <td>{product.seller}</td>
                    <td>
                      <Link to={`/product/${product.id}`} className="view-btn"><FaEye /> {t.view}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
