الان ال DailyEvaluationForm ساقوم بشرح لك كيف اريده ان يعمل على نمط ال Win form و انت حوله الى react 

UserControl AoutoCompleteTextInput{
    var Key;
    var DisplayValue;   
}

class StudentScopeExecutionDetailMatterdto{
    var ScopeExecutionDetailID;
    var EnrollmentStudentID;
    var MatterID;
    var MatterName;
    var ScopeTo;
    var ScopeFrom;
    var ScopeUnitTypeID;
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



var StudentScopeExecutionDetailMatterdto GetStudentScopeExecutionDetailMatterdto(var studentEnrollmentId){
 return  ef.get(select SEXD.Id,es.Id,m.Id,m.Name,SEXD.ScopeFrom,SEXD.ScopeTo,SEXD.ScopeUnitTypeID from StudentScopeExecutionsDetailsRegisters as SR
inner join StudentEnrollments As ES on ES.Id = SR.StudentEnrollmentID
inner join Students as s on s.id= ES.StudentID
inner join People as p on p.Id = s.PersonID
inner join ScopeExecutionDetails as SEXD on SEXD.Id=SR.ScopeExecutionDetailID
inner join Matters as m on m.Id = SEXD.MatterID
where SR.Status =1).toList();
}.