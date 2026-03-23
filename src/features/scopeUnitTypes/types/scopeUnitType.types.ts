export interface ScopeUnitType {
    ID: string;
    Name: string;
    LevelNumber: number;
    Notes?: string;
}

export interface CreateScopeUnitTypeCommand {
    Name: string;
    LevelNumber: number;
    Notes?: string;
}

export interface UpdateScopeUnitTypeCommand {
    ID: string;
    Name: string;
    LevelNumber: number;
    Notes?: string;
}
