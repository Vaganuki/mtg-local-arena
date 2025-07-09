import {Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Game_format} from "./Game_format";
import {User} from "./User";

@Entity()
export class Favorite_format {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(()=> User, (user) => user.favorites)
    user: User;

    @ManyToOne(()=> Game_format, (game) => game.favorites)
    game: Game_format;
}