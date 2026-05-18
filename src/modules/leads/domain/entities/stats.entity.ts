import { LeadEntity } from "./lead.entity";

export class StatsEntity {
    total_leads: number;
    leads_by_fountain: { [fountain: string]: number };
    budget_average: number;
    leads_last_seven_days: LeadEntity[];

    constructor(props: { [key: string]: any }) {
        this.total_leads = props.total_leads;
        this.leads_by_fountain = props.leads_by_fountain;
        this.budget_average = props.budget_average;
        this.leads_last_seven_days = props.leads_last_seven_days;
    }
}