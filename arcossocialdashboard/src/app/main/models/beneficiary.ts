import { Entity } from './entity';

export class Beneficiary {
    _id: string;
    fullName: string;
    dni: string;
    address: string;
    valuationCard: boolean;
    valuationDate: Date;
    creationDate: Date;
    familySize: number;
    isActive: boolean;
    uts: string;
    mate: {
        fullName: string;
        dni: string;
    };
    entity: Entity;
}