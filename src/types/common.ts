export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
