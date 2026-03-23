Use Case للهيكلية العامة للـ Frontend
(Frontend Architectural Use Case)

معلومات عامة
العنصر التفاصيل
اسم Use Case هيكلة مشروع React Frontend - Clean Architecture
الهدف توحيد طريقة بناء وتنظيم مشاريع الواجهة الأمامية لجعلها قابلة للتوسيع والصيانة وإعادة الاستخدام
التقنيات المستخدمة React, TypeScript, Zustand, React Query, Axios, React Hook Form, Zod
الطبقات المعمارية Presentation Layer, Application Layer, State Layer, Service Layer, Infrastructure Layer
المبادئ العامة للهيكلة

1. مبدأ الفصل بين المسؤوليات (Separation of Concerns)
   كل طبقة مسؤولة عن مهام محددة فقط

لا تتداخل المسؤوليات بين الطبقات

كل جزء من التطبيق يعرف فقط ما يحتاجه بالضبط

2. مبدأ التبعية (Dependency Rule)
   التبعيات تتجه من الخارج إلى الداخل فقط

الطبقات الداخلية لا تعرف شيئاً عن الطبقات الخارجية

UI يعتمد على Hooks، و Hooks تعتمد على Services، و Services تعتمد على Infrastructure

3. مبدأ قابلية التوسع (Scalability)
   إضافة ميزة جديدة لا تؤثر على الميزات الموجودة

يمكن تطوير أجزاء مختلفة من التطبيق بشكل متوازي

سهولة استبدال أي تقنية بأخرى (مثل تغيير مكتبة State Management)

4. مبدأ إعادة الاستخدام (Reusability)
   المكونات العامة تكون في مكان مشترك

الـ Hooks المشتركة تكون قابلة للاستخدام في عدة أماكن

الـ Types والـ Constants تكون مركزية

الهيكلية العامة للمشروع
src/
│
├── features/ # 🔵 الميزات (Features)
│ ├── feature-name/ # كل ميزة في مجلد منفصل
│ │ ├── components/ # مكونات خاصة بالميزة
│ │ ├── hooks/ # Custom Hooks خاصة بالميزة
│ │ ├── services/ # API Calls خاصة بالميزة
│ │ ├── store/ # State Management خاص بالميزة
│ │ ├── types/ # Types/Interfaces خاصة بالميزة
│ │ └── pages/ # صفحات الميزة
│ └── ...
│
├── shared/ # 🟢 الموارد المشتركة (Shared)
│ ├── components/ # مكونات عامة قابلة لإعادة الاستخدام
│ ├── hooks/ # Hooks عامة
│ ├── utils/ # دوال مساعدة
│ └── constants/ # ثوابت عامة
│
├── core/ # 🔴 البنية التحتية (Core Infrastructure)
│ ├── api/ # تهيئة API و Interceptors
│ ├── store/ # تهيئة الـ Store العام
│ ├── query/ # تهيئة React Query
│ └── router/ # تهيئة Router
│
└── types/ # ⚫ أنواع عامة (Global Types)

1. شروط بناء كل طبقة
   الميزات (Features Layer)
   التعريف
   هذه الطبقة تحتوي على كل ما يخص ميزة معينة في التطبيق. كل ميزة مستقلة بذاتها قدر الإمكان.

الشروط
كل ميزة تكون في مجلد منفصل باسم feature-name

لا يمكن لميزة أن تعتمد على ميزة أخرى مباشرة (إذا احتاجت، يتم عبر الـ Shared)

يمكن حذف مجلد ميزة كامل دون أن يتأثر باقي التطبيق

كل ميزة تحتوي على المجلدات الفرعية المذكورة أعلاه (حسب الحاجة)

مثال

features/
├── students/ # ميزة الطلاب
├── groups/ # ميزة الشعب
├── assessments/ # ميزة الاختبارات
└── enrollment/ # ميزة التسجيل

2. طبقة المكونات (Components Layer)

التعريف
المكونات مسؤولة فقط عن عرض واجهة المستخدم. لا تحتوي على أي منطق أعمال أو استدعاءات API مباشرة.

الشروط
المكون لا يستدعي API مباشرة أبداً

المكون لا يحتوي على منطق معقد (أكثر من 10-15 سطر)

المكون يستقبل البيانات عبر Props من الصفحة أو الـ Hooks

المكون يرسل الأحداث (Events) عبر Props للخارج

المكونات العامة توضع في shared/components

