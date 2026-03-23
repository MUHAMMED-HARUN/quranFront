ClassFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(CreateClassCommand)
        programID
            هذه يتم جلبها من ال ProgramFront
            استخدم Youtube-Style Autocomplete Pattern الذي يوجد توثيقه في ال @FrontUseCase.md لجلب الProgram عبر البحث عن رقم الهوية
            البيانات التي ستجلبها في ال onchange 
                id
                name
            البيانات التي ستعرضها في ال Autocomplete
                name // هذا بخط عريض وواضح
            
            انشئ api جديدة و queryDto and ResponseDto لهذا ال Api
        
        ال validations من ال Domain and FluentValidations


        
    