import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'users',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class UserDocument extends Document {
  @Prop({ required: false })
  name?: string;

  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  password: string;

  created_at: Date;
  updated_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