المكونات الخاصة توضع في features/feature-name/components

طريقة البناء
// ✅ صحيح
const StudentCard = ({ student, onEdit, onDelete }) => {
return (
<div>
<h3>{student.name}</h3>
<button onClick={() => onEdit(student)}>تعديل</button>
</div>
);
};

// ❌ خطأ
const StudentCard = ({ studentId }) => {
const [student, setStudent] = useState();

// لا! المكون لا يستدعي API
useEffect(() => {
api.getStudent(studentId).then(setStudent);
}, [studentId]);

return <div>...</div>;
};

3. طبقة الـ Hooks (Hooks Layer)

التعريف
الـ Hooks هي المسؤولة عن منطق التطبيق وإدارة الحالة وجلب البيانات.

الشروط
كل Hook له مسؤولية واحدة واضحة

أسماء Hooks تبدأ بـ use (مثل useStudents)

Hooks الجلب (Queries) تنتهي بـ Query (مثل useStudentsQuery)

Hooks التغيير (Mutations) تنتهي بـ Mutation (مثل useCreateStudentMutation)

Hooks لا تتعامل مع الـ UI مباشرة (لا return JSX)

Hooks العامة توضع في shared/hooks

Hooks الخاصة توضع في features/feature-name/hooks

أنواع Hooks
النوع المسؤولية مثال
Query Hook جلب بيانات من API useStudentsQuery
Mutation Hook تغيير بيانات في API useCreateStudentMutation
Form Hook إدارة النماذج useStudentForm
UI State Hook إدارة حالة واجهة المستخدم useToggle, usePagination

طريقة البناء
// ✅ Query Hook
export const useStudentsQuery = (filters) => {
return useQuery({
queryKey: ['students', filters],
queryFn: () => studentService.getAll(filters)
});
};

// ✅ Mutation Hook
export const useCreateStudentMutation = () => {
const queryClient = useQueryClient();

return useMutation({
mutationFn: (data) => studentService.create(data),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['students'] });
}
});
};

4. طبقة الـ Services (Services Layer)
   التعريف
   الـ Services هي المسؤولة عن التواصل مع الـ API وتحويل البيانات.

الشروط
كل Service مخصص لكيان واحد (StudentService, GroupService)

الـ Service لا يخزن أي حالة (Stateless)

الـ Service يعيد وعد (Promise) دائماً

الـ Service يحول الأخطاء القادمة من API إلى رسائل مفهومة

الـ Service يستخدم TResult pattern مثل الباك إند

⚠️ **تحذير هام بخصوص Axios:** نظراً لأن تطبيقنا يستخدم Interceptor في `core/api/index.ts` يقوم بإرجاع `response.data` مباشرة، **يمنع منعاً باتاً** استخدام `.then(res => res.data)` أو استخراج `.data` داخل الـ Services. الاستدعاء مثل `api.get` يُرجع بيانات الخادم (TResult) مباشرة. يجب إجبار النوع (Casting) لتجنب أخطاء TypeScript، مثلاً: `as unknown as Promise<TResult<T>>` أو الانتظار `await` ثم إعطاء النوع كالتالي `as unknown as TResult<T>`.

طريقة البناء
// studentService.ts
export const studentService = {
getAll: async (params?: StudentFilter): Promise<TResult<Student[]>> => {
return (await api.get('/students', { params })) as unknown as TResult<Student[]>;
},

getById: (id: string): Promise<TResult<Student>> => {
return api.get(`/students/${id}`) as unknown as Promise<TResult<Student>>;
},

create: (data: CreateStudentDTO): Promise<TResult<string>> => {
return api.post('/students', data) as unknown as Promise<TResult<string>>;
}
};

5. طبقة الـ Store (State Layer)

التعريف
الـ Store هو المسؤول عن إدارة الحالة المحلية للتطبيق (Local State).

الشروط
كل ميزة لها Store خاص بها (في مجلد store داخل الميزة)

الـ Store لا يحتوي على منطق API (هذا دور الـ Hooks)

الـ Store يحتوي على:

State: البيانات المحلية

Actions: الدوال التي تغير الحالة

Selectors: الدوال التي تستعلم من الحالة

يتم استخدام Zustand أو Redux Toolkit

لا يتم تخزين بيانات قادمة من API في الـ Store (تخزن في React Query Cache)

