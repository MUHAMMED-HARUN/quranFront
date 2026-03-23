AssessmentScopeFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateAssessmentScopeCommand)
    
    بالنسبة لل ProgramID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api


          بالنسبة لل ParentScopeID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
        
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api


        بالنسبة لل ClassID
       يتم البحث عن طريق الاسم 
       استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الPerson عبر البحث عن رقم الهوية
        البيانات التي ستجلبها في ال onchange 
            id
            Name
            Level
        البيانات التي ستعرضها في ال Autocomplete
            Name // هذا بخط عريض وواضح
            Level // هذا بخط مظلل و عادي
        انشئ api جديدة و queryDto and ResponseDto لهذا ال Api

        بالنسبة لل InstituteClassID
                يجب ان يكون هناك 2 combo 
                الاولى لل Institute
                الثانية لل Class
                عند اختيار ال Institute
                يجب ان يتم تصفية ال Class بناء على ال Institute

        بالنسبة لل ScopeUnitTypeID
      هذه يتم جلبها من api و ملئها في select 

        ال validations من ال Domain and FluentValidationsLever 


        
    