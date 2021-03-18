import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ChatClientEntity {
  @PrimaryColumn({ unique: true })
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  typing: boolean;
}
