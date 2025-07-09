import {Entity, ManyToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./User";
import {Event} from "./Event"

@Entity()
export class Participation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, (user) => user.participation)
    users: User[];

    @ManyToMany(() => Event, (event) => event.participations)
    events: Event[];
}