طريقة البناء
// studentStore.ts
interface StudentStore {
// State
selectedStudentId: string | null;
filters: StudentFilter;
localStudents: Student[]; // فقط للبيانات المحلية

// Actions
setSelectedStudent: (id: string | null) => void;
setFilters: (filters: Partial<StudentFilter>) => void;
addLocalStudent: (student: Student) => void;

// Selectors
getFilteredLocalStudents: () => Student[];
}

export const useStudentStore = create<StudentStore>((set, get) => ({
// Implementation
}));

6. طبقة الـ Types (Types Layer)
   التعريف
   الـ Types تحدد شكل البيانات في التطبيق.

الشروط
كل كيان له Type خاص به

الـ Types تطابق الـ DTOs في الباك إند

الـ Validators (Zod) تكون بجانب الـ Types

الـ Types العامة توضع في types الرئيسي

الـ Types الخاصة توضع في features/feature-name/types

طريقة البناء
typescript
// student.types.ts
// ⚠️ هام: التسمية هنا يجب أن تطابق الباك إند تماماً (PascalCase) كما في كلاسات الـ Domain و الـ DTOs

export interface Student {
    Id: string;
    FirstName: string;
    FatherName: string;
    LastName: string;
    NationalNumber?: string;
    BirthDate: string;
    IsActive: boolean;
}

export interface CreateStudentDTO {
    FirstName: string;
    FatherName: string;
    LastName: string;
    NationalNumber?: string;
    BirthDate: string;
}

// student.validators.ts
export const CreateStudentSchema = z.object({
firstName: z.string().min(2),
fatherName: z.string().min(2),
lastName: z.string().min(2)
}); 7. طبقة الـ Infrastructure (Core Layer)
التعريف
الطبقة الأساسية التي تهيئ وتضبط الأدوات والتقنيات المستخدمة.

المسؤوليات
API Layer
تهيئة Axios instance

إضافة Interceptors للطلبات والردود

معالجة الأخطاء المركزية

إضافة Headers (مثل Authorization Token)

Query Layer
تهيئة React Query Client

ضبط الإعدادات العامة (staleTime, cacheTime)

إضافة DevTools

Store Layer
تهيئة الـ Root Store

إضافة Middlewares (مثل persistence)

Router Layer
تهيئة React Router

تعريف المسارات العامة

حماية المسارات (Protected Routes)

الشروط
الـ Core لا يحتوي على أي منطق خاص بميزة معينة

أي تغيير في التقنيات يتم هنا فقط

يتم تهيئة كل شيء مرة واحدة عند بدء التطبيق

تدفق البيانات (Data Flow)
لجلب البيانات (Read/Query)
text
Page/Component
→ Custom Hook (useQuery)
→ Service (API Call)
→ Infrastructure (Axios)
→ API
← Store (Caching)
← Page/Component يعرض البيانات
لتغيير البيانات (Write/Command)
text
Page/Component (User Action)
→ Custom Hook (useMutation)
→ Service (API Call)
→ Infrastructure (Axios)
→ API
← Mutation Result
← React Query invalidates cache
← UI تحديث تلقائي
للحالة المحلية (Local State)
text
Component Event
→ Store Action
→ State Update
→ Selector Re-run
→ Component Re-render
قواعد التسمية والـ Naming Conventions
العنصر القاعدة مثال
مجلدات الميزات kebab-case student-management
ملفات المكونات PascalCase StudentCard.tsx
ملفات الـ Hooks camelCase + use useStudents.ts
ملفات الـ Services camelCase studentService.ts
ملفات الـ Store camelCase studentStore.ts
ملفات الـ Types camelCase student.types.ts
ملفات الـ Validators camelCase student.validators.ts
خصائص البيانات (Properties) مطابقة لـ C# (PascalCase) FirstName, AddressID, BirthDate

قواعد الـ API و الـ Responses
1. كل الردود (Responses) القادمة من الباك إند تكون مغلفة بنمط الـ TResult كما هو معرف في System.Application/Common/TResult.cs.
2. لا تستخدم نمط التسمية الخاص بـ JavaScript (camelCase) في خصائص واجهات الـ Types المُرسلة والمُستردة من الخادم، بل التزم حصرياً بنمط PascalCase المُتبع في الـ Domain والـ DTOs في الباك إند.
3. التوافق التام مع الـ Controller: في طبقة الـ Services (`FrontService`)، يجب كتابة استدعاءات الـ API تماماً كما هي معرفة في الـ Controller في الباك إند:
   - الالتزام التام بعدد وأسماء المتغيرات (Parameters).
   - الالتزام التام بالمناداة الصحيحة للمسار الدقيق (Endpoint Route).
   - الالتزام الكامل بنوع طلب الـ HTTP المُستخدم (`GET`, `POST`, `PUT`, `DELETE`).

