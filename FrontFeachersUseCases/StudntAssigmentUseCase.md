StudentFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateStudentAssigmentCommand)
       بالنسبة لل StudentID
       يتم البحث عن طريق رقم الهوية
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الStudent عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            nationalNum
            fullName (First Name + LastName)
        البيانات التي ستعرضها في ال Autocomplete
            nationalNum // هذا بخط عريض وواضح
            fullName // هذا بخط مظلل و عادي
        

           بالنسبة لل GroupID
       يتم البحث عن طريق رقم الهوية
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الGroup عبر البحث عن اسم ال GROUP
        البيانات التي ستجلبها في ال onchange 
            id
            name
        البيانات التي ستعرضها في ال Autocomplete
            name // هذا بخط عريض وواضح

       
            انشئ api جديدة و queryDto and ResponseDto لهذا ال Api
        
        ال validations من ال Domain and FluentValidations


        
    