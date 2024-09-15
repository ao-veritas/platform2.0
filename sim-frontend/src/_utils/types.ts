export type UserTokensResult = {
    Name?: string;
    Ticker?: string;
    Logo?: string;
    Denomination: number;
    processId: string;
    balance?: string | null;
  }

export type UserStakes = {
    UserID: string;
    TokenID: string;
    TotalStaked: string;
    ProjectID: string;
  };