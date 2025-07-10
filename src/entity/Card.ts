import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Card_printing} from "./Card_printing";

@Entity()
export class Card {
    @PrimaryColumn({type: 'uuid'})
    oracle_id: string;

    @Column()
    name: string;

    @Column()
    type_line: string;

    @Column({nullable: true})
    oracle_text: string | null;

    @Column("float")
    cmc: number;

    @Column({nullable: true})
    power: string | null;

    @Column({nullable: true})
    toughness: string | null;

    @OneToMany(() => Card_printing, (printing) => printing.card)
    printings: Card_printing[];
}