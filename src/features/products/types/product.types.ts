/**
 * 🔷 Product Domain Types
 * 
 * ملف التعريفات الخاص بكائن المنتج
 * هذا الملف يحتوي على جميع الواجهات (Interfaces) المتعلقة بالمنتجات
 * 
 * مبادئ التصميم:
 * - جميع الخصائص تتبع PascalCase (التوافق مع C# في الباك إند)
 * - التوافق الكامل مع DTOs الباك إند
 * - الفصل بين القراءة (Get) والإنشاء (Create) والتحديث (Update)
 */

/**
 * 📦 Product - كيان المنتج الأساسي
 * 
 * الوصف: يمثل منتج متكامل مع جميع بياناته
 * المستخدمة في: جلب بيانات المنتج الكاملة
 */
export interface Product {
    /** معرّف المنتج الفريد */
    Id: string;
    
    /** اسم المنتج */
    Name: string;
    
    /** وصف تفصيلي للمنتج */
    Description: string;
    
    /** تاريخ الإنشاء */
    CreatedAt: string;
    
    /** حالة المنتج (نشط/غير نشط) */
    IsActive: boolean;
}

/**
 * 💵 ProductPrice - كيان سعر المنتج
 * 
 * الوصف: يمثل معلومات التسعير للمنتج
 * المسؤوليات:
 * - تخزين السعر الأساسي والسعر المخفف
 * - تتبع تاريخ التغييرات في الأسعار
 * - ربط السعر بالمنتج
 */
export interface ProductPrice {
    /** معرّف السعر الفريد */
    Id: string;
    
    /** معرّف المنتج المرتبط */
    ProductId: string;
    
    /** السعر الأساسي */
    BasePrice: number;
    
    /** السعر الحالي (قد يكون مع خصم) */
    CurrentPrice: number;
    
    /** نسبة الخصم (إذا وجدت) */
    DiscountPercentage?: number;
    
    /** تاريخ سريان السعر */
    EffectiveDate: string;
    
    /** تاريخ انتهاء سريان السعر (قد يكون اختياري) */
    ExpirationDate?: string;
    
    /** العملة المستخدمة */
    Currency: string;
    
    /** حالة السعر (نشط/غير نشط) */
    IsActive: boolean;
}

/**
 * 🖼️ ProductMedia - كيان وسائط المنتج (صور وفيديوهات)
 * 
 * الوصف: يمثل الصور والفيديوهات المرتبطة بالمنتج
 * المسؤوليات:
 * - تخزين روابط الوسائط
 * - تصنيف الوسائط (صورة رئيسية، صور إضافية، فيديو)
 * - إدارة ترتيب عرض الوسائط
 */
export interface ProductMedia {
    /** معرّف الوسيط الفريد */
    Id: string;
    
    /** معرّف المنتج المرتبط */
    ProductId: string;
    
    /** رابط الوسيط (صورة أو فيديو) */
    MediaUrl: string;
    
    /** نوع الوسيط (image, video) */
    MediaType: 'image' | 'video';
    
    /** وصف الوسيط (للـ SEO والتسهيلات) */
    AltText?: string;
    
    /** الترتيب في عرض الوسائط */
    DisplayOrder: number;
    
    /** هل هذه الوسيط هي الصورة الرئيسية */
    IsMainMedia: boolean;
    
    /** حالة الوسيط (نشط/غير نشط) */
    IsActive: boolean;
}

/**
 * 🏷️ CategoryType - نوع الفئة
 * 
 * الوصف: يعرّف أنواع الفئات المختلفة للمنتجات
 * المسؤوليات:
 * - تصنيف الفئات إلى نوعيات (فئة رئيسية، فئة فرعية، إلخ)
 */
export interface CategoryType {
    /** معرّف نوع الفئة الفريد */
    Id: string;
    
    /** اسم نوع الفئة */
    Name: string;
    
    /** وصف نوع الفئة */
    Description?: string;
    
    /** حالة نوع الفئة (نشط/غير نشط) */
    IsActive: boolean;
}

