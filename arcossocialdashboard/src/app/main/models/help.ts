import { Beneficiary } from './beneficiary';
import { Entity } from './entity';
import { User } from './user';

export class Help {
    _id: string;
    helpType: string;
    date: Date;
    notes: string;
    beneficiary: Beneficiary;
    entity: Entity;
    user: User
}