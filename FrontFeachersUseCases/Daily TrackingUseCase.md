DailyTrackingFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateDailyTrackingCommand)
    
    بالنسبة لل SubjectID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api


  بالنسبة لل StudentID
       يتم البحث عن طريق رقم الهوية
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            NationalNumber
            FullName (FirstName + LastName )
        البيانات التي ستعرضها في ال Autocomplete
            NationalNumber // هذا بخط عريض وواضح
            FullName // هذا بخط مظلل و عادي
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api

  بالنسبة لل ScopeUnitTypeID
      يتم جلبها من api و ملئها في select 


        ال validations من ال Domain and FluentValidationsLever 


        
    