import {Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany} from "typeorm"
import {Thread} from "./Thread";
import {Favorite_format} from "./Favorite_format";
import {Decklist} from "./Decklist";
import {Comment} from "./Comment";
import {Participation} from "./Participation";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 100, unique: true})
    username: string;

    @Column({type: 'varchar', unique: true})
    email: string;

    @Column({length: 100})
    firstName: string;

    @Column({length: 100})
    lastName: string;

    @Column()
    password: string;

    @Column()
    birthdate: Date;

    @Column({type: 'varchar', length: 6, nullable: true})
    colorIdentity: string | null;

    @Column({type: 'varchar', length: 30, nullable: true})
    pronouns: string | null;

    @Column({type: 'text', nullable: true})
    avatar: string | null;

    @Column({type: 'date'})
    createdAt: Date;

    @OneToMany(() => Thread, (thread) => thread.user)
    threads: Thread[];

    @OneToMany(() => Favorite_format, (favorite) => favorite.user)
    favorites: Favorite_format[];

    @OneToMany(() => Decklist, (deck) => deck.user)
    decklists: Decklist[];

    @OneToMany(() => Comment, (comment) => comment.user)
    comments: Comment[];

    @ManyToMany(() => Participation, (participation) => participation.users)
    participation: Participation[];
}