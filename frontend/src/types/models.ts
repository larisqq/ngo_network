// src/types/models.ts
interface Organisation {
  _id: string;
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
  projects?: Project[]; 
}

interface Project {
  _id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  country: string; // 'RO' | 'MD' | 'UA' | 'BG' | 'HU' | 'RS'
  domain: string ; // 'environment' | 'education' | 'well-being' | 'health' | 'community';
  host: {
    id: string;
    name: string;
    logo?: string;
  };
  partners?: Array<{
    id: string;
    name: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
    };
  }>;
  applyLink?: string;
}

export type { Organisation, Project };
