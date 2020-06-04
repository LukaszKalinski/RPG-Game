export class SinglePost {
  constructor(
    public title: string,
    public creator: string,
    public subtitle: string,
    public body: string,
    public image: string,
    public date: number = new Date().getTime(),
  ) {}
}
