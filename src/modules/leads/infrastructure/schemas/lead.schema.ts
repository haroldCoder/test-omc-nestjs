import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FountainEnum } from '../../domain/enums';

@Schema({
    collection: 'leads',
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class LeadDocument extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: false })
    phone?: string;

    @Prop({ required: true, enum: FountainEnum })
    source: FountainEnum;

    @Prop({ required: false })
    productInterest?: string;

    @Prop({ required: false })
    budget?: number;

    created_at: Date;
    updated_at: Date;
}

export const LeadSchema = SchemaFactory.createForClass(LeadDocument);
