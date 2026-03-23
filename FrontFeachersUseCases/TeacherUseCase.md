TeacherFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(SetPersonAsTeacherCommand)
    بالنسبة لل PersonID
       يتم البحث عن طريق رقم الهوية
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            nationalNum
            fullName (First Name + LastName)
        البيانات التي ستعرضها في ال Autocomplete
            nationalNum // هذا بخط عريض وواضح
            fullName // هذا بخط مظلل و عادي
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api

        ال validations من ال Domain and FluentValidations


        
    