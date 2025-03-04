declare module 'firebase/firestore' {
  export interface DocumentData {
    [field: string]: any;
  }

  export interface QuerySnapshot<T = DocumentData> {
    docs: QueryDocumentSnapshot<T>[];
  }

  export interface QueryDocumentSnapshot<T = DocumentData> {
    id: string;
    data(): T;
  }

  export interface CollectionReference<T = DocumentData> {
    id: string;
    path: string;
  }

  export interface Query<T = DocumentData> {
    where(field: string, opStr: string, value: any): Query<T>;
    orderBy(field: string, direction?: 'asc' | 'desc'): Query<T>;
  }

  export interface Firestore {
    collection(path: string, ...pathSegments: string[]): CollectionReference;
  }

  export function collection(firestore: Firestore, path: string, ...pathSegments: string[]): CollectionReference;
  export function query<T = DocumentData>(collection: CollectionReference<T>, ...queryConstraints: any[]): Query<T>;
  export function orderBy(field: string, direction?: 'asc' | 'desc'): any;
  export function onSnapshot<T = DocumentData>(query: Query<T>, onNext: (snapshot: QuerySnapshot<T>) => void): () => void;
  export function addDoc<T = DocumentData>(collection: CollectionReference<T>, data: T): Promise<QueryDocumentSnapshot<T>>;
  export function serverTimestamp(): any;
} 