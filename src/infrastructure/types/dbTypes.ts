import { GqlRole } from "./gqlTypes.js";


export type DbCategory = {
    name: string,
    collectionName: string,
    attributes: DbCategoryAttribute[]
}

export type DbCategoryAttribute = DbProductAttribute & {
    count: number
}

export type DbOrder = {
    userId: string,
    totalSum: number,
    date: string,
    products: DbOrderProduct[]
}

export type DbOrderProduct = {
    id: string,
    price: number,
    quantity: number
}

export type DbProduct = {
    name: string,
    coversFileNames: string[],
    description: string,
    price: number,
    attributes: DbProductAttribute[]
}

export type DbProductAttribute = {
    name: string,
    value: string
}

export type DbUser = {
    username: string,
    email: string,
    passwordHash: string,
    role: GqlRole
}

export type DbRefreshToken = {
    token: string,
    userId: string,
    expireAt: string
}

export interface DbRegisterToken {
    payload: Omit<DbUser, "role">
}

export interface DbMakeOrderToken {
    payload: DbOrder;
}