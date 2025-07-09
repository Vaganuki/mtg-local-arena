import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Thread{
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    title: string;

    @Column("text")
    content: string;

    @Column()
    topics: string;

    @Column()
    like_count: number;

    @ManyToOne(() => User, (user) => user.threads)
    user: User;

}