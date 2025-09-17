import { User } from "./user.entity"

export type Classroom = {
    id?: string;  
    name: string,
    students: string[] | User[];
    studentsCount?: number;
    user: string | User;
}