interface Organisation {
  id: string;
  name: string;
  logo: string;
  description: string;
  domains: string[];
  socialMedia?: {
    website?: string;
    facebook?: string;
    instagram?: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
}

interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  domain: string; // 'environment' | 'education' | 'well-being' | 'health' | 'community'
  country: string; // 'RO' | 'MD' | 'UA' | 'BG' | 'HU' | 'RS'
  organisation: Organisation;

  
}

// Extinderea interfetei globale (opțional)
declare global {
  interface Array<T> {
    toSorted(compareFn?: (a: T, b: T) => number): T[];
  }
}

export type { Organisation, Project };