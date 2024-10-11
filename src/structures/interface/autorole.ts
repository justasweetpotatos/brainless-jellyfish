export interface AutoroleButtonContent {
  id: string;
  customId: string;
  roleId: string;
  style: number;
  label: string;
  emojiId?: string;
}

export interface AutoroleMessageContent {
  id: string;
  channelId: string;
  buttonIdList: Array<string>;

  title: string;
  description: string;
  color: number;
}
