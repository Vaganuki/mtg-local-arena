import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {Card} from "./Card";
import {Set} from "./Set";


@Entity()
export class Card_printing {
    @PrimaryColumn({type: 'uuid'})
    id: string;

    @ManyToOne(() => Card, (card) => card.printings)
    @JoinColumn({name: 'oracle_id'})
    card: Card;

    @ManyToOne(() => Set, (set) => set.printings)
    @JoinColumn({name: 'set_code'})
    set: Set;

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