export class LeadNotFoundException extends Error {
    constructor() {
        super('Lead not found');
        this.name = 'LeadNotFoundException';
    }
}