قواعد التنظيم الداخلي للملف
ترتيب الواردات (Import Order)
typescript
// 1. مكتبات خارجية
import React from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. مكتبات داخلية (من core)
import { api } from '@/core/api';

// 3. مكونات مشتركة
import { Button } from '@/shared/components';

// 4. مكونات من الميزة
import { StudentCard } from '../components';

// 5. Hooks
import { useStudentStore } from '../store';

// 6. Types
import { Student } from '../types';

// 7. Styles
import './styles.css';
معالجة الأخطاء (Error Handling)
هرمية معالجة الأخطاء
text
API Error (من الباك إند)
→ Axios Interceptor (تحويل الخطأ)
→ Service (تغليف الخطأ)
→ Hook (تمرير الخطأ)
→ UI Component (عرض الخطأ)
أنواع الأخطاء ومعالجتها
نوع الخطأ المعالج طريقة العرض
Network Error Axios Interceptor Toast notification
Validation Error Form Hook رسالة بجانب الحقل
Unauthorized (401) Axios Interceptor تحويل إلى صفحة تسجيل الدخول
Forbidden (403) Axios Interceptor Toast + تسجيل خروج
Not Found (404) React Router صفحة 404
Server Error (500) Axios Interceptor Toast + تسجيل في Sentry
اختبارات (Testing) - للهيكلية فقط
مستويات الاختبار المطلوبة
اختبار الوحدة (Unit Tests)

اختبار الـ Services

اختبار الـ Hooks المنطقية

اختبار الـ Store Actions

اختبار المكونات (Component Tests)

اختبار rendering

اختبار user interactions

اختبار التكامل (Integration Tests)

اختبار تدفق كامل لميزة

موقع ملفات الاختبار
text
feature-name/
├── components/
│ ├── StudentCard.tsx
│ └── **tests**/
│ └── StudentCard.test.tsx
├── hooks/
│ ├── useStudents.ts
│ └── **tests**/
│ └── useStudents.test.ts
└── services/
├── studentService.ts
└── **tests**/
└── studentService.test.ts

8. التعامل مع النماذج والتحقق (Forms & Validation)
التعريف
النظام يعتمد على مكتبة `react-hook-form` للتعامل مع النماذج، ومكتبة `zod` للتحقق من صحة البيانات (Validation).

قواعد هامة لتجنب الفشل الصامت (Silent Failures):
- **القيم الافتراضية (Default Values):** يجب دائماً تمرير جميع الحقول (بما فيها المُعرّفات مثل `Id` أو `CountryID`) المذكورة في الـ Schema داخل `defaultValues` عند تعريف `useForm`، حتى لـو كانت قيمتها الأولية فارغة (`""`). تجاهل تمرير أي حقل سيؤدي لتجاهله من قِبل React Hook Form وفشل التحقق لاحقاً وعدم إرساله في الـ Request.
- **تعبئة بيانات التعديل (Populating Edit Data):** يُفضل دائماً استخدام دالة `reset(data)` داخل خطاف `useEffect` لتعبئة نموذج الـ Edit بالبيانات القادمة من الباك-إند بدلاً من استخدام `setValue` لكل حقل على حدة؛ فهذا يضمن تحديث وتسجيل الحقول كاملة لتجاوز التحقق بشكل سليم.
- **مرونة التحقق من الـ IDs في Zod:** تجنب استخدام القيود الصارمة جداً للـ IDs مثل `.uuid()` لأن الـ GUIDs المتولدة من الـ C# أو المُدخلة يدوياً في مرحلة التطوير قد تختلف وتتسبب في فشل العملية بصمت. استخدم بدلاً من ذلك `.min(1)` لضمان وصول الطلب وعدم توقف الواجهة.
- **تتبع الأخطاء (Error Debugging):** لتجنب الأخطاء الصامتة وصعوبة التتبع أثناء التطوير، يُنصح دائماً بتمرير دالة خطأ لطباعة المشاكل في الكونسول هكذا: `onSubmit={handleSubmit(onSubmit, (err) => console.log(err))}`.

