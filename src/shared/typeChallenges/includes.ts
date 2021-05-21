type Includes<T extends readonly unknown[], U> = U extends T[number] ? true : false;

export type isPillarMan = Includes<["Test", "Foo", "Crap"], "ice">;
