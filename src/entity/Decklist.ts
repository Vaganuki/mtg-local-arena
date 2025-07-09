import {Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Game_format} from "./Game_format";
import {User} from "./User";
import {Deck_card} from "./Deck_card";

@Entity()
export class Decklist {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    main_card_id: number;

    @ManyToOne(() => User, (user) => user.decklists)
    user: User;

    @ManyToOne(() => Game_format, (game_format) => game_format.decklists)
    game_format: Game_format;

    @OneToMany(() => Deck_card, (deck) => deck.decklist)
    deck: Deck_card;

}