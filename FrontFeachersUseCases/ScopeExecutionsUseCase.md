ScopeExecutionsFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateScopeExecutionCommand)
    
    بالنسبة لل AssessmentScopeID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api



        ال validations من ال Domain and FluentValidationsLever 


        
    