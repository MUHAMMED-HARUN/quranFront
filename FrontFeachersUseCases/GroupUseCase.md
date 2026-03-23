GroupFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    عرض الطلاب (EnrolledStudentsTable(FilterByGroupID))
    
الForm
    استدعي ال Api Create(CreateGroupCommand)
        InstitueClassID           
            كي يتم احضار هذه يجب ان يكون هناك ComboBox يخزن قيه ال Institutes
            وعند اختيار institute معين يتم احضار ال InstituteClasses الخاصة به
            و عرضها في ComboBox اخر

        
            انشئ api جديدة و queryDto and ResponseDto لهذا ال Api
        
        ال validations من ال Domain and FluentValidations


        
    