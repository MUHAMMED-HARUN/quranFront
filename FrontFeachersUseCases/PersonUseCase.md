personFront

الTable 
فيه ال Actions
    حذف
    تعديل
    عرض بيانات (Card)
    
الForm
    استدعي ال Api Create(AddPersonWithAddressCommand)
    بالنسبة لل addressID
        CountryID 
        CityID
        DistrictID
        AddressDetails
        لكل مفتاح اجنبي ComboBox
        يتم ملئ combo باسماء الدول و اذا اختار دولة يجلب المدن الخاصة بها في ال ComboBox
        و اذا اختار مدينة يجلب المناطق الخاصة بها في ال ComboBox
        و اذا اختار منطقة يجلب الاحياء الخاصة بها في ال ComboBox

        ال validations من ال Domain and FluentValidations


        
    