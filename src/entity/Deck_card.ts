import {Decklist} from "./Decklist";
import {Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Deck_card {
    @PrimaryGeneratedColumn()
    id: number;
    @ManyToOne(() => Decklist, (decklist) => decklist.deck)
    decklist: Decklist;
}