9. نمط تصميم الصفحات والجداول (Pages & Tables Design Pattern)
التعريف
توحيد التخطيط المعماري لصفحات الإدارة (CRUD Pages) بحيث تدعم التحديد المتعدد، الفلاتر الذكية، والملاحة بين الكيانات الأب والابن بكل سلاسة.

تخطيط الصفحة الأساسي (Page Layout Diagram):
```text
tableData<TableTitle> , addAction
Filters
-------------------
    dataRows
-------------------
Actions{Update,Delete,Details,ChildrenDetails}
```

هيكل الصفحة بالتفصيل (Page Structure):
1. **الترويسة والفلاتر (Header & Filters):**
   - `tableData<TableTitle>` و `addAction`: عنوان الصفحة وزر الإضافة الأساسي في الأعلى.
   - `Filters`: شريط فلاتر أسفل العنوان مباشرة للبحث وتصفية الجدول.
2. **الجدول (Data Table / Grid):**
   - يحتوي على البيانات (`dataRows`).
   - **التحديد المتعدد (MultiSelect):** يجب أن يحتوي الجدول على Checkboxes لاختيار (تحديد) عدة صفوف معاً لإجراء عمليات عليها.
   - **الضغط على الصف (Row Click):** النقر المباشر على أي `dataRow` يفتح نافذة منبثقة (Popup) بداخلها بطاقة الكيان (`Entity Card`) لعرض تفاصيله السريعة.
   - **الجداول المدمجة وقابلة لإعادة الاستخدام (Reusable Tables):** يجب تصميم أي جدول (مثل `CityTable`) بحيث يقبل تمرير فلاتر أو محددات بحث (مثل البحث داخله عن طريق `CountryID`) ليتم استخدامه كجدول أساسي في صفحة، أو كجدول أبناء (Children) داخل صفحة تفاصيل.
3. **شريط الإجراءات (Actions Bar):**
   - يتواجد أسفل الجدول ويحتوي عمليات لا نهائية وقابلة للإضافة بكل مرونة. أمثلة: `{Update, Delete, Details, ChildrenDetails}`.

إدارة الفلاتر وحقن البيانات (Filters & State Preservation):
- **حفظ الفلاتر (Preserving FILTERS in State):** عندما يتم البحث أو فلترة أي جدول، يجب حفظ هذه الفلاتر داخل الـ State من أجل إعادة استخدامها في التعامل القادم مع البيانات.
- **الاستباقية في الإضافة (Auto-Filling Add Forms):** إذا تم فتح زر `Add` الخاص بالجدول وكان هذا الجدول مفلتراً مسبقاً بـ (`ID` لكيان أب)، يجب أن يقوم نموذج الإضافة بتعبئة المُعرّف الأبوي تلقائياً. 
  *(مثال: أنت داخل `CityTable` وتم البحث فيه لجلب مدن دولة معينة `GetCitiesByCountryID`، عند ضغط الإضافة `AddCity` سيتم تلقائياً ملء حقل `CountryID` في الفورم بنفس الدولة المُفلتر بها الجداول).*

سلوك الإجراءات (Actions Behavior):
- **إجراءات فردية (Single-Row Actions):** مثل (`Update`). تعمل حصراً عند تحديد خلية/صف واحد، وتتحول إلى وضع التعطيل `Disabled` إذا تم اختيار أكثر من خلية.
- **إجراءات جماعية (Multi-Row Actions):** مثل (`Delete`). يمكنك أن تختار عدة أعمدة/صفوف من البيانات وتعمل إجراءات عليها دفعة واحدة، مثل تحديد العديد من البيانات والضغط على "حذف" ليتم مسحها كلها بضغطة واحدة.
- **أزرار التفاصيل (Details Actions):** تنقسم لنوعين أساسيين:
  1. **معلومات خاصة (Specific Info):** تعرض (`EntityCardInfo as Popup`) للكيان المحدد المباشر.
  2. **معلومات مفصلة / عامة (Detailed Info / Children):** للغوص في الكيانات التابعة (`TABLE OF CHILDREN`). 
     *(مثال: تحديد `Country` والضغط على "معلومات مفصلة"؛ سيذهب النظام لفتح مكون `CityTable` ويبحث داخله عبر دالة `GetCitiesByCountryID` لعرض مدن هذه الدولة حصراً).*

