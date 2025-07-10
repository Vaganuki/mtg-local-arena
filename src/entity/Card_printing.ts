import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Card} from "./Card";
import {Set} from "./Set";


@Entity()
export class Card_printing {
    @PrimaryGeneratedColumn()
    id: string;

    @ManyToOne(() => Card, (card) => card.printings)
    @JoinColumn({name: 'oracle_id'})
    card: Card;

    @ManyToOne(() => Set, (set) => set.printings)
    set: Set;

    @Column()
    collector_number: string;

    @Column()
    rarity: string;

    @Column({type : "jsonb", nullable: true})
    image_uris: {
        small?: string;
        normal?: string;
        large?: string;
        art_crop?: string;
        border_crop?: string;
    }

}