import { EntitySchema } from "typeorm";

const TimeEntry = new EntitySchema({
    name: "TimeEntry",
    tableName: "time_entries",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        newDate: {
            type: "date",
        },
        timeIn: {
            type: "varchar",
        },
        timeOut: {
            type: "varchar",
        },
        totalHour: {
            type: "varchar",
        },
        officeWork: {
            type: "boolean",
            default: true,
        },
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
        month: {
            target: "Month",
            type: "many-to-one",
            joinColumn: {
                name: "month_id",
            },
            onDelete: "CASCADE",
        }
    },
});

export default TimeEntry;
