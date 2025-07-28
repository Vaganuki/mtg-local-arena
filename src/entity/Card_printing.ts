import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Card} from "./Card";
import {cardSet} from "./CardSet";


@Entity()
export class Card_printing {
    @PrimaryColumn({type: 'uuid'})
    id: string;

    @ManyToOne(() => Card, (card) => card.printings)
    @JoinColumn({name: 'oracle_id'})
    card: Card;

    @ManyToOne(() => cardSet, (set) => set.printings)
    @JoinColumn({name: 'set_code'})
    set: cardSet;

    @Column()
    collector_number: string;

    @Column()
    rarity: string;

    @Column({type: "jsonb", nullable: true})
    image_uris: {
        small?: string;
        normal?: string;
        large?: string;
        art_crop?: string;
        border_crop?: string;
    }

    @Column({nullable: true})
    flavor_text: string | null;

    @Column({nullable: true})
    artist: string | null;
}