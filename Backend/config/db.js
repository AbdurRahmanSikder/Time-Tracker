import { DataSource } from "typeorm";
import User from "../entities/User.js";
import TimeEntry from "../entities/TimeEntry.js";
import Month from "../entities/Month.js";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: "postgres",
    url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/time_tracker",
    synchronize: true,
    logging: false,
    entities: [User, TimeEntry, Month],
});

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("Database connected via TypeORM");
    } catch (error) {
        console.log("Database connection error: ", error);
    }
}

export default connectDB;