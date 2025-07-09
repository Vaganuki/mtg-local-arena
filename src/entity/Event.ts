import {Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Participation} from "./Participation";
import {Category} from "./Category";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column("text")
    description: string;

    @Column()
    places_count: number;

    @Column()
    location: string;

    @Column()
    cancelled: boolean;

    @Column()
    picture: string;

    @Column()
    event_date: Date;

    @Column()
    creator_id: number;

    @Column()
    prizing: string;

    @Column()
    entry_fee: number;

    @ManyToMany(() => Participation, (participation) => participation.events)
    participations: Participation[];

    @ManyToOne(() => Category, (category) => category.events)
    category: Category;
}