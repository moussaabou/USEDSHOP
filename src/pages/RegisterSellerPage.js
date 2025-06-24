import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendarAlt, FaLock, FaImage } from 'react-icons/fa';
import './RegisterSellerPage.css';

function RegisterSellerPage({ language }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    surname: '',
    phone_number: '',
    email: '',
    address: '',
    birth_date: '',
    password: '',
    profile_picture: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  // كائن الترجمة
  const translations = {
    ar: {
      pageTitle: 'تسجيل بائع جديد',
      name: 'الاسم',
      surname: 'اللقب',
      phone_number: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      address: 'الولاية',
      selectWilaya: 'اختر الولاية',
      birth_date: 'تاريخ الميلاد',
      password: 'كلمة المرور',
      profile_picture: 'صورة البروفايل',
      register: 'تسجيل',
    },
    fr: {
      pageTitle: 'Inscription Nouveau Vendeur',
      name: 'Prénom',
      surname: 'Nom',
      phone_number: 'Téléphone',
      email: 'E-mail',
      address: 'Wilaya',
      selectWilaya: 'Choisir la wilaya',
      birth_date: 'Date de naissance',
      password: 'Mot de passe',
      profile_picture: 'Photo de profil',
      register: "S'inscrire",
    },
    en: {
      pageTitle: 'Register New Seller',
      name: 'First Name',
      surname: 'Last Name',
      phone_number: 'Phone Number',
      email: 'Email',
      address: 'Wilaya',
      selectWilaya: 'Select wilaya',
      birth_date: 'Birth Date',
      password: 'Password',
      profile_picture: 'Profile Picture',
      register: 'Register',
    },
  };
  const t = translations[language];

  // قائمة ولايات الجزائر
  const wilayas = [
    'أدرار', 'الشلف', 'الأغواط', 'أم البواقي', 'باتنة', 'بجاية', 'بسكرة', 'بشار', 'البليدة', 'البويرة',
    'تمنراست', 'تبسة', 'تلمسان', 'تيارت', 'تيزي وزو', 'الجزائر', 'الجلفة', 'جيجل', 'سطيف', 'سعيدة',
    'سكيكدة', 'سيدي بلعباس', 'عنابة', 'قالمة', 'قسنطينة', 'المدية', 'مستغانم', 'المسيلة', 'معسكر', 'ورقلة',
    'وهران', 'البيض', 'إليزي', 'برج بوعريريج', 'بومرداس', 'الطارف', 'تندوف', 'تيسمسيلت', 'الوادي', 'خنشلة',
    'سوق أهراس', 'تيبازة', 'ميلة', 'عين الدفلى', 'النعامة', 'عين تموشنت', 'غرداية', 'غليزان', 'تميمون', 'برج باجي مختار',
    'أولاد جلال', 'بني عباس', 'عين صالح', 'عين قزام', 'تقرت', 'جانت', 'المغير', 'المنيعة'
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      const file = files[0];
      setForm({ ...form, profile_picture: file });
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    fetch('https://usdeshopbackeand-1.onrender.com/api/register-seller/', {
      method: 'POST',
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error('فشل في التسجيل');
        return res.json();
      })
      .then((data) => {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userType', 'seller');
        localStorage.setItem('userId', data.id);
        navigate('/seller');
      })
      .catch((err) => alert('حدث خطأ: ' + err.message));
  };

  const renderInput = (field, icon, type = 'text') => (
    <div className="input-group">
      <div className="input-icon">
        {icon}
      </div>
      <input
        type={type}
        name={field}
        placeholder={t[field]}
        value={form[field]}
        onChange={handleChange}
        required
      />
    </div>
  );

  return (
    <div className="register-container">
      <h2>{t.pageTitle}</h2>
      <form onSubmit={handleSubmit}>
        {renderInput('name', <FaUser />)}
        {renderInput('surname', <FaUser />)}
        {renderInput('phone_number', <FaPhone />)}
        {renderInput('email', <FaEnvelope />, 'email')}
        {/* حقل الولاية مع label وتنسيق */}
        <div className="input-group">
          <label htmlFor="address" className="input-label">{t.address}</label>
          <div className="input-icon">
            <FaMapMarkerAlt />
          </div>
          <select
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            required
            className="wilaya-select"
          >
            <option value="">{t.selectWilaya}</option>
            {wilayas.map((wilaya, idx) => (
              <option key={idx} value={wilaya}>{wilaya}</option>
            ))}
          </select>
        </div>
        {renderInput('birth_date', <FaCalendarAlt />, 'date')}
        {renderInput('password', <FaLock />, 'password')}
        {/* صورة البروفايل */}
        <div className="file-input-group">
          <label className="input-label">{t.profile_picture}</label>
          <div className="input-icon">
            <FaImage />
          </div>
          <input
            type="file"
            name="profile_picture"
            onChange={handleChange}
            accept="image/*"
            className={previewImage ? 'has-preview' : ''}
          />
          {previewImage && (
            <div className="image-preview">
              <img src={previewImage} alt="Preview" />
            </div>
          )}
        </div>
        <button type="submit">{t.register}</button>
      </form>
    </div>
  );
}

export default RegisterSellerPage;
