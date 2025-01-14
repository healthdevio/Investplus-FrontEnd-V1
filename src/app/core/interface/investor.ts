import { Address } from './address';

export interface Admin {
    ufAdmin: string;
    zipCodeAdmin: string;
    neighborhoodAdmin: string;
    streetAdmin: string;
    cityAdmin: string;
    numberAdmin: string;
    fullName: string;
    cpfCnpj: string;
    rg: string;
    dateOfBirth: string;
    gender: string;
    maritalStatus: string;
    phone: string;
    email: string;
}

export interface Investor {
    profession: string;
    nationality: string;
    gender: string;
    maritalStatus: string;
    cpfResponsible?: string;
    rgEmitter: string;
    rg: string;
    phone: number;
    dateOfBirth: string;
    address?: Address;
    investorProfileStatement: string;
    totalInvestedOthers: number;
    investedUpangel: number;
    publicFigure: boolean;
    personalWebsite?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    aboutUpangel: string;
    publicProfile: boolean;
    cpf?: string;
    cnpj?: string;
    email?: string;
    fullName?: string;
    id?: number;
    nickname?: string;
    admins?: Admin[];
}
