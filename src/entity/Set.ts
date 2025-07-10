import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Card_printing} from "./Card_printing";

@Entity()
export class Set {
    @PrimaryColumn({type: 'varchar', length: 10})
    code: string;

    @Column()
    name: string;

    @Column('date')
    release_date: Date;

    @Column()
    set_type: string;

    @OneToMany(() => Card_printing, (printing) => printing.set)
    printings: Card_printing[];
}