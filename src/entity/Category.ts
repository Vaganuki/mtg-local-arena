import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Event} from "./Event";

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Event, event => event.category)
    events: Event[];
}