 class CreateTestCommand{
 public Guid TestNominationID { get; private set; }
 public TesterType TesterType { get; private set; }// LogedIn User.Type
 public Guid TesterID { get; private set; }// LogedIn User.Id
 public DateTime ActualExamDate { get; private set; } //DateTime.Now
 public SessionStatus SessionStatus { get; private set; }// InProgress = 1
 public string? Notes { get; private set; }
 }
 
 class TestSessionDTOInfo{
    public Guid TestSessionID { get; set; }
    public Guid TestNominationID { get; set; }
    public string StudentName { get; set; }
    public Guid ScopeID { get; set; }
    public string ScopeType { get; set; } // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution"
    public string TargetName { get; set; }
    public DateTime SuggestedDate { get; set; }
    public DateTime ActualExamDate { get; set; }
    public string TesterName { get; set; }
    public string TesterType { get; set; }
    public string TesterID { get; set; }
    public string SessionStatus { get; set; }
    public string Notes { get; set; }
 }
class TestSessionDTOInfoFilter{
    public Guid? TestSessionID { get; set; }//Dont show it in front
    public Guid? TestNominationID { get; set; }//Dont show it in front
    public string? StudentName { get; set; }
    public Guid? ScopeID { get; set; }//Dont show it in front
    public string? ScopeType { get; set; } // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution"// show it as enum
    public string? TargetName { get; set; }
    public DateTime? SuggestedDateFrom { get; set; }
    public DateTime? SuggestedDateTo { get; set; }
    public DateTime? ActualExamDateFrom { get; set; }
    public DateTime? ActualExamDateTo { get; set; }
    public string? TesterName { get; set; }
    public string? TesterType { get; set; }
    public string? TesterID { get; set; }//Dont show it in front
    public string? SessionStatus { get; set; }
    public string? Notes { get; set; }
}

From D:\Project\Real Proj\FromGit\QuranFront\src\features\test-nominations\types\testNomination.types.ts
export interface TestNominationsDTOInfo {
  TestNominationID: string;
  StudentEnrollmentID?: string | null;
  NominatedByPersonID?: string | null;
  ScopeID?: string | null;
  ScopeType: string;
  TargetName: string;
  StudentName: string;
  NominatedByPersonName: string;
  NominationStatus: number;
  SuggestedDate?: string | null;
  NationalNumber: string;
}
from D:\Project\Real Proj\FromGit\QuranFront\src\features\test-nominations\components\TestNominationCard.tsx
testNominationCard {
StudentName
TargetName
NominationStatus
SuggestedDate
NationalNumber
}





class TestSessionForm{

CreateTestCommand command = new CreateTestCommand();
TestSessionDTOInfo testSessionDTOInfo = new TestSessionDTOInfo();

 TestSessionForm(testNominationID,TestSessionID){
    this.command.TestNominationID=testNominationID;
    if(TestSessionID!=null||TestSessionID!=Guid.Empty){
    this.testSessionDTOInfo.TestSessionID=TestSessionID;
    }

 }

    void TestSessionForm_onLoad(){

    testNominationCard(testNominationID);

    if(testSessionDTOInfo.TestSessionID!=null||testSessionDTOInfo.TestSessionID!=Guid.Empty)
    {
        testSessionForm.Inputs=createTestCommand;// Update Mode
    }
    else
    {
        testSessionForm.Inputs=createTestCommand;// Create Mode
    }
    }
    

    void CreateBtn_Click(){
     api/TestSession/CreateTestCommand   
    }

    void UpdateBtn_Click(){
     api/TestSession/UpdateTestCommand   
    }


}









class TestSessionTableForm{
TestSessionDTOInfoFilter Filter = new TestSessionDTOInfoFilter();
TestSessionDTOInfo dto = new TestSessionDTOInfo();


    void TestSessionTableForm_onLoad(){
     datagridview.datasorce= await api/TestSession/GetFilteredItems(Filter);
    }

    void SearchBtn_Click(){
     datagridview.datasorce= await api/TestSession/GetFilteredItems(Filter);   
    }

