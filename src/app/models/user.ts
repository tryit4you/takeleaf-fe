import { Post } from './post';

export class User {
  id: number | undefined;
  name: string|undefined;
  username: string|undefined;
  email: string|undefined;
  password: string|undefined;
  bio: string|undefined;
  post: Post[]|undefined;
  likedPost: Post[]|undefined;
}