10. نمط التعامل مع المفاتيح الأجنبية (Foreign Keys - CardWithFilter Pattern)
التعريف
عند إضافة أو تعديل كائن يحتوي على مفتاح أجنبي لكائن آخر (مثال: إضافة `City` تتطلب تحديد الـ `Country` التابعة لها)، يتم عرض الحقول العادية كإدخالات طبيعية، أما خصائص المفاتيح الأجنبية فيجب الاعتماد فيها حصراً على المكون التفاعلي `CardWithFilter`.

آلية عمل المكون (CardWithFilter Behavior):
1. **الواجهة الظاهرية في الفورم (Initial State في الـ Form):** 
   - يعرض המكون مكان حقل المفتاح الأجنبي (وهمياً) اسماً يعبر عن الكيان المطلوب، وبجانبه زر **"اختيار (Select)"** طالما لم يتم اتخاذ اختيار بعد.

2. **مكونات نافذة البحث الداخلية (Inner Search Components):** عند الضغط على اختيار، تظهر نافذة متقدمة للفلترة تحتوي على:
   - **مربع إدخال البحث (SearchInputBox):** يستقبل نص البحث من المستخدم. في بعض الاستخدامات المتقدمة يتم ربطه بدالة `onChange` ديناميكية لجلب وعرض اقتراحات لحظية للمستخدم.
   - **تصنيف الفلترة (SearchByCombo):** قائمة تحدد أي عمود/حقل سيتم البحث داخله. 
     - ⚠️ **قاعدة صارمة:** يجب أن ينحصر البحث دائماً على الحقول التي تحمل معنى وتعد مميزة للمستخدم (مثل: الكود، الاسم المعرّف، وغيرها من الحقول الـ `Unique`). **يُمنع منعاً باتاً استدعاء إمكانية البحث المباشر عبر المعرف التقني `ID`.**
   - **زر البحث (Search Button):** 
     - عند الإرسال، يبحث عن القيمة في قاعدة البيانات. 
     - **عند النتيجة الناجحة:** يتم عرض بيانات النتيجة المفصلة داخل بطاقة كيان (`EntityCard`).
     - **عند الفشل وعدم العثور:** تظهر بطاقة الكيان بشكل رمادي ومُعطل (`Disabled`) وتحتوي على علامات استفهام `????` دلالة على عدم تواجد السجل.
   - **أزرار التحكم:** أزرار تأكيد `اختيار` وتراجع `إلغاء`.

3. **حالة ما بعد الاختيار (Post-Selection State):**
   - عند الضغط على "اختيار"، يعود مكون الـ `CardWithFilter` إلى الفورم الأب، جاحداً الكائن المختار **كاملاً** (وليس المعرف `ID` فقط) كما تم استلامه من الباك-إند ليُسهل معالجة البيانات الإضافية إذا لزم الأمر في الفورم.
   - تُستبدل الواجهة الظاهرية داخل الفورم لتعرض القيمة أو الاسم المعبر عن الكيان المبحوث عنه.
   - يُستبدل زر "اختيار" بزر **"تغيير / تبديل"**، وإلى جواره يتم وضع زر جديد **"إلغاء الاختيار"** لتمكين تفريغ الـ Foreign Key بحال كان غير إلزامي.

إشارات واختصارات
الإشارة المعنى
@/ المسار المطلق من مجلد src
features/ مجلد الميزات
shared/ مجلد الموارد المشتركة
core/ مجلد البنية التحتية
[ ] شرط يجب تحقيقه
✅ تطبيق صحيح
❌ تطبيق خاطئ
ملخص الشروط النهائية
✅ شروط النجاح للمشروع
كل الميزات منفصلة في مجلدات مستقلة

لا يوجد استدعاء API مباشر من المكونات

كل Hook له مسؤولية واحدة

الـ Types متوافقة مع الباك إند

الـ Validators موجودة لجميع النماذج

معالجة الأخطاء مركزية في Interceptors

الـ Store لا يخزن بيانات API (تخزن في React Query)

إعادة الاستخدام مفعلة عبر shared folder

اختبارات للوحدات الأساسية موجودة

❌ ممنوعات (Do NOT)
لا تضع منطق API في المكونات

لا تخزن بيانات API في Zustand/Redux

لا تكرر الكود بين الميزات (استخدم shared)

لا تهمل معالجة الأخطاء

لا تستخدم any (استخدم TypeScript properly)

لا تضع كل شيء في مجلد واحد

لا تقم باستخراج `.data` من استجابات API داخل الـ Services، لأن الـ Interceptor يقوم بذلك مسبقاً!

