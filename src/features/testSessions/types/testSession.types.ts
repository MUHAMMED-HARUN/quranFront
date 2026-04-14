import { z } from "zod";
// import { NominationStatus } from '../../test-nominations/types/testNominations.types';

export enum TesterType {
  Teacher = 1,
  Committee = 2,
}

export enum SessionStatus {
  Scheduled = 1,
  InProgress = 2,
  Completed = 3,
  Cancelled = 4,
}

export interface TestSessionDto {
  Id: string;
  TestNominationID: string;
  TesterType: TesterType;
  TesterID: string;
  ActualExamDate: string;
  SessionStatus: SessionStatus;
  Notes?: string;

  // Read-only Presentation properties
  StudentName?: string;
  TesterName?: string;
}

export interface CreateTestSessionCommand {
  TestNominationID: string;
  TesterType: TesterType;
  TesterID: string;
  ActualExamDate: string;
  SessionStatus: SessionStatus;
  Notes?: string;
}

export interface UpdateTestSessionCommand extends CreateTestSessionCommand {
  Id: string;
}

export const CreateTestSessionSchema = z.object({
  TestNominationID: z.string().min(1, "الترشيح مطلوب"),
  TesterType: z.nativeEnum(TesterType),
  TesterID: z.string().min(1, "لجنة التقييم أو المعلم مطلوب"),
  ActualExamDate: z.string().min(1, "تاريخ الاختبار مطلوب"),
  SessionStatus: z.nativeEnum(SessionStatus),
  Notes: z.string().optional(),
});
