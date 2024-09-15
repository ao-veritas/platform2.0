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

export type ProjectType = {
    name: string;
    processID: string;
    logoImageLink: string;
    bannerLink: string;
    links: {
      website: string;
      docs: string;
      discord: string;
      twitter: string;
      github: string;
      telegram: string;
      other: string[];
    };
    team: {
      officialName: string;
      pseudoName: string;
      role: string;
      imgLink: string;
      links: {
        github: string;
        twitter: string;
        dribble: string;
        other: string[];
      };
    }[];
    exchangeInfo: {
      cooldownPeriod: number;
      aoethRewardRate: number;
    };
    description: string;
    oneLiner: string;
    token: {
      name: string;
      ticker: string;
      processId: string;
      denomination: string;
      totalSupply: string;
      tokenomics: {
        info: string;
        linkToBlogorPaper: string;
      };
    };
    gettingStartedGuide: string;
    projectOrigin: string;
    useCases: {
      name: string;
      info: string;
      liveLink: string;
      other: string[];
    }[];
    advisorsInvestors: {
      name: string;
      role: string;
      moreInfo: string;
      amountIfAny: string[];
    }[];
    mileStones: {
      goal: string;
      date: string;
      proof: string;
      status: string;
    }[];
    mediaMentions: string[];
    collaborations: {
      name: string;
      link: string;
      info: string;
    }[];
    ownershipPercentages: {
      name: string;
      role: string;
      percentage: string;
    }[];
  };
  