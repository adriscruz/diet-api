import { Knex } from "knex";

declare module 'knex/types/tables' {
    export interface Tables {
        meals: {
            id: string;
            name: string;
            description: string;
            type: 'off diet' | 'within diet';
            rating: number;
            user_session_id: string;
            created_at: string;
        }
        user: {
            id: string;
            session_id: string;
            username: string;
            created_at: string;
        }
    }
}