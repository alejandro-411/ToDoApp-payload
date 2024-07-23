export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
   image?: {
        id: string;
        filename: string;
    };
}