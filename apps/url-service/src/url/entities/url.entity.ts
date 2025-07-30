import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('short_urls')
export class ShortUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 2048 })
  originalUrl: string;

  @Column({ length: 6, unique: true })
  shortCode: string;

  @Column({ default: 0 })
  clickCount: number;

  @Column({ type: 'varchar', length: 36, nullable: true })
  userId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;
}