    void ShowTestSessionCard(TestSessionID){
        TestSessionCardForm form = new TestSessionCardForm(TestSessionID);
        form.ShowDialog();
    }

    void  TestResultDetailAdd(){
        TestResultDetailForm form = new TestResultDetailForm(TestSessionID);
        form.ShowDialog();
    }

    void ShowTestResultDetail(TestSessionID){
        TestResultDetailTableForm form = new TestResultDetailTableForm(TestSessionID);
        form.ShowDialog();
    }
}



class TestSessionCardForm{
    TestSessionDTOInfo dto = new TestSessionDTOInfo();

    void TestSessionCardForm_onLoad(TestSessionID){
        dto = await api/TestSession/GetFilteredItems(TestSessionID);
    }
}

class TestResultDetailDtoInfo{
     public Guid TestSessionID { get; set; }
    public string StudentName { get; set; }
    public Guid ScopeID { get; set; }
    public string ScopeType { get; set; } // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution" 
    public string TargetName { get; set; }
    public DateTime ActualExamDate { get; set; }
    public decimal Score { get; set; }
    public string EvaluationLevel { get; set; }
    public string Notes { get; set; }
}
TestResultDetailDtoInfoFilter{
    public Guid? TestSessionID { get; set; }//Dont show it in front
    public string? StudentName { get; set; }
    public Guid? ScopeID { get; set; }//Dont show it in front
    public string? ScopeType { get; set; } // تمييز المصدر: "ScopeExecutionDetail" أو "ScopeExecution"// show it as enum
    public string? TargetName { get; set; }
    public DateTime? ActualExamDateFrom { get; set; }
    public DateTime? ActualExamDateTo { get; set; }
    public decimal? ScoreFrom { get; set; }
    public decimal? ScoreTo { get; set; }
    public string? EvaluationLevel { get; set; }
    public string? Notes { get; set; }
}
CreateTestResultDetailCommand{
    public Guid TestSessionID { get; set; }
    public Guid? ScopeExecutionID { get; set; }
    public Guid? ScopeExecutionDetailID { get; set; }
    public decimal? Score { get; set; }
    public EvaluationLevel? EvaluationLevel { get; set; }
    public string? Notes { get; set; }
}


class TestResultDetailForm{

    CreateTestResultDetailCommand command = new CreateTestResultDetailCommand();
    TestResultDetailDTOInfo dto = new TestResultDetailDTOInfo();

    TestResultDetailForm(TestSessionID){
        this.command.TestSessionID=TestSessionID;
    }

    void TestResultDetailForm_onLoad(){
        testSessionCard(TestSessionID);

        if(dto.TestResultDetailID!=null||dto.TestResultDetailID!=Guid.Empty)
        {
            testResultDetailForm.Inputs=createTestResultDetailCommand;// Update Mode
        }
        else
        {
            testResultDetailForm.Inputs=createTestResultDetailCommand;// Create Mode
        }
    }

    void CreateBtn_Click(){
     api/TestResultDetail/CreateTestResultDetailCommand   
    }

    void UpdateBtn_Click(){
     api/TestResultDetail/UpdateTestResultDetailCommand   
    }
}

class TestResultDetailTableForm{
    TestResultDetailDTOInfoFilter Filter = new TestResultDetailDTOInfoFilter();
    TestResultDetailDTOInfo dto = new TestResultDetailDTOInfo();

    void TestResultDetailTableForm_onLoad(){
        datagridview.datasorce= await api/TestResultDetail/GetFilteredItems(Filter);
    }

    void SearchBtn_Click(){
        datagridview.datasorce= await api/TestResultDetail/GetFilteredItems(Filter);   
    }

    void ShowTestResultDetail(TestResultDetailID){
        TestResultDetailCardForm form = new TestResultDetailCardForm(TestResultDetailID);
        form.ShowDialog();
    }
}

class TestResultDetailCardForm{
    TestResultDetailDTOInfo dto = new TestResultDetailDTOInfo();

