/**
 * Typeguard for ActionType.
 *
 * @param obj - input that needs to be checked
 * @returns true if input is an ActionType
 */
export const isActionType = (obj: unknown): obj is ActionType =>
  obj != null && typeof obj === 'string' && Object.values(ActionType).includes(obj as ActionType);

/**
 * The action type clarifies the purpose of the action and gives context to the other parameters of the action.
 */
export enum ActionType {
  /**
   * Part should be created according to the payload.
   *
   * @remarks
   * In current implementation CREATE is equivalent to UPDATE
   */
  create = 'CREATE',

  /**
   * Part should be updated according to the payload.
   */
  update = 'UPDATE',

  /**
   * Part should be removed
   */
  delete = 'DELETE',

  /**
   * Entity or entities should be published
   */
  publish = 'PUBLISH',
}