/**
 * 📂 ProductCategory - فئة المنتج
 * 
 * الوصف: يمثل تصنيف المنتج ضمن الفئات المختلفة
 * المسؤوليات:
 * - تنظيم المنتجات في فئات
 * - دعم الفئات الهرمية (فئة رئيسية وفئات فرعية)
 * - ربط المنتج بنوع فئة محدد
 */
export interface ProductCategory {
    /** معرّف الفئة الفريد */
    Id: string;
    
    /** اسم الفئة */
    Name: string;
    
    /** وصف الفئة */
    Description?: string;
    
    /** معرّف نوع الفئة */
    CategoryTypeId: string;
    
    /** معرّف الفئة الأب (في حالة الفئات الفرعية) */
    ParentCategoryId?: string;
    
    /** رابط الصورة الممثلة للفئة */
    ImageUrl?: string;
    
    /** حالة الفئة (نشط/غير نشط) */
    IsActive: boolean;
}

/**
 * 📊 Inventory - المخزون
 * 
 * الوصف: يمثل معلومات المخزون العام للمنتج
 * المسؤوليات:
 * - تتبع الكمية المتاحة
 * - تتبع الحد الأدنى للمخزون
 * - إدارة حالة المخزون
 */
export interface Inventory {
    /** معرّف المخزون الفريد */
    Id: string;
    
    /** الكمية المتاحة */
    TotalQuantity: number;
    
    /** الكمية المباعة */
    SoldQuantity: number;
    
    /** الكمية المتبقية */
    AvailableQuantity: number;
    
    /** الحد الأدنى للمخزون (يُرسل تنبيه عند الوصول إليه) */
    MinimumStockLevel: number;
    
    /** الحد الأقصى للمخزون */
    MaximumStockLevel: number;
    
    /** حالة المخزون (متاح، منخفض، مستنفد) */
    StockStatus: 'Available' | 'Low' | 'OutOfStock';
    
    /** تاريخ آخر تحديث للمخزون */
    LastUpdated: string;
}

/**
 * 🏪 Store - المتجر
 * 
 * الوصف: يمثل فرع المتجر الفعلي أو الافتراضي
 * المسؤوليات:
 * - تحديد موقع المتجر الجغرافي
 * - إدارة بيانات المتجر
 * - ربط المنتجات بفروع محددة
 */
export interface Store {
    /** معرّف المتجر الفريد */
    Id: string;
    
    /** اسم المتجر */
    Name: string;
    
    /** عنوان المتجر */
    Address: string;
    
    /** المدينة */
    City: string;
    
    /** الدولة */
    Country: string;
    
    /** الرمز البريدي */
    PostalCode?: string;
    
    /** رقم الهاتف */
    PhoneNumber?: string;
    
    /** البريد الإلكتروني */
    Email?: string;
    
    /** موقع الخريطة (Latitude) */
    Latitude?: number;
    
    /** موقع الخريطة (Longitude) */
    Longitude?: number;
    
    /** حالة المتجر (مفتوح/مغلق) */
    IsActive: boolean;
}

/**
 * 📦 ProductInventory - مخزون المنتج في متجر معين
 * 
 * الوصف: يربط المنتج مع المخزون في متجر معين
 * المسؤوليات:
 * - تتبع مخزون المنتج في كل متجر بشكل منفصل
 * - إدارة كميات المنتجات حسب الموقع
 * - تحديث حالة التوفر
 */
export interface ProductInventory {
    /** معرّف علاقة المنتج والمخزون الفريد */
    Id: string;
    
    /** معرّف المنتج */
    ProductId: string;
    
    /** معرّف المخزون */
    InventoryId: string;
    
    /** معرّف المتجر */
    StoreId: string;
    
    /** الكمية المتاحة من المنتج في هذا المتجر */
    AvailableQuantity: number;
    
    /** الكمية المحجوزة (الطلبيات المعلقة) */
    ReservedQuantity: number;
    
    /** الكمية الفعلية في المخزن */
    PhysicalQuantity: number;
    
    /** تاريخ آخر حصر للمخزون */
    LastStockCheckDate: string;
    
    /** حالة التوفر في هذا المتجر */
    IsAvailable: boolean;
}
