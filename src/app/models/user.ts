import { Post } from './post';

export class User {
  id: number | undefined;
  name: string|undefined;
  username: any;
  email: string|undefined;
  password: string|undefined;
  createdDate:Date |undefined;
  bio: string|undefined;
  post: Post[]|undefined;
  likedPost: Post[]=[];
}
