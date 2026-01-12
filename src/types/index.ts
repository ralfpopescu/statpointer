export interface StatClass {
  id: string;
  roleName: string;
  attributes: string[];
  totalPoints: number;
  maxPointsPerAttribute: number;
}

export interface StatSpread {
  id: string;
  classId: string;
  characterName: string;
  roleName: string;
  attributes: string[];
  points: Record<string, number>;
  totalPoints: number;
  maxPointsPerAttribute: number;
}

export interface PartySpread {
  id: string;
  members: StatSpread[];
  aggregatedStats: Record<string, number>;
}

export interface Template {
  roleName: string;
  attributes: string[];
}

// Encoded data structures for URL sharing
export interface EncodedClass {
  r: string; // roleName
  a: string[]; // attributes
  t: number; // totalPoints
  m?: number; // maxPointsPerAttribute (optional for backwards compatibility)
}

export interface EncodedStatSpread {
  c: string; // characterName
  r: string; // roleName
  a: string[]; // attributes
  p: Record<string, number>; // points
  t: number; // totalPoints
  m?: number; // maxPointsPerAttribute (optional for backwards compatibility)
}

export interface EncodedParty {
  m: EncodedStatSpread[]; // members
}

