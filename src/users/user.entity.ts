import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  @Index({ unique: true })
  email: string;

  @Column({ length: 100, nullable: true })
  @Index({ unique: true })
  username: string;

  @Column({ length: 100 })
  password: string;

  @Column({ nullable: true })
  fullName: string;

  @Column({ length: 15, nullable: true })
  phone: string;

  @Column({ nullable: true })
  gender: boolean;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ length: 50 })
  status: string;

  @Column({ length: 10 })
  roleId: string;
}
