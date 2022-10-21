import { Comment } from './comment';

export class Post {
  public id: number|undefined;
  public name: string|undefined;
  public caption: string|undefined;
  public postedDate: Date|undefined;
  public username: string|undefined;
  public location: string|undefined;
  public likes: number|undefined;
  public userImageId: number|undefined;
  public commentList: Comment[]|undefined;
}
