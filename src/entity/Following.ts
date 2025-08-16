import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";

@Entity()
export class Following {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    followed_id: number;

    @ManyToOne(() => User, (follower) => follower.following)
    follower: User;
}