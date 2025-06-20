// src/types/models.ts

interface Organisation {
  _id: string;
  name: string;
  logo: string;
  description: string;
  domains: string[];
  country: string; 
  contact: {
    email: string;
    phone?: string;
  };
  hostedProjects?: {
    _id: string;
    title: string;
    deadline: string;
  }[];
  partnerIn?: {
    _id: string;
    title: string;
    deadline: string;
  }[];
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
    _id: string;
    name: string;
    logo?: string;
  };
  partners?: Array<{
    _id: string;
    name: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
    };
  }>;
  applyLink?: string;
}

export type { Organisation, Project };
