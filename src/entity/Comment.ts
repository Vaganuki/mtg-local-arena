import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    source_type: string;

    @Column()
    source_id: number;

    @Column("text")
    content: string;

    @Column()
    posted_at: Date;

    @Column()
    likes_count: number;

    @ManyToOne(() => User, (user) => user.comments)
    user: User;
}