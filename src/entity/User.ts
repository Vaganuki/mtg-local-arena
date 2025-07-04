import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    username: string;

    @Column({length: 100})
    firstName: string;

    @Column({length: 100})
    lastName: string;

    @Column()
    password: string;

    @Column({type: 'varchar', unique: true})
    email: string;

    @Column()
    birthdate: Date;

    @Column({type: 'text', nullable: true})
    profileImage: string | null;
}