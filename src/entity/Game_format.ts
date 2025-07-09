import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Favorite_format} from "./Favorite_format";
import {Decklist} from "./Decklist";

@Entity()
export class Game_format {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Favorite_format, (favorite) => favorite.game)
    favorites: Favorite_format[];

    @OneToMany(() => Decklist, (deck) => deck.game_format)
    decklists: Decklist[];
}