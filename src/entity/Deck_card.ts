import {Decklist} from "./Decklist";
import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Card} from "./Card";

@Entity()
export class Deck_card {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    is_commander: boolean;

    @Column()
    is_sideboard: boolean;

    @ManyToOne(() => Decklist, (decklist) => decklist.deck)
    decklist: Decklist;

    @ManyToOne(() => Card, (card) => card.deckcard)
    card: Card;
}