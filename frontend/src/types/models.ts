// src/types/models.ts
interface Organisation {
  _id: string;
  name: string;
  logo: string;
  baseCountry: string;
  countryCode: string;
  description: string;
  domains: string[];
  socialMedia: {
    facebook: string;
    instagram: string;
    website: string;
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    countryCode: string;
    rawPhone: string;
  };
  coordinators: {
    name: string;
    photo: string;
    role: string;
    email: string;
  }[];

  hostedProjects?: any[];
  partnerIn?: any[];
}



interface Project {
  _id: string;
  name: string;
  description: string;
  period: {
    start: string;
    end: string;
  };
  deadline?: string;
  country: string;
  targetAudience?: string;
  domain: string[];
  coverImageUrl?: string;
  location?: string;
  infoPackUrl?: string;
  applyLink?: string;
  objectives?: string[];

  host: {
    _id: string;
    name: string;
    logo?: string;
  };

  partners?: Partner[];
}

// Partner poate fi fie un ONG înregistrat, fie doar date minimale
type Partner =
  | {
      instagram: string;
      baseCountry: string;
      name: string;
      organisationRef?: undefined; // explicit no ref
    }
  | {
      instagram: string;
      baseCountry: string;
      organisationRef: Organisation; // ONG înregistrat complet
      name?: string; // poate fi ignorat
    }
  | {
    type: "country";
    baseCountry: string;
   }

export type { Organisation, Project };
