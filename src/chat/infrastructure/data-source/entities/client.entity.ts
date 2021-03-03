import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatClientEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
