import { EntitySchema } from "typeorm";

const Month = new EntitySchema({
    name: "Month",
    tableName: "months",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        name: {
            type: "varchar", // e.g., "Jan 2026"
        },
        year: {
            type: "int",
        },
        monthNumber: {
            type: "int", // 1-12
        }
    },
    relations: {
        user: {
            target: "User",
            type: "many-to-one",
            joinColumn: {
                name: "user_id",
            },
            onDelete: "CASCADE",
        },
        timeEntries: {
            target: "TimeEntry",
            type: "one-to-many",
            inverseSide: "month",
            cascade: true,
        },
    },
});

export default Month;
