import { EntitySchema } from "typeorm";

const User = new EntitySchema({
    name: "User",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        email: {
            type: "varchar",
            unique: true,
        },
        password: {
            type: "varchar",
        },
    },
    relations: {
        timeEntries: {
            target: "TimeEntry",
            type: "one-to-many",
            inverseSide: "user",
            cascade: true,
        },
    },
});

export default User;
