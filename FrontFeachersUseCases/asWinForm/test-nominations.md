TestNominationsForm

class TestNominationsCreate{

var TestNominationID?;
var ScopeExecutionID?;
var ScopeExecutionDetailID?;
var StudentEnrollmentID;
var NominationStatus ;
var SuggestedDate;
}


UserControl AoutoCompleteTextInput{
var Key;
var DisplayValue;  
}

Class TestNominationsForm(){

var TestNominationID?;
var StudentEnrollmentID;
var ScopeExecutionID?;
var ScopeExecutionDetailID?;
var NominationStatus;
var SuggestedDate;

    TestNominationsForm(testNominationID,studentEnrollmentID,scopeExecutionID,scopeExecutionDetailID,sominationStatus,suggestedDate){

        this.TestNominationID = testNominationID;
        this.StudentEnrollmentID = studentEnrollmentID;
        this.ScopeExecutionID = scopeExecutionID;
        this.ScopeExecutionDetailID = scopeExecutionDetailID;
        this.NominationStatus = nominationStatus;
        this.SuggestedDate = suggestedDate;

    }
void TestNominationsForm_Load(){
   var result= await GetStudentScopeRegisterUnionDtos(studentEnrollmentID);
   
    ScopeExecutionComboBox.DataSource = result.Where(x => x.Type == "ScopeExecution");
    ScopeExecutionComboBox.DisplayMember = "TargetName";
    ScopeExecutionComboBox.ValueMember = "ScopeID";

    ScopeExecutionDetailComboBox.DataSource = result.Where(x => x.Type == "ScopeExecutionDetail");
    ScopeExecutionDetailComboBox.DisplayMember = "TargetName";
    ScopeExecutionDetailComboBox.ValueMember = "ScopeID";
}
bool IsStudentHasNominationInScope(var studentEnrollmentId, scopeExecutionId, scopeExecutionDetailId){
    if(studentEnrollmentId == null){
        return;
    }
    var testNominations = GetTestNominationsByStudentEnrollmentId(studentEnrollmentId);
    if(testNominations.Count > 0){
        return false;
    }
    return true;

}
bool GetTestNominationsByStudentEnrollmentId(var studentEnrollmentId, var scopeExecutionId, var scopeExecutionDetailId){
 var result = await  api/TestNominations/GetTestNominationsByStudentEnrollmentId/{studentEnrollmentId}/{scopeExecutionId}/{scopeExecutionDetailId}

 return  result;
}

list<TestNominationsDto> GetTestNominationsByStudentEnrollmentId(var studentEnrollmentId){
    var result = await  api/TestNominations/GetTestNominationsByStudentEnrollmentId/{studentEnrollmentId}
    return result;
}

public class StudentScopeRegisterUnionDto
{
    public Guid Id { get; set; }
    public Guid StudentEnrollmentID { get; set; }
    public string StudentName { get; set; }
    public string TargetName { get; set; } // سيعبر عن MatterName أو ScopeName
    public EnrollmentStatus Status { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? CompletionDate { get; set; }
    public string? Notes { get; set; }
    public Guid ScopeID { get; set; }
    public string Type { get; set; } // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution"
}


list<StudentScopeRegisterUnionDto> GetStudentScopeRegisterUnionDtos(var studentEnrollmentId){
    var result = await  api/TestNominations/GetStudentScopeRegisterUnionDtos/{studentEnrollmentId}
    return result;
}
/*
back end.infrastructure logic =>
public async Task<List<StudentScopeRegisterUnionDto>> GetCombinedRegistersAsync(Guid studentEnrollmentId)
{
    // الجزء الأول: StudentScopeExecutionsDetailsRegister (InProgress)
    var detailsQuery = from sr in _context.Set<StudentScopeExecutionsDetailsRegister>()
                       join es in _context.Set<clsStudentEnrollment>() on sr.StudentEnrollmentID equals es.Id
                       join s in _context.Set<clsStudent>() on es.StudentID equals s.Id
                       join p in _context.Set<clsPerson>() on s.PersonID equals p.Id
                       join sexd in _context.Set<clsScopeExecutionDetail>() on sr.ScopeExecutionDetailID equals sexd.Id
                       join m in _context.Set<clsMatter>() on sexd.MatterID equals m.Id
                       where sr.StudentEnrollmentID == studentEnrollmentId 
                          && sr.Status == EnrollmentStatus.InProgress
                       select new StudentScopeRegisterUnionDto
                       {
                           Id = sr.Id,
                           StudentEnrollmentID = es.Id,
                           StudentName = p.FirstName + " " + p.LastName,
                           TargetName = m.Name, // اسم المادة
                           Status = sr.Status,
                           StartDate = sr.StartDate,
                           CompletionDate = sr.CompletionDate,
                           Notes = sr.Notes,
                           ScopeID = sexd.id,
                           Type = "ScopeExecutionDetail"
                       };

    // الجزء الثاني: EnrollStudentInScopeExecution (InProgress)
    var mainScopeQuery = from enr in _context.Set<EnrollStudentInScopeExecution>()
                         join s in _context.Set<clsStudent>() on enr.StudentID equals s.Id
                         join p in _context.Set<clsPerson>() on s.PersonID equals p.Id
                         join se in _context.Set<clsScopeExecution>() on enr.ScopeExecutionID equals se.Id
                         // هنا نفترض وجود علاقة أو ربط للـ StudentEnrollmentID إذا كان متاحاً في الكيان
                         where enr.Status == EnrollmentStatus.InProgress
                         select new StudentScopeRegisterUnionDto
                         {
                             Id = enr.Id,
                             StudentEnrollmentID = Guid.Empty, // أو الحقل المناسب إذا وجد
                             StudentName = p.FirstName + " " + p.LastName,
                             TargetName = se.Name, // اسم الـ Scope
                             Status = enr.Status,
                             StartDate = enr.StartDate,
                             CompletionDate = enr.CompletionDate,
                             Notes = enr.Notes,
                             ScopeID = se.id,
                             Type = "ScopeExecution"
                         };

    // دمج النتائج باستخدام Union
    var combinedQuery = detailsQuery.Union(mainScopeQuery);

    return await combinedQuery.ToListAsync();
}

*/
