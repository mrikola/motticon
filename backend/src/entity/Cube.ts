import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Cube {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  url: string;
}
