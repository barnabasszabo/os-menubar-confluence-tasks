export interface TaskDTO {
  globalId?: number,
  id?: number,
  contentId?: number,
  status?: string,
  body?: string,
  creator?: string,
  assignee?: string,
  createDate?: number,
  dueDate?: number,
  completeDate?: number,
  completeUser?: string,
  pageTitle?: string
}