11. نمط المفاتيح الأجنبية التفاعلية السريعة (Youtube-Style Autocomplete Pattern)
التعريف
هو النمط الحديث والأسرع للتعامل مع المفاتيح الأجنبية (Foreign Keys) ذات البيانات المرجعية الضخمة أو التي يتطلب اختيارها تدفقاً سريعاً من المستخدم المٌدخل (كالبحث عن دولة لتسجيل مدينة). هذا النمط يستبدل مكون `CardWithFilter` الثقيل بمربع بحث ديناميكي منسدل يشبه مربع بحث "يوتيوب" (Youtube-Style Autocomplete).

شروط ومتطلبات النمط (Pattern Guidelines):
1. **في الباك-إند (Backend API & CQRS):**
   - يجب تخصيص استعلام منفصل في ה-CQRS يستخدم `StartsWith` لتصفية السجلات بناءً على المقطع الذي يكتبه المستخدم (Prefix)، بدلاً من جلب كل السجلات.
   - للمحافظة على الأداء الاستثنائي، يجب أن يقتصر الرد على أفضل النتائج المتاحة (مثلاً استخدام `Take(20)` في الـ Repository).
   - مثال معماري: `SearchCountriesByNameQuery`.

2. **استراتيجية الواجهة (React Query & Debouncing):**
   - **تقييد النبض (Preventing API Spam):** يُمنع إرسال طلب سيرفر مع كل حرف إضافي يكتبه المستخدم.
   - يجب برمجة آلية `Debounce` (مؤقتหน่วง 500ms) عبر الـ `useState/useEffect` أو هوك مخصص، لتحديث دالة الحث فقط بعد استقرار يد المستخدم.
   - يجب دمج الرد مع حالة `isLoading / isFetching` الخاصة بـ React Query لتغذية الواجهة بحالة الشبكة المنطقية.

3. **المكون البصري السلس (MUI Autocomplete UX):**
   - يُبنى فوق مكون `<Autocomplete>` الغني من Material UI.
   - **`onInputChange`**: مخصص للاستماع لنبضات لوحة المفاتيح وتخزينها لحقنها في الـ Debounce.
   - **`onChange`**: معالج اختيار المستخدم النهائي القيمة لسحب الـ `UniqueID` وحقنها في حالة نموذج الإدخال (Form State عبر React Hook Form).
   - **تخصيص `renderOption`**: يُنصح بشدة تخصيص الخلايا المنسدلة لتعرض معلومات إضافية مزدوجة السطر (كاسم الدولة البارز بخط عريض، وكود الدولة تحته بخط رمادي باهت).
   - حقن مؤشر التحميل `<CircularProgress>` داخل صندوق البحث متى ما جاري البحث في الخلفية.

مثال هيكلي قياسي (Architecture Boilerplate):
```tsx
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  
  // 1. Debouncing User Input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm), 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // 2. Fetching via CQRS Generated Search Hook
  const { data: searchResults, isFetching } = useSearchCountriesQuery(debouncedTerm);
  const options = (searchResults as any)?.Value || [];

  // 3. UI Component Layer
  return (
    <Autocomplete
      options={options}
      loading={isFetching}
      getOptionLabel={(option) => option.CountryName || ""}
      onInputChange={(_, newVal) => setSearchTerm(newVal)}
      onChange={(_, selectedObj) => setValue("CountryID", selectedObj?.CountryID)}
      renderInput={(params) => (
         <TextField 
             {...params} 
             label="ابحث عن الدولة" 
             InputProps={{
                 ...params.InputProps,
                 endAdornment: (
                     <>
                        {isFetching ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                     </>
                 )
             }}
         />
      )}
      renderOption={(props, option) => (
         <li {...props} key={option.CountryID}>
            <div>
               <Typography>{option.CountryName}</Typography>
               <Typography color="textSecondary">Code: {option.CountryCode}</Typography>
            </div>
         </li>
      )}
    />
  );
```
تنبيهات معمارية (Warning):
- يُنصح بتطبيق هذا النمط متى كان إدخال البيانات متكرراً ويتطلب سرعة فائقة من مسؤول النظام المدخل للتسجيل.
- يُفضل إبقاء `CardWithFilter` للكيانات الكبرى جداً والتي تتطلب تصفحاً بطيئاً ومعلومات شمولية دقيقة قبل ربطها.