    void TestResultDetailCardForm_onLoad(TestResultDetailID){
        dto = await api/TestResultDetail/GetFilteredItems(TestResultDetailID);
    }
}








using System;
using System.Domain.BaseClasses;
using System.Domain.Enums.Assessment;
using System.Domain.Exceptions;

namespace System.Domain.Entities.Assessments
{
    public class TestResultDetail : clsBaseClass
    {
        public Guid TestSessionID { get; private set; }
        public Guid? ScopeExecutionID { get; private set; }
        public Guid? ScopeExecutionDetailID { get; private set; }
        public decimal? Score { get; private set; }
        public EvaluationLevel? EvaluationLevel { get; private set; }
        public string? Notes { get; private set; }

        public TestSession? TestSession { get; private set; }
        public clsScopeExecution? ScopeExecution { get; private set; }
        public clsScopeExecutionDetail? ScopeExecutionDetail { get; private set; }

        protected TestResultDetail() { }

        public TestResultDetail(Guid testSessionId, Guid? scopeExecutionId = null, Guid? scopeExecutionDetailId = null, decimal? score = null, EvaluationLevel? evaluationLevel = null, string? notes = null)
        {
            if (testSessionId == Guid.Empty) throw new DomainException(DomainExMsg.TestResultDetail_TestSessionIDRequired);
            
            if (!scopeExecutionId.HasValue && !scopeExecutionDetailId.HasValue)
                throw new DomainException(DomainExMsg.TestResultDetail_ScopeSelectionRequired);

            if (scopeExecutionId.HasValue && scopeExecutionId.Value == Guid.Empty)
                throw new DomainException(DomainExMsg.TestResultDetail_ScopeSelectionRequired);

            if (scopeExecutionDetailId.HasValue && scopeExecutionDetailId.Value == Guid.Empty)
                throw new DomainException(DomainExMsg.TestResultDetail_ScopeSelectionRequired);

            if (!score.HasValue && !evaluationLevel.HasValue) throw new DomainException(DomainExMsg.TestResultDetail_ScoreOrEvaluationRequired);

            TestSessionID = testSessionId;
            ScopeExecutionID = scopeExecutionId;
            ScopeExecutionDetailID = scopeExecutionDetailId;
            Score = score;
            EvaluationLevel = evaluationLevel;
            Notes = notes;
        }

        public void SetTestSessionID(Guid value)
        {
            if (value == Guid.Empty) throw new DomainException(DomainExMsg.TestResultDetail_TestSessionIDRequired);
            TestSessionID = value;
        }

        public void SetScopeExecutionID(Guid? value)
        {
            if (value.HasValue && value.Value == Guid.Empty) throw new DomainException(DomainExMsg.TestResultDetail_ScopeSelectionRequired);
            ScopeExecutionID = value;
        }

        public void SetScopeExecutionDetailID(Guid? value)
        {
            if (value.HasValue && value.Value == Guid.Empty) throw new DomainException(DomainExMsg.TestResultDetail_ScopeSelectionRequired);
            ScopeExecutionDetailID = value;
        }

        public void SetScore(decimal? value)
        {
            Score = value;
            ValidateScoreOrEvaluation();
        }

        public void SetEvaluationLevel(EvaluationLevel? value)
        {
            EvaluationLevel = value;
            ValidateScoreOrEvaluation();
        }

        public void SetNotes(string? value)
        {
            Notes = value;
        }

        private void ValidateScoreOrEvaluation()
        {
            if (!Score.HasValue && !EvaluationLevel.HasValue) 
                throw new DomainException(DomainExMsg.TestResultDetail_ScoreOrEvaluationRequired);
        }

        public bool IsPassed()
        {
            if (EvaluationLevel.HasValue)
            {
                return EvaluationLevel.Value == Enums.Assessment.EvaluationLevel.Excellent || 
                       EvaluationLevel.Value == Enums.Assessment.EvaluationLevel.VeryGood || 
                       EvaluationLevel.Value == Enums.Assessment.EvaluationLevel.Good;
            }
            if (Score.HasValue)
            {
                return Score.Value >= 50; 
            }
            return false;
        }
    }
}
