type Length<T extends Array<unknown>> = T["size"];

type tesla = ["tesla", "model", "model X"];
export type teslaLength = Length<tesla>;
