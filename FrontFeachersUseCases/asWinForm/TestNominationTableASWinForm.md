using D:\Project\Real Proj\FromGit\QuranFront\FrontFeachersUseCases\asWinForm\test-nominations.md;


Class TestNominationsDTOInfo{
    var TestNominationID:guid
    var StudentEnrollmentID:guid?
    var NominatedByPersonID:guid?
    var ScopeID:guid?
    var ScopeType:String? // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution"
    var TargetName  // سيعبر عن MatterName أو ScopeName
    var StudentName
    var NominatedByPersonName
    var NominationStatus:enum
    var SuggestedDate:DateTime?
    var ActualDate:DateTime
    var NationalNumber string?   
}

class TestNominationsDtoFilter{
   var TargetName? as string
   var StudentName? as string
   var SuggestedDateFrom? as datetime
   var SuggestedDateTo? as datetime
   var NominationStatus? as enum
   var NationalNumber? as string
   var TestNominationID? as guid
}

/*
sql query 

DECLARE @NationalNumber NVARCHAR(12) = NULL;  
DECLARE @TargetName NVARCHAR(60) = NULL;  
DECLARE @StudentName NVARCHAR(60) = NULL;  
DECLARE @SuggestedDateFrom datetime = NULL;  
DECLARE @SuggestedDateTo datetime = NULL;  
DECLARE @NominationStatus int = NULL;  
select tn.Id as TestNominationID,
se.Id as StudentEnrollmentID,
Nbp.Id as NominatedByPersonID,
sed.Id as ScopeID,
ScopeType ='ScopeExecutionDetail',
m.Name as TargetName,
p.FirstName+' '+p.LastName as StudentName,
Nbp.FirstName+' '+nbp.LastName  as NominatedByPersonName,
tn.NominationStatus as NominationStatus,
tn.SuggestedDate as SuggestedDate,
ActualDate= 'No Column as ActualDate',
p.NationalNumber as NationalNumber

	from TestNominations as tn
inner join StudentEnrollments as se on tn.StudentEnrollmentID=se.Id
inner join Students as s on s.Id = se.StudentID
inner join People as p on p.Id=s.PersonID 
inner join ScopeExecutionDetails as sed on sed.Id = tn.ScopeExecutionDetailID
inner join Matters as m on m.Id = sed.MatterID 
left join People as Nbp on nbp.Id = tn.NominatedByPersonID 
WHERE (@NationalNumber IS NULL OR p.NationalNumber like '%'+@NationalNumber) and 
 (@TargetName IS NULL OR m.Name like '%'+@TargetName+'%') and 
 (@StudentName IS NULL OR (p.FirstName+' '+p.LastName) like '%'+@StudentName+'%') and 
 (@SuggestedDateFrom IS NULL OR tn.SuggestedDate >= @SuggestedDateFrom ) and 
 (@SuggestedDateTo IS NULL OR tn.SuggestedDate <= @SuggestedDateTo) and 
 (@NominationStatus IS NULL OR p.NationalNumber = @NominationStatus) 
 
union all 

select tn.Id as TestNominationID,
se.Id as StudentEnrollmentID,
Nbp.Id as NominatedByPersonID,
sex.Id as ScopeID,
ScopeType ='ScopeExecution',
sex.Name as TargetName,
p.FirstName+' '+p.LastName as StudentName,
Nbp.FirstName+' '+nbp.LastName  as NominatedByPersonName,
tn.NominationStatus as NominationStatus,
tn.SuggestedDate as SuggestedDate,
ActualDate= 'No Column as ActualDate',
p.NationalNumber as NationalNumber

	from TestNominations as tn
inner join StudentEnrollments as se on tn.StudentEnrollmentID=se.Id
inner join Students as s on s.Id = se.StudentID
inner join People as p on p.Id=s.PersonID 
inner join ScopeExecutions as sex on sex.Id = tn.ScopeExecutionID
left join People as Nbp on nbp.Id = tn.NominatedByPersonID 
WHERE (@NationalNumber IS NULL OR p.NationalNumber like '%'+@NationalNumber) and 
 (@TargetName IS NULL OR sex.Name like '%'+@TargetName+'%') and 
 (@StudentName IS NULL OR (p.FirstName+' '+p.LastName) like '%'+@StudentName+'%') and 
 (@SuggestedDateFrom IS NULL OR tn.SuggestedDate >= @SuggestedDateFrom ) and 
 (@SuggestedDateTo IS NULL OR tn.SuggestedDate <= @SuggestedDateTo) and 
 (@NominationStatus IS NULL OR p.NationalNumber = @NominationStatus) 
*/


 
class TestNominationsTableForm{

    void TestNominationsTableForm_onLoad(){
        TestNominationsDtoFilter Filter=new TestNominationsDtoFilter()
  datagridview.datasorce =   GetTestNominationsDTOInfoList(Filter);
    }

    list<TestNominationsDTOInfo> GetTestNominationsDTOInfoList(TestNominationsDtoFilter filter)
    {
    var result = await api/GetTestNominationsInfoList/{filter}
    return result;
    }
    void UpdateBTN_clicked(){
         TestNominationsForm(testNominationID,studentEnrollmentID,scopeExecutionID,scopeExecutionDetailID,sominationStatus,suggestedDate);
    }
    void DeleteBTN_clicked(){
        api/Delete/{testNominationID};
    }
    void MakeTestBtn_clicked(){
        //TestForm(props)
    }
    void FilterForm_SubmittClicked(filter){
           datagridview.datasorce= GetTestNominationsDTOInfoList(Filter);

    }
}

FilterForm{
    TestNominationsDtoFilter Filters;
    filterForm_Load(){
        statusCombo.DataSorce = TestNominationStatus.GetValues(typeof(TestNominationStatus));// arabic
    }
}




// Set Suggested Date logig
if(nominationStatus == NominationStatus.Suggested){
    if(NominationStatus==pending)
    {
SetSuggestedDateAction.CanUse=true;
    }
    else{
        SetSuggestedDateAction.CanUse=false;
    }
}

يجب اضافة اجراء يفيد بالتال
تعيين زمن الترشيح
void SetSuggestedDate(testNominationID,studentEnrollmentID,scopeExecutionID,scopeExecutionDetailID,nominationStatus,suggestedDate){
 SetSuggestedDateForm frm = new SetSuggestedDateForm(testNominationID,studentEnrollmentID,scopeExecutionID,scopeExecutionDetailID,nominationStatus,suggestedDate);

 frm.ShowDialog();
}

//////////////
SetSuggestedDateForm Desigin
testNominationCard {
StudentName
TargetName
NominationStatus
SuggestedDate
NationalNumber
}
input =>DateTime.today()
SuggestedDate
