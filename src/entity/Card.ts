import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Card_printing} from "./Card_printing";

@Entity()
export class Card {
    @PrimaryGeneratedColumn()
    oracle_id: string;

    @Column()
    name: string;

    @Column()
    type_line: string;

    @Column()
    oracle_text: string;

    @Column()
    cmc: number;

    @Column()
    power: string;

    @Column()
    toughness: string;

    @OneToMany(() => Card_printing, (printing) => printing.card)
    printings: Card_printing[];
}