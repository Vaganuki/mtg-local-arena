import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {Card_printing} from "./Card_printing";
import {Deck_card} from "./Deck_card";

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

    @Column({nullable: true})
    mana_cost: string | null;

    @Column("float")
    cmc: number;

    @Column({nullable: true})
    power: string | null;

    @Column({nullable: true})
    toughness: string | null;

    @Column({nullable: true})
    loyalty: string | null;

    @OneToMany(() => Card_printing, (printing) => printing.card)
    printings: Card_printing[];

    @OneToMany(() => Deck_card, (deck) => deck.card)
    deckcard: Deck_card;
}