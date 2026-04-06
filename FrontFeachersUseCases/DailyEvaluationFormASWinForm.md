الان ال DailyEvaluationForm ساقوم بشرح لك كيف اريده ان يعمل على نمط ال Win form و انت حوله الى react 

UserControl AoutoCompleteTextInput{
    var Key;
    var DisplayValue;   
}

class StudentScopeExecutionDetailMatterdto{
    var ScopeExecutionDetailID;
    var MatterID;
    var MatterName;
}

class SearchStudentDto{
    var Id;
    var NationalNumber;
    var FullName;
}

DailyEvaluationForm{

`var studentId="",groupId="",studentName="",groupName="",studentEnrollmentId="",nationalNumber="";

    DailyEvaluationForm(studentId,groupId,studentName,groupName,studentEnrollmentId,nationalNumber){

        this.studentId = studentId;
        this.groupId = groupId;
        this.studentName = studentName;
        this.groupName = groupName;
        this.studentEnrollmentId = studentEnrollmentId;
        this.nationalNumber = nationalNumber;
    }
    void DailyEvaluationForm_Load(){
        AoutoCompleteTextInput studentNameInput = new AoutoCompleteTextInput();
        studentNameInput.Key = studentId;
        studentNameInput.DisplayValue = studentName;

        AoutoCompleteTextInput groupNameInput = new AoutoCompleteTextInput();
        groupNameInput.Key = groupId;
        groupNameInput.DisplayValue = groupName;
        
        if(studentEnrollmentId!=""){
            ComboBox DetailMatters = new ComboBox();
            DetailMatters.DataSource = GetStudentScopeExecutionDetailMatters(studentEnrollmentId);
            DetailMatters.DisplayMember = "MatterName";
            DetailMatters.ValueMember = "MatterID";
        }



    }

    list<StudentScopeExecutionDetailMatterdto> GetStudentScopeExecutionDetailMatters(var studentEnrollmentId ){
        var result = await api/StudentScopeExecutionsDetailsRegisters/GetStudentScopeExecutionDetailMatters?studentEnrollmentId={studentEnrollmentId}

        return result;
    }

    void studentNameInput_Changed(var nationalNumber){
     SearchStudentDto  dto = await  api/Students/search/{nationalNumber}
     studentId = dto.Id;
     studentName = dto.FullName;
     nationalNumber = dto.NationalNumber;

     studentNameInput.Key = studentId;
     studentNameInput.DisplayValue = studentName;

     if(groupId!=""){
        studentEnrollmentId = await api/StudentEnrollments/student/{studentId}/group/{groupId}
        if(studentEnrollmentId!=""){
            DetailMatters.DataSource = GetStudentScopeExecutionDetailMatters(studentEnrollmentId);
        }
     }
    }

    void groupNameInput_Changed(var name){
     SearchGroupDto  dto = await  api/Groups/search/{name}
     groupId = dto.Id;
     groupName = dto.GroupName;

     groupNameInput.Key = groupId;
     groupNameInput.DisplayValue = groupName;

     if(studentId!=""){
        studentEnrollmentId = await api/StudentEnrollments/student/{studentId}/group/{groupId}
        if(studentEnrollmentId!=""){
            DetailMatters.DataSource = GetStudentScopeExecutionDetailMatters(studentEnrollmentId);
        }
     }
    }

}