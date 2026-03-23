ScopeExecutionDetailFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateScopeExecutionDetailCommand)
    
    بالنسبة لل ScopeExecutionID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api


          بالنسبة لل GroupID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            GroupName
            Code
        البيانات التي ستعرضها في ال Autocomplete
            GroupName // هذا بخط عريض وواضح
            Code // هذا بخط مظلل و عادي

        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api


        بالنسبة لل ScopeUnitTypeID
            يتم وضعها في select و يتم جلبها من api


        ال validations من ال Domain and FluentValidationsLever 


        
    