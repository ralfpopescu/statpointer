import { 
  StatClass, 
  StatSpread, 
  PartySpread,
  EncodedClass, 
  EncodedStatSpread, 
  EncodedParty 
} from '@/types';

// Base64 URL-safe encoding/decoding
export function encodeBase64Url(data: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(data).toString('base64url');
  }
  return btoa(data)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function decodeBase64Url(encoded: string): string {
  if (typeof window === 'undefined') {
    return Buffer.from(encoded, 'base64url').toString();
  }
  let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

// Encode a class template for sharing
export function encodeClass(statClass: StatClass): string {
  const encoded: EncodedClass = {
    r: statClass.roleName,
    a: statClass.attributes,
    t: statClass.totalPoints,
    m: statClass.maxPointsPerAttribute,
  };
  return encodeBase64Url(JSON.stringify(encoded));
}

// Decode a class template from URL
export function decodeClass(encoded: string): StatClass | null {
  try {
    const data: EncodedClass = JSON.parse(decodeBase64Url(encoded));
    return {
      id: generateId(),
      roleName: data.r,
      attributes: data.a,
      totalPoints: data.t,
      maxPointsPerAttribute: data.m ?? 10, // Default to 10 for backwards compatibility
    };
  } catch {
    return null;
  }
}

// Encode a stat spread for sharing
export function encodeStatSpread(spread: StatSpread): string {
  const encoded: EncodedStatSpread = {
    c: spread.characterName,
    r: spread.roleName,
    a: spread.attributes,
    p: spread.points,
    t: spread.totalPoints,
    m: spread.maxPointsPerAttribute,
  };
  return encodeBase64Url(JSON.stringify(encoded));
}

// Decode a stat spread from URL
export function decodeStatSpread(encoded: string): StatSpread | null {
  try {
    const data: EncodedStatSpread = JSON.parse(decodeBase64Url(encoded));
    return {
      id: generateId(),
      classId: '',
      characterName: data.c,
      roleName: data.r,
      attributes: data.a,
      points: data.p,
      totalPoints: data.t,
      maxPointsPerAttribute: data.m ?? 10, // Default to 10 for backwards compatibility
    };
  } catch {
    return null;
  }
}

// Encode a party for sharing
export function encodeParty(party: PartySpread): string {
  const encoded: EncodedParty = {
    m: party.members.map(member => ({
      c: member.characterName,
      r: member.roleName,
      a: member.attributes,
      p: member.points,
      t: member.totalPoints,
      m: member.maxPointsPerAttribute,
    })),
  };
  return encodeBase64Url(JSON.stringify(encoded));
}

// Decode a party from URL
export function decodeParty(encoded: string): PartySpread | null {
  try {
    const data: EncodedParty = JSON.parse(decodeBase64Url(encoded));
    const members: StatSpread[] = data.m.map(m => ({
      id: generateId(),
      classId: '',
      characterName: m.c,
      roleName: m.r,
      attributes: m.a,
      points: m.p,
      totalPoints: m.t,
      maxPointsPerAttribute: m.m ?? 10, // Default to 10 for backwards compatibility
    }));
    
    // Calculate aggregated stats
    const aggregatedStats: Record<string, number> = {};
    members.forEach(member => {
      Object.entries(member.points).forEach(([attr, value]) => {
        aggregatedStats[attr] = (aggregatedStats[attr] || 0) + value;
      });
    });
    
    return {
      id: generateId(),
      members,
      aggregatedStats,
    };
  } catch {
    return null;
  }
}

// Generate a simple unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Extract stat spread data from a share URL
export function parseShareUrl(url: string): { type: 'class' | 'stats' | 'party'; data: string } | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    
    if (pathParts[0] === 'fill' && pathParts[1]) {
      return { type: 'class', data: pathParts[1] };
    }
    if (pathParts[0] === 'view' && pathParts[1]) {
      return { type: 'stats', data: pathParts[1] };
    }
    if (pathParts[0] === 'party' && pathParts[1]) {
      return { type: 'party', data: pathParts[1] };
    }
    
    return null;
  } catch {
    return null;
  }
}

