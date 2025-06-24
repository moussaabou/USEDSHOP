import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddProductPage.css';

function AddProductPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [imagePreviews, setImagePreviews] = useState([null, null, null]);
  const [images, setImages] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);
  const [wilaya, setWilaya] = useState('');

  const navigate = useNavigate();
  const sellerId = localStorage.getItem('userId');

  const handleImageChange = (index, file) => {
    const newImages = [...images];
    const newPreviews = [...imagePreviews];
    newImages[index] = file;
    newPreviews[index] = file ? URL.createObjectURL(file) : null;
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(price) || price <= 0) {
      alert('الرجاء إدخال سعر صالح');
      return;
    }

    if (!sellerId) {
      alert('لم يتم العثور على البائع');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('seller_id', sellerId);
    formData.append('wilaya', wilaya);
    images.forEach((img, i) => img && formData.append(`image${i + 1}`, img));

    try {
      const response = await fetch('https://usdeshopbackeand-1.onrender.com/api/add-product/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert(data.message || 'تمت الإضافة بنجاح');
        navigate('/seller');
      } else {
        alert(data.error || 'فشل في إضافة المنتج');
      }
    } catch (error) {
      setLoading(false);
      alert('حدث خطأ أثناء الإضافة');
      console.error(error);
    }
  };

  return (
    <div className="add-product-page">
      <div className="form-container">
        <h2>🛒 إضافة منتج جديد</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="اسم المنتج"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">اختر نوع المنتج</option>
            <option value="هاتف">هاتف</option>
            <option value="إلكترونيات">إلكترونيات</option>
            <option value="غيارات سيارات">غيارات سيارات</option>
            <option value="حاسوب">حاسوب</option>
          </select>

          <input
            type="number"
            placeholder="السعر بالدينار"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <select
            value={wilaya}
            onChange={(e) => setWilaya(e.target.value)}
            required
          >
            <option value="">اختر الولاية</option>
            <option value="أدرار">أدرار</option>
            <option value="الشلف">الشلف</option>
            <option value="الأغواط">الأغواط</option>
            <option value="أم البواقي">أم البواقي</option>
            <option value="باتنة">باتنة</option>
            <option value="بجاية">بجاية</option>
            <option value="بسكرة">بسكرة</option>
            <option value="بشار">بشار</option>
            <option value="البليدة">البليدة</option>
            <option value="البويرة">البويرة</option>
            <option value="تمنراست">تمنراست</option>
            <option value="تبسة">تبسة</option>
            <option value="تلمسان">تلمسان</option>
            <option value="تيارت">تيارت</option>
            <option value="تيزي وزو">تيزي وزو</option>
            <option value="الجزائر">الجزائر</option>
            <option value="الجلفة">الجلفة</option>
            <option value="جيجل">جيجل</option>
            <option value="سطيف">سطيف</option>
            <option value="سعيدة">سعيدة</option>
            <option value="سكيكدة">سكيكدة</option>
            <option value="سيدي بلعباس">سيدي بلعباس</option>
            <option value="عنابة">عنابة</option>
            <option value="قالمة">قالمة</option>
            <option value="قسنطينة">قسنطينة</option>
            <option value="المدية">المدية</option>
            <option value="مستغانم">مستغانم</option>
            <option value="المسيلة">المسيلة</option>
            <option value="معسكر">معسكر</option>
            <option value="ورقلة">ورقلة</option>
            <option value="وهران">وهران</option>
            <option value="البيض">البيض</option>
            <option value="إليزي">إليزي</option>
            <option value="برج بوعريريج">برج بوعريريج</option>
            <option value="بومرداس">بومرداس</option>
            <option value="الطارف">الطارف</option>
            <option value="تندوف">تندوف</option>
            <option value="تيسمسيلت">تيسمسيلت</option>
            <option value="الوادي">الوادي</option>
            <option value="خنشلة">خنشلة</option>
            <option value="سوق أهراس">سوق أهراس</option>
            <option value="تيبازة">تيبازة</option>
            <option value="ميلة">ميلة</option>
            <option value="عين الدفلى">عين الدفلى</option>
            <option value="النعامة">النعامة</option>
            <option value="عين تموشنت">عين تموشنت</option>
            <option value="غرداية">غرداية</option>
            <option value="غليزان">غليزان</option>
            <option value="تميمون">تميمون</option>
            <option value="برج باجي مختار">برج باجي مختار</option>
            <option value="أولاد جلال">أولاد جلال</option>
            <option value="بني عباس">بني عباس</option>
            <option value="عين صالح">عين صالح</option>
            <option value="عين قزام">عين قزام</option>
            <option value="تقرت">تقرت</option>
            <option value="جانت">جانت</option>
            <option value="المغير">المغير</option>
            <option value="المنيعة">المنيعة</option>
          </select>

          <textarea
            placeholder="وصف المنتج"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          {[0, 1, 2].map((index) => (
            <div key={index} className="image-upload">
              <label>الصورة {index + 1}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(index, e.target.files[0])}
              />
              {imagePreviews[index] && (
                <img
                  src={imagePreviews[index]}
                  alt={`preview-${index}`}
                  className="preview"
                />
              )}
            </div>
          ))}

          <button type="submit" disabled={loading}>
            {loading ? '⏳ جاري رفع المنتج...' : '✅ إضافة المنتج'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProductPage;
