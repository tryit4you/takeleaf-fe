import { Comment } from './comment';

export interface Post {
   id: number;
   name: string;
   caption: string;
   postedDate: Date;
   username: string;
   location: string;
   likes: number;
   userImageId: number;
   commentList: Comment[];
}
