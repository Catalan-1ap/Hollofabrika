import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from "graphql";


export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AccountNumber: any;
  BigInt: any;
  Byte: any;
  CountryCode: any;
  Cuid: any;
  Currency: any;
  DID: any;
  Date: any;
  DateTime: any;
  DateTimeISO: any;
  DeweyDecimal: any;
  Duration: any;
  EmailAddress: any;
  GUID: any;
  HSL: any;
  HSLA: any;
  HexColorCode: any;
  Hexadecimal: any;
  IBAN: any;
  IP: any;
  IPCPatent: any;
  IPv4: any;
  IPv6: any;
  ISBN: any;
  ISO8601Duration: any;
  Id: string;
  JSON: any;
  JSONObject: Record<string, any>;
  JWT: any;
  LCCSubclass: any;
  Latitude: any;
  LocalDate: any;
  LocalDateTime: any;
  LocalEndTime: any;
  LocalTime: any;
  Locale: any;
  Long: any;
  Longitude: any;
  MAC: any;
  NegativeFloat: any;
  NegativeInt: any;
  NonEmptyString: any;
  NonNegativeFloat: any;
  NonNegativeInt: any;
  NonPositiveFloat: any;
  NonPositiveInt: any;
  ObjectID: any;
  PhoneNumber: any;
  Port: any;
  PositiveFloat: any;
  PositiveInt: any;
  PostalCode: any;
  RGB: any;
  RGBA: any;
  RoutingNumber: any;
  SafeInt: any;
  SemVer: any;
  Time: any;
  TimeZone: any;
  Timestamp: any;
  URL: any;
  USCurrency: any;
  UUID: any;
  UnsignedFloat: any;
  UnsignedInt: any;
  Upload: {
    file: Promise<{
      filename: string;
      mimetype: string;
      encoding: string;
      createReadStream(): ReadStream;
    }>
  };
  UtcOffset: any;
  Void: any;
};

export type GqlCategory = {
  attributes: Array<Maybe<GqlCategoryAttribute>>;
  name: Scalars["String"];
};

export type GqlCategoryAttribute = {
  count: Scalars["Int"];
  name: Scalars["String"];
  value: Scalars["String"];
};

export type GqlConfirmOrderResult = {
  id?: Maybe<Scalars["Id"]>;
};

export type GqlCreateOrderProductsList = {
  id: Scalars["Id"];
  quantity: Scalars["Int"];
};

export type GqlCreateOrderResult = {
  expiresIn: Scalars["String"];
  token: Scalars["String"];
};

export type GqlCreateProductArgs = {
  attributes: Array<GqlProductInputAttribute>;
  covers?: InputMaybe<Array<Scalars["Upload"]>>;
  description: Scalars["String"];
  name: Scalars["String"];
  price: Scalars["Int"];
};

export type GqlDatePeriod = {
  from?: InputMaybe<Scalars["String"]>;
  to?: InputMaybe<Scalars["String"]>;
};

export type GqlError = {
  code?: Maybe<GqlErrorCode>;
  message: Scalars["String"];
};

export enum GqlErrorCode {
  BadRequest = "BadRequest",
  Forbidden = "Forbidden",
  InternalError = "InternalError",
  NotFound = "NotFound"
}

export enum GqlErrors {
  AnonymousGuardForbidden = "AnonymousGuardForbidden",
  ChangeCategoryCategoriesAreSame = "ChangeCategoryCategoriesAreSame",
  ChangeCategoryNewCategoryNotExists = "ChangeCategoryNewCategoryNotExists",
  ChangeCategoryProductNotExists = "ChangeCategoryProductNotExists",
  ConfirmOrderOrderRequestNotExists = "ConfirmOrderOrderRequestNotExists",
  CreateCategoryCategoryExists = "CreateCategoryCategoryExists",
  CreateProductCategoryNotExists = "CreateProductCategoryNotExists",
  DeleteCategoryCategoryNotExists = "DeleteCategoryCategoryNotExists",
  DeleteProductProductNotExists = "DeleteProductProductNotExists",
  LoginWrongPasswordError = "LoginWrongPasswordError",
  LoginWrongUsernameError = "LoginWrongUsernameError",
  ProductProductNotExists = "ProductProductNotExists",
  RefreshUsedTokenError = "RefreshUsedTokenError",
  RefreshWrongTokenError = "RefreshWrongTokenError",
  RegisterEmailWrong = "RegisterEmailWrong",
  RoleGuardForbidden = "RoleGuardForbidden",
  UpdateCategoryCategoryNotExists = "UpdateCategoryCategoryNotExists",
  UpdateProductProductNotExists = "UpdateProductProductNotExists",
  VerifyEmailWrongToken = "VerifyEmailWrongToken"
}

export enum GqlFilterLogic {
  And = "AND",
  Or = "OR"
}

export type GqlJwtToken = {
  access: Scalars["String"];
  refresh: Scalars["String"];
};

export type GqlMutation = {
  changeCategory: GqlProduct;
  confirmOrder: GqlConfirmOrderResult;
  createCategory: GqlCategory;
  createOrder: GqlCreateOrderResult;
  createProduct: GqlProduct;
  deleteCategory: GqlCategory;
  deleteProduct: GqlProduct;
  login: GqlJwtToken;
  refresh: GqlJwtToken;
  register: GqlSuccess;
  updateCategory: GqlCategory;
  updateProduct: GqlProduct;
  verifyEmail: GqlSuccess;
};


export type GqlMutationChangeCategoryArgs = {
  category: Scalars["String"];
  id: Scalars["Id"];
};


export type GqlMutationConfirmOrderArgs = {
  token: Scalars["String"];
};


export type GqlMutationCreateCategoryArgs = {
  name: Scalars["String"];
};


export type GqlMutationCreateOrderArgs = {
  products?: InputMaybe<Array<GqlCreateOrderProductsList>>;
};


export type GqlMutationCreateProductArgs = {
  category: Scalars["String"];
  product: GqlCreateProductArgs;
};


export type GqlMutationDeleteCategoryArgs = {
  name: Scalars["String"];
};


export type GqlMutationDeleteProductArgs = {
  id: Scalars["Id"];
};


export type GqlMutationLoginArgs = {
  password: Scalars["String"];
  username: Scalars["String"];
};


export type GqlMutationRefreshArgs = {
  token: Scalars["String"];
};


export type GqlMutationRegisterArgs = {
  email: Scalars["String"];
  password: Scalars["String"];
  username: Scalars["String"];
};


export type GqlMutationUpdateCategoryArgs = {
  newName: Scalars["String"];
  originalName: Scalars["String"];
};


export type GqlMutationUpdateProductArgs = {
  id: Scalars["Id"];
  product: GqlUpdateProductArgs;
};


export type GqlMutationVerifyEmailArgs = {
  emailToken: Scalars["String"];
};

export type GqlOrder = {
  confirmCode?: Maybe<Scalars["String"]>;
  createdAt?: Maybe<Scalars["String"]>;
  date?: Maybe<Scalars["String"]>;
  expiresIn?: Maybe<Scalars["String"]>;
  id?: Maybe<Scalars["Id"]>;
  isCompleted?: Maybe<Scalars["Boolean"]>;
  products?: Maybe<Array<GqlOrderProduct>>;
  totalSum?: Maybe<Scalars["Int"]>;
  userId?: Maybe<Scalars["Id"]>;
};

export type GqlOrderProduct = {
  attributes: Array<GqlProductAttribute>;
  buyedWithPrice: Scalars["Int"];
  category: Scalars["String"];
  covers?: Maybe<Array<Scalars["String"]>>;
  description: Scalars["String"];
  id?: Maybe<Scalars["Id"]>;
  name: Scalars["String"];
  price: Scalars["Int"];
  quantity: Scalars["Int"];
};

export type GqlOrdersQueryInput = {
  datePeriod?: InputMaybe<GqlDatePeriod>;
  isAdmin?: InputMaybe<Scalars["Boolean"]>;
  isCompleted?: InputMaybe<Scalars["Boolean"]>;
  orderIds?: InputMaybe<Array<Scalars["Id"]>>;
  orderTokens?: InputMaybe<Array<Scalars["String"]>>;
  pageData?: InputMaybe<GqlPageDataInput>;
  productsIds?: InputMaybe<Array<Scalars["Id"]>>;
  usersIds?: InputMaybe<Array<Scalars["Id"]>>;
};

export type GqlOrdersQueryResult = {
  items: Array<GqlOrder>;
  pageData?: Maybe<GqlPageData>;
};

export type GqlPageData = {
  page: Scalars["Int"];
  pageSize: Scalars["Int"];
  totalPages: Scalars["Int"];
};

export type GqlPageDataInput = {
  page: Scalars["Int"];
  pageSize: Scalars["Int"];
};

export type GqlProduct = {
  attributes: Array<GqlProductAttribute>;
  category: Scalars["String"];
  covers?: Maybe<Array<Scalars["String"]>>;
  description: Scalars["String"];
  id: Scalars["Id"];
  name: Scalars["String"];
  price: Scalars["Int"];
};

export type GqlProductAttribute = {
  name: Scalars["String"];
  value: Scalars["String"];
};

export type GqlProductFilterQueryInput = {
  attributes?: InputMaybe<Array<GqlProductInputAttribute>>;
  logic: GqlFilterLogic;
};

export type GqlProductInputAttribute = {
  name: Scalars["String"];
  value: Scalars["String"];
};

export type GqlProductsQueryInput = {
  categories?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  filter?: InputMaybe<GqlProductFilterQueryInput>;
  ids?: InputMaybe<Array<Scalars["Id"]>>;
  pageData?: InputMaybe<GqlPageDataInput>;
};

export type GqlProductsQueryResult = {
  items: Array<GqlProduct>;
  pageData?: Maybe<GqlPageData>;
};

export type GqlQuery = {
  categories: Array<GqlQueryCategory>;
  currentUser: GqlUser;
  orders: GqlOrdersQueryResult;
  product: GqlProduct;
  products: GqlProductsQueryResult;
};


export type GqlQueryOrdersArgs = {
  input?: InputMaybe<GqlOrdersQueryInput>;
};


export type GqlQueryProductArgs = {
  id: Scalars["Id"];
};


export type GqlQueryProductsArgs = {
  input?: InputMaybe<GqlProductsQueryInput>;
};

export type GqlQueryAttribute = {
  count: Scalars["Int"];
  value: Scalars["String"];
};

export type GqlQueryCategory = {
  attributes: Array<Maybe<GqlQueryCategoryAttribute>>;
  name: Scalars["String"];
};

export type GqlQueryCategoryAttribute = {
  name: Scalars["String"];
  values?: Maybe<Array<GqlQueryAttribute>>;
};

export enum GqlRole {
  Admin = "Admin",
  Standalone = "Standalone"
}

export type GqlSuccess = {
  code: GqlSuccessCode;
};

export enum GqlSuccessCode {
  ConfirmAction = "ConfirmAction",
  Oke = "Oke"
}

export type GqlUpdateProductArgs = {
  attributes?: InputMaybe<Array<GqlProductInputAttribute>>;
  covers?: InputMaybe<Array<Scalars["Upload"]>>;
  coversNamesToDelete?: InputMaybe<Array<Scalars["String"]>>;
  description?: InputMaybe<Scalars["String"]>;
  name?: InputMaybe<Scalars["String"]>;
  price?: InputMaybe<Scalars["Int"]>;
};

export type GqlUser = {
  email: Scalars["String"];
  role: GqlRole;
  username: Scalars["String"];
};

export type GqlValidationError = {
  key: Scalars["String"];
  messages?: Maybe<Array<Scalars["String"]>>;
};

export type GqlValidationErrors = {
  errors?: Maybe<Array<Array<GqlValidationError>>>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    ResolverFn<TResult, TParent, TContext, TArgs>
    | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
    | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
    | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
    | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
    | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
    parent: TParent,
    context: TContext,
    info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type GqlResolversTypes = {
  AccountNumber: ResolverTypeWrapper<Scalars["AccountNumber"]>;
  BigInt: ResolverTypeWrapper<Scalars["BigInt"]>;
  Boolean: ResolverTypeWrapper<Scalars["Boolean"]>;
  Byte: ResolverTypeWrapper<Scalars["Byte"]>;
  Category: ResolverTypeWrapper<GqlCategory>;
  CategoryAttribute: ResolverTypeWrapper<GqlCategoryAttribute>;
  ConfirmOrderResult: ResolverTypeWrapper<GqlConfirmOrderResult>;
  CountryCode: ResolverTypeWrapper<Scalars["CountryCode"]>;
  CreateOrderProductsList: GqlCreateOrderProductsList;
  CreateOrderResult: ResolverTypeWrapper<GqlCreateOrderResult>;
  CreateProductArgs: GqlCreateProductArgs;
  Cuid: ResolverTypeWrapper<Scalars["Cuid"]>;
  Currency: ResolverTypeWrapper<Scalars["Currency"]>;
  DID: ResolverTypeWrapper<Scalars["DID"]>;
  Date: ResolverTypeWrapper<Scalars["Date"]>;
  DatePeriod: GqlDatePeriod;
  DateTime: ResolverTypeWrapper<Scalars["DateTime"]>;
  DateTimeISO: ResolverTypeWrapper<Scalars["DateTimeISO"]>;
  DeweyDecimal: ResolverTypeWrapper<Scalars["DeweyDecimal"]>;
  Duration: ResolverTypeWrapper<Scalars["Duration"]>;
  EmailAddress: ResolverTypeWrapper<Scalars["EmailAddress"]>;
  Error: ResolverTypeWrapper<GqlError>;
  ErrorCode: GqlErrorCode;
  Errors: GqlErrors;
  FilterLogic: GqlFilterLogic;
  GUID: ResolverTypeWrapper<Scalars["GUID"]>;
  HSL: ResolverTypeWrapper<Scalars["HSL"]>;
  HSLA: ResolverTypeWrapper<Scalars["HSLA"]>;
  HexColorCode: ResolverTypeWrapper<Scalars["HexColorCode"]>;
  Hexadecimal: ResolverTypeWrapper<Scalars["Hexadecimal"]>;
  IBAN: ResolverTypeWrapper<Scalars["IBAN"]>;
  IP: ResolverTypeWrapper<Scalars["IP"]>;
  IPCPatent: ResolverTypeWrapper<Scalars["IPCPatent"]>;
  IPv4: ResolverTypeWrapper<Scalars["IPv4"]>;
  IPv6: ResolverTypeWrapper<Scalars["IPv6"]>;
  ISBN: ResolverTypeWrapper<Scalars["ISBN"]>;
  ISO8601Duration: ResolverTypeWrapper<Scalars["ISO8601Duration"]>;
  Id: ResolverTypeWrapper<Scalars["Id"]>;
  Int: ResolverTypeWrapper<Scalars["Int"]>;
  JSON: ResolverTypeWrapper<Scalars["JSON"]>;
  JSONObject: ResolverTypeWrapper<Scalars["JSONObject"]>;
  JWT: ResolverTypeWrapper<Scalars["JWT"]>;
  JwtToken: ResolverTypeWrapper<GqlJwtToken>;
  LCCSubclass: ResolverTypeWrapper<Scalars["LCCSubclass"]>;
  Latitude: ResolverTypeWrapper<Scalars["Latitude"]>;
  LocalDate: ResolverTypeWrapper<Scalars["LocalDate"]>;
  LocalDateTime: ResolverTypeWrapper<Scalars["LocalDateTime"]>;
  LocalEndTime: ResolverTypeWrapper<Scalars["LocalEndTime"]>;
  LocalTime: ResolverTypeWrapper<Scalars["LocalTime"]>;
  Locale: ResolverTypeWrapper<Scalars["Locale"]>;
  Long: ResolverTypeWrapper<Scalars["Long"]>;
  Longitude: ResolverTypeWrapper<Scalars["Longitude"]>;
  MAC: ResolverTypeWrapper<Scalars["MAC"]>;
  Mutation: ResolverTypeWrapper<{}>;
  NegativeFloat: ResolverTypeWrapper<Scalars["NegativeFloat"]>;
  NegativeInt: ResolverTypeWrapper<Scalars["NegativeInt"]>;
  NonEmptyString: ResolverTypeWrapper<Scalars["NonEmptyString"]>;
  NonNegativeFloat: ResolverTypeWrapper<Scalars["NonNegativeFloat"]>;
  NonNegativeInt: ResolverTypeWrapper<Scalars["NonNegativeInt"]>;
  NonPositiveFloat: ResolverTypeWrapper<Scalars["NonPositiveFloat"]>;
  NonPositiveInt: ResolverTypeWrapper<Scalars["NonPositiveInt"]>;
  ObjectID: ResolverTypeWrapper<Scalars["ObjectID"]>;
  Order: ResolverTypeWrapper<GqlOrder>;
  OrderProduct: ResolverTypeWrapper<GqlOrderProduct>;
  OrdersQueryInput: GqlOrdersQueryInput;
  OrdersQueryResult: ResolverTypeWrapper<GqlOrdersQueryResult>;
  PageData: ResolverTypeWrapper<GqlPageData>;
  PageDataInput: GqlPageDataInput;
  PhoneNumber: ResolverTypeWrapper<Scalars["PhoneNumber"]>;
  Port: ResolverTypeWrapper<Scalars["Port"]>;
  PositiveFloat: ResolverTypeWrapper<Scalars["PositiveFloat"]>;
  PositiveInt: ResolverTypeWrapper<Scalars["PositiveInt"]>;
  PostalCode: ResolverTypeWrapper<Scalars["PostalCode"]>;
  Product: ResolverTypeWrapper<GqlProduct>;
  ProductAttribute: ResolverTypeWrapper<GqlProductAttribute>;
  ProductFilterQueryInput: GqlProductFilterQueryInput;
  ProductInputAttribute: GqlProductInputAttribute;
  ProductsQueryInput: GqlProductsQueryInput;
  ProductsQueryResult: ResolverTypeWrapper<GqlProductsQueryResult>;
  Query: ResolverTypeWrapper<{}>;
  QueryAttribute: ResolverTypeWrapper<GqlQueryAttribute>;
  QueryCategory: ResolverTypeWrapper<GqlQueryCategory>;
  QueryCategoryAttribute: ResolverTypeWrapper<GqlQueryCategoryAttribute>;
  RGB: ResolverTypeWrapper<Scalars["RGB"]>;
  RGBA: ResolverTypeWrapper<Scalars["RGBA"]>;
  Role: GqlRole;
  RoutingNumber: ResolverTypeWrapper<Scalars["RoutingNumber"]>;
  SafeInt: ResolverTypeWrapper<Scalars["SafeInt"]>;
  SemVer: ResolverTypeWrapper<Scalars["SemVer"]>;
  String: ResolverTypeWrapper<Scalars["String"]>;
  Success: ResolverTypeWrapper<GqlSuccess>;
  SuccessCode: GqlSuccessCode;
  Time: ResolverTypeWrapper<Scalars["Time"]>;
  TimeZone: ResolverTypeWrapper<Scalars["TimeZone"]>;
  Timestamp: ResolverTypeWrapper<Scalars["Timestamp"]>;
  URL: ResolverTypeWrapper<Scalars["URL"]>;
  USCurrency: ResolverTypeWrapper<Scalars["USCurrency"]>;
  UUID: ResolverTypeWrapper<Scalars["UUID"]>;
  UnsignedFloat: ResolverTypeWrapper<Scalars["UnsignedFloat"]>;
  UnsignedInt: ResolverTypeWrapper<Scalars["UnsignedInt"]>;
  UpdateProductArgs: GqlUpdateProductArgs;
  Upload: ResolverTypeWrapper<Scalars["Upload"]>;
  User: ResolverTypeWrapper<GqlUser>;
  UtcOffset: ResolverTypeWrapper<Scalars["UtcOffset"]>;
  ValidationError: ResolverTypeWrapper<GqlValidationError>;
  ValidationErrors: ResolverTypeWrapper<GqlValidationErrors>;
  Void: ResolverTypeWrapper<Scalars["Void"]>;
};

/** Mapping between all available schema types and the resolvers parents */
export type GqlResolversParentTypes = {
  AccountNumber: Scalars["AccountNumber"];
  BigInt: Scalars["BigInt"];
  Boolean: Scalars["Boolean"];
  Byte: Scalars["Byte"];
  Category: GqlCategory;
  CategoryAttribute: GqlCategoryAttribute;
  ConfirmOrderResult: GqlConfirmOrderResult;
  CountryCode: Scalars["CountryCode"];
  CreateOrderProductsList: GqlCreateOrderProductsList;
  CreateOrderResult: GqlCreateOrderResult;
  CreateProductArgs: GqlCreateProductArgs;
  Cuid: Scalars["Cuid"];
  Currency: Scalars["Currency"];
  DID: Scalars["DID"];
  Date: Scalars["Date"];
  DatePeriod: GqlDatePeriod;
  DateTime: Scalars["DateTime"];
  DateTimeISO: Scalars["DateTimeISO"];
  DeweyDecimal: Scalars["DeweyDecimal"];
  Duration: Scalars["Duration"];
  EmailAddress: Scalars["EmailAddress"];
  Error: GqlError;
  GUID: Scalars["GUID"];
  HSL: Scalars["HSL"];
  HSLA: Scalars["HSLA"];
  HexColorCode: Scalars["HexColorCode"];
  Hexadecimal: Scalars["Hexadecimal"];
  IBAN: Scalars["IBAN"];
  IP: Scalars["IP"];
  IPCPatent: Scalars["IPCPatent"];
  IPv4: Scalars["IPv4"];
  IPv6: Scalars["IPv6"];
  ISBN: Scalars["ISBN"];
  ISO8601Duration: Scalars["ISO8601Duration"];
  Id: Scalars["Id"];
  Int: Scalars["Int"];
  JSON: Scalars["JSON"];
  JSONObject: Scalars["JSONObject"];
  JWT: Scalars["JWT"];
  JwtToken: GqlJwtToken;
  LCCSubclass: Scalars["LCCSubclass"];
  Latitude: Scalars["Latitude"];
  LocalDate: Scalars["LocalDate"];
  LocalDateTime: Scalars["LocalDateTime"];
  LocalEndTime: Scalars["LocalEndTime"];
  LocalTime: Scalars["LocalTime"];
  Locale: Scalars["Locale"];
  Long: Scalars["Long"];
  Longitude: Scalars["Longitude"];
  MAC: Scalars["MAC"];
  Mutation: {};
  NegativeFloat: Scalars["NegativeFloat"];
  NegativeInt: Scalars["NegativeInt"];
  NonEmptyString: Scalars["NonEmptyString"];
  NonNegativeFloat: Scalars["NonNegativeFloat"];
  NonNegativeInt: Scalars["NonNegativeInt"];
  NonPositiveFloat: Scalars["NonPositiveFloat"];
  NonPositiveInt: Scalars["NonPositiveInt"];
  ObjectID: Scalars["ObjectID"];
  Order: GqlOrder;
  OrderProduct: GqlOrderProduct;
  OrdersQueryInput: GqlOrdersQueryInput;
  OrdersQueryResult: GqlOrdersQueryResult;
  PageData: GqlPageData;
  PageDataInput: GqlPageDataInput;
  PhoneNumber: Scalars["PhoneNumber"];
  Port: Scalars["Port"];
  PositiveFloat: Scalars["PositiveFloat"];
  PositiveInt: Scalars["PositiveInt"];
  PostalCode: Scalars["PostalCode"];
  Product: GqlProduct;
  ProductAttribute: GqlProductAttribute;
  ProductFilterQueryInput: GqlProductFilterQueryInput;
  ProductInputAttribute: GqlProductInputAttribute;
  ProductsQueryInput: GqlProductsQueryInput;
  ProductsQueryResult: GqlProductsQueryResult;
  Query: {};
  QueryAttribute: GqlQueryAttribute;
  QueryCategory: GqlQueryCategory;
  QueryCategoryAttribute: GqlQueryCategoryAttribute;
  RGB: Scalars["RGB"];
  RGBA: Scalars["RGBA"];
  RoutingNumber: Scalars["RoutingNumber"];
  SafeInt: Scalars["SafeInt"];
  SemVer: Scalars["SemVer"];
  String: Scalars["String"];
  Success: GqlSuccess;
  Time: Scalars["Time"];
  TimeZone: Scalars["TimeZone"];
  Timestamp: Scalars["Timestamp"];
  URL: Scalars["URL"];
  USCurrency: Scalars["USCurrency"];
  UUID: Scalars["UUID"];
  UnsignedFloat: Scalars["UnsignedFloat"];
  UnsignedInt: Scalars["UnsignedInt"];
  UpdateProductArgs: GqlUpdateProductArgs;
  Upload: Scalars["Upload"];
  User: GqlUser;
  UtcOffset: Scalars["UtcOffset"];
  ValidationError: GqlValidationError;
  ValidationErrors: GqlValidationErrors;
  Void: Scalars["Void"];
};

export interface GqlAccountNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["AccountNumber"], any> {
  name: "AccountNumber";
}

export interface GqlBigIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["BigInt"], any> {
  name: "BigInt";
}

export interface GqlByteScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Byte"], any> {
  name: "Byte";
}

export type GqlCategoryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Category"] = GqlResolversParentTypes["Category"]> = {
  attributes?: Resolver<Array<Maybe<GqlResolversTypes["CategoryAttribute"]>>, ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlCategoryAttributeResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["CategoryAttribute"] = GqlResolversParentTypes["CategoryAttribute"]> = {
  count?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlConfirmOrderResultResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["ConfirmOrderResult"] = GqlResolversParentTypes["ConfirmOrderResult"]> = {
  id?: Resolver<Maybe<GqlResolversTypes["Id"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlCountryCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["CountryCode"], any> {
  name: "CountryCode";
}

export type GqlCreateOrderResultResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["CreateOrderResult"] = GqlResolversParentTypes["CreateOrderResult"]> = {
  expiresIn?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  token?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlCuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Cuid"], any> {
  name: "Cuid";
}

export interface GqlCurrencyScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Currency"], any> {
  name: "Currency";
}

export interface GqlDidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DID"], any> {
  name: "DID";
}

export interface GqlDateScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Date"], any> {
  name: "Date";
}

export interface GqlDateTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTime"], any> {
  name: "DateTime";
}

export interface GqlDateTimeIsoScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DateTimeISO"], any> {
  name: "DateTimeISO";
}

export interface GqlDeweyDecimalScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["DeweyDecimal"], any> {
  name: "DeweyDecimal";
}

export interface GqlDurationScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Duration"], any> {
  name: "Duration";
}

export interface GqlEmailAddressScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["EmailAddress"], any> {
  name: "EmailAddress";
}

export type GqlErrorResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Error"] = GqlResolversParentTypes["Error"]> = {
  code?: Resolver<Maybe<GqlResolversTypes["ErrorCode"]>, ParentType, ContextType>;
  message?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlGuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["GUID"], any> {
  name: "GUID";
}

export interface GqlHslScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HSL"], any> {
  name: "HSL";
}

export interface GqlHslaScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HSLA"], any> {
  name: "HSLA";
}

export interface GqlHexColorCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["HexColorCode"], any> {
  name: "HexColorCode";
}

export interface GqlHexadecimalScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Hexadecimal"], any> {
  name: "Hexadecimal";
}

export interface GqlIbanScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IBAN"], any> {
  name: "IBAN";
}

export interface GqlIpScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IP"], any> {
  name: "IP";
}

export interface GqlIpcPatentScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPCPatent"], any> {
  name: "IPCPatent";
}

export interface GqlIPv4ScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPv4"], any> {
  name: "IPv4";
}

export interface GqlIPv6ScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["IPv6"], any> {
  name: "IPv6";
}

export interface GqlIsbnScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ISBN"], any> {
  name: "ISBN";
}

export interface GqlIso8601DurationScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ISO8601Duration"], any> {
  name: "ISO8601Duration";
}

export interface GqlIdScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Id"], any> {
  name: "Id";
}

export interface GqlJsonScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JSON"], any> {
  name: "JSON";
}

export interface GqlJsonObjectScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JSONObject"], any> {
  name: "JSONObject";
}

export interface GqlJwtScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["JWT"], any> {
  name: "JWT";
}

export type GqlJwtTokenResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["JwtToken"] = GqlResolversParentTypes["JwtToken"]> = {
  access?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  refresh?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlLccSubclassScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LCCSubclass"], any> {
  name: "LCCSubclass";
}

export interface GqlLatitudeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Latitude"], any> {
  name: "Latitude";
}

export interface GqlLocalDateScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalDate"], any> {
  name: "LocalDate";
}

export interface GqlLocalDateTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalDateTime"], any> {
  name: "LocalDateTime";
}

export interface GqlLocalEndTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalEndTime"], any> {
  name: "LocalEndTime";
}

export interface GqlLocalTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["LocalTime"], any> {
  name: "LocalTime";
}

export interface GqlLocaleScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Locale"], any> {
  name: "Locale";
}

export interface GqlLongScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Long"], any> {
  name: "Long";
}

export interface GqlLongitudeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Longitude"], any> {
  name: "Longitude";
}

export interface GqlMacScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["MAC"], any> {
  name: "MAC";
}

export type GqlMutationResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Mutation"] = GqlResolversParentTypes["Mutation"]> = {
  changeCategory?: Resolver<GqlResolversTypes["Product"], ParentType, ContextType, RequireFields<GqlMutationChangeCategoryArgs, "category" | "id">>;
  confirmOrder?: Resolver<GqlResolversTypes["ConfirmOrderResult"], ParentType, ContextType, RequireFields<GqlMutationConfirmOrderArgs, "token">>;
  createCategory?: Resolver<GqlResolversTypes["Category"], ParentType, ContextType, RequireFields<GqlMutationCreateCategoryArgs, "name">>;
  createOrder?: Resolver<GqlResolversTypes["CreateOrderResult"], ParentType, ContextType, Partial<GqlMutationCreateOrderArgs>>;
  createProduct?: Resolver<GqlResolversTypes["Product"], ParentType, ContextType, RequireFields<GqlMutationCreateProductArgs, "category" | "product">>;
  deleteCategory?: Resolver<GqlResolversTypes["Category"], ParentType, ContextType, RequireFields<GqlMutationDeleteCategoryArgs, "name">>;
  deleteProduct?: Resolver<GqlResolversTypes["Product"], ParentType, ContextType, RequireFields<GqlMutationDeleteProductArgs, "id">>;
  login?: Resolver<GqlResolversTypes["JwtToken"], ParentType, ContextType, RequireFields<GqlMutationLoginArgs, "password" | "username">>;
  refresh?: Resolver<GqlResolversTypes["JwtToken"], ParentType, ContextType, RequireFields<GqlMutationRefreshArgs, "token">>;
  register?: Resolver<GqlResolversTypes["Success"], ParentType, ContextType, RequireFields<GqlMutationRegisterArgs, "email" | "password" | "username">>;
  updateCategory?: Resolver<GqlResolversTypes["Category"], ParentType, ContextType, RequireFields<GqlMutationUpdateCategoryArgs, "newName" | "originalName">>;
  updateProduct?: Resolver<GqlResolversTypes["Product"], ParentType, ContextType, RequireFields<GqlMutationUpdateProductArgs, "id" | "product">>;
  verifyEmail?: Resolver<GqlResolversTypes["Success"], ParentType, ContextType, RequireFields<GqlMutationVerifyEmailArgs, "emailToken">>;
};

export interface GqlNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NegativeFloat"], any> {
  name: "NegativeFloat";
}

export interface GqlNegativeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NegativeInt"], any> {
  name: "NegativeInt";
}

export interface GqlNonEmptyStringScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonEmptyString"], any> {
  name: "NonEmptyString";
}

export interface GqlNonNegativeFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonNegativeFloat"], any> {
  name: "NonNegativeFloat";
}

export interface GqlNonNegativeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonNegativeInt"], any> {
  name: "NonNegativeInt";
}

export interface GqlNonPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonPositiveFloat"], any> {
  name: "NonPositiveFloat";
}

export interface GqlNonPositiveIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["NonPositiveInt"], any> {
  name: "NonPositiveInt";
}

export interface GqlObjectIdScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["ObjectID"], any> {
  name: "ObjectID";
}

export type GqlOrderResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Order"] = GqlResolversParentTypes["Order"]> = {
  confirmCode?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  date?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  expiresIn?: Resolver<Maybe<GqlResolversTypes["String"]>, ParentType, ContextType>;
  id?: Resolver<Maybe<GqlResolversTypes["Id"]>, ParentType, ContextType>;
  isCompleted?: Resolver<Maybe<GqlResolversTypes["Boolean"]>, ParentType, ContextType>;
  products?: Resolver<Maybe<Array<GqlResolversTypes["OrderProduct"]>>, ParentType, ContextType>;
  totalSum?: Resolver<Maybe<GqlResolversTypes["Int"]>, ParentType, ContextType>;
  userId?: Resolver<Maybe<GqlResolversTypes["Id"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlOrderProductResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["OrderProduct"] = GqlResolversParentTypes["OrderProduct"]> = {
  attributes?: Resolver<Array<GqlResolversTypes["ProductAttribute"]>, ParentType, ContextType>;
  buyedWithPrice?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  category?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  covers?: Resolver<Maybe<Array<GqlResolversTypes["String"]>>, ParentType, ContextType>;
  description?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<Maybe<GqlResolversTypes["Id"]>, ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  price?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  quantity?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlOrdersQueryResultResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["OrdersQueryResult"] = GqlResolversParentTypes["OrdersQueryResult"]> = {
  items?: Resolver<Array<GqlResolversTypes["Order"]>, ParentType, ContextType>;
  pageData?: Resolver<Maybe<GqlResolversTypes["PageData"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlPageDataResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["PageData"] = GqlResolversParentTypes["PageData"]> = {
  page?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  pageSize?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  totalPages?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlPhoneNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PhoneNumber"], any> {
  name: "PhoneNumber";
}

export interface GqlPortScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Port"], any> {
  name: "Port";
}

export interface GqlPositiveFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PositiveFloat"], any> {
  name: "PositiveFloat";
}

export interface GqlPositiveIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PositiveInt"], any> {
  name: "PositiveInt";
}

export interface GqlPostalCodeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["PostalCode"], any> {
  name: "PostalCode";
}

export type GqlProductResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Product"] = GqlResolversParentTypes["Product"]> = {
  attributes?: Resolver<Array<GqlResolversTypes["ProductAttribute"]>, ParentType, ContextType>;
  category?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  covers?: Resolver<Maybe<Array<GqlResolversTypes["String"]>>, ParentType, ContextType>;
  description?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  id?: Resolver<GqlResolversTypes["Id"], ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  price?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlProductAttributeResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["ProductAttribute"] = GqlResolversParentTypes["ProductAttribute"]> = {
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  value?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlProductsQueryResultResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["ProductsQueryResult"] = GqlResolversParentTypes["ProductsQueryResult"]> = {
  items?: Resolver<Array<GqlResolversTypes["Product"]>, ParentType, ContextType>;
  pageData?: Resolver<Maybe<GqlResolversTypes["PageData"]>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Query"] = GqlResolversParentTypes["Query"]> = {
  categories?: Resolver<Array<GqlResolversTypes["QueryCategory"]>, ParentType, ContextType>;
  currentUser?: Resolver<GqlResolversTypes["User"], ParentType, ContextType>;
  orders?: Resolver<GqlResolversTypes["OrdersQueryResult"], ParentType, ContextType, Partial<GqlQueryOrdersArgs>>;
  product?: Resolver<GqlResolversTypes["Product"], ParentType, ContextType, RequireFields<GqlQueryProductArgs, "id">>;
  products?: Resolver<GqlResolversTypes["ProductsQueryResult"], ParentType, ContextType, Partial<GqlQueryProductsArgs>>;
};

export type GqlQueryAttributeResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["QueryAttribute"] = GqlResolversParentTypes["QueryAttribute"]> = {
  count?: Resolver<GqlResolversTypes["Int"], ParentType, ContextType>;
  value?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryCategoryResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["QueryCategory"] = GqlResolversParentTypes["QueryCategory"]> = {
  attributes?: Resolver<Array<Maybe<GqlResolversTypes["QueryCategoryAttribute"]>>, ParentType, ContextType>;
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlQueryCategoryAttributeResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["QueryCategoryAttribute"] = GqlResolversParentTypes["QueryCategoryAttribute"]> = {
  name?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  values?: Resolver<Maybe<Array<GqlResolversTypes["QueryAttribute"]>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlRgbScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RGB"], any> {
  name: "RGB";
}

export interface GqlRgbaScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RGBA"], any> {
  name: "RGBA";
}

export interface GqlRoutingNumberScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["RoutingNumber"], any> {
  name: "RoutingNumber";
}

export interface GqlSafeIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["SafeInt"], any> {
  name: "SafeInt";
}

export interface GqlSemVerScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["SemVer"], any> {
  name: "SemVer";
}

export type GqlSuccessResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["Success"] = GqlResolversParentTypes["Success"]> = {
  code?: Resolver<GqlResolversTypes["SuccessCode"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlTimeScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Time"], any> {
  name: "Time";
}

export interface GqlTimeZoneScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["TimeZone"], any> {
  name: "TimeZone";
}

export interface GqlTimestampScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Timestamp"], any> {
  name: "Timestamp";
}

export interface GqlUrlScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["URL"], any> {
  name: "URL";
}

export interface GqlUsCurrencyScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["USCurrency"], any> {
  name: "USCurrency";
}

export interface GqlUuidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UUID"], any> {
  name: "UUID";
}

export interface GqlUnsignedFloatScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UnsignedFloat"], any> {
  name: "UnsignedFloat";
}

export interface GqlUnsignedIntScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UnsignedInt"], any> {
  name: "UnsignedInt";
}

export interface GqlUploadScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Upload"], any> {
  name: "Upload";
}

export type GqlUserResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["User"] = GqlResolversParentTypes["User"]> = {
  email?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  role?: Resolver<GqlResolversTypes["Role"], ParentType, ContextType>;
  username?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlUtcOffsetScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["UtcOffset"], any> {
  name: "UtcOffset";
}

export type GqlValidationErrorResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["ValidationError"] = GqlResolversParentTypes["ValidationError"]> = {
  key?: Resolver<GqlResolversTypes["String"], ParentType, ContextType>;
  messages?: Resolver<Maybe<Array<GqlResolversTypes["String"]>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GqlValidationErrorsResolvers<ContextType = any, ParentType extends GqlResolversParentTypes["ValidationErrors"] = GqlResolversParentTypes["ValidationErrors"]> = {
  errors?: Resolver<Maybe<Array<Array<GqlResolversTypes["ValidationError"]>>>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface GqlVoidScalarConfig extends GraphQLScalarTypeConfig<GqlResolversTypes["Void"], any> {
  name: "Void";
}

export type GqlResolvers<ContextType = any> = {
  AccountNumber?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Byte?: GraphQLScalarType;
  Category?: GqlCategoryResolvers<ContextType>;
  CategoryAttribute?: GqlCategoryAttributeResolvers<ContextType>;
  ConfirmOrderResult?: GqlConfirmOrderResultResolvers<ContextType>;
  CountryCode?: GraphQLScalarType;
  CreateOrderResult?: GqlCreateOrderResultResolvers<ContextType>;
  Cuid?: GraphQLScalarType;
  Currency?: GraphQLScalarType;
  DID?: GraphQLScalarType;
  Date?: GraphQLScalarType;
  DateTime?: GraphQLScalarType;
  DateTimeISO?: GraphQLScalarType;
  DeweyDecimal?: GraphQLScalarType;
  Duration?: GraphQLScalarType;
  EmailAddress?: GraphQLScalarType;
  Error?: GqlErrorResolvers<ContextType>;
  GUID?: GraphQLScalarType;
  HSL?: GraphQLScalarType;
  HSLA?: GraphQLScalarType;
  HexColorCode?: GraphQLScalarType;
  Hexadecimal?: GraphQLScalarType;
  IBAN?: GraphQLScalarType;
  IP?: GraphQLScalarType;
  IPCPatent?: GraphQLScalarType;
  IPv4?: GraphQLScalarType;
  IPv6?: GraphQLScalarType;
  ISBN?: GraphQLScalarType;
  ISO8601Duration?: GraphQLScalarType;
  Id?: GraphQLScalarType;
  JSON?: GraphQLScalarType;
  JSONObject?: GraphQLScalarType;
  JWT?: GraphQLScalarType;
  JwtToken?: GqlJwtTokenResolvers<ContextType>;
  LCCSubclass?: GraphQLScalarType;
  Latitude?: GraphQLScalarType;
  LocalDate?: GraphQLScalarType;
  LocalDateTime?: GraphQLScalarType;
  LocalEndTime?: GraphQLScalarType;
  LocalTime?: GraphQLScalarType;
  Locale?: GraphQLScalarType;
  Long?: GraphQLScalarType;
  Longitude?: GraphQLScalarType;
  MAC?: GraphQLScalarType;
  Mutation?: GqlMutationResolvers<ContextType>;
  NegativeFloat?: GraphQLScalarType;
  NegativeInt?: GraphQLScalarType;
  NonEmptyString?: GraphQLScalarType;
  NonNegativeFloat?: GraphQLScalarType;
  NonNegativeInt?: GraphQLScalarType;
  NonPositiveFloat?: GraphQLScalarType;
  NonPositiveInt?: GraphQLScalarType;
  ObjectID?: GraphQLScalarType;
  Order?: GqlOrderResolvers<ContextType>;
  OrderProduct?: GqlOrderProductResolvers<ContextType>;
  OrdersQueryResult?: GqlOrdersQueryResultResolvers<ContextType>;
  PageData?: GqlPageDataResolvers<ContextType>;
  PhoneNumber?: GraphQLScalarType;
  Port?: GraphQLScalarType;
  PositiveFloat?: GraphQLScalarType;
  PositiveInt?: GraphQLScalarType;
  PostalCode?: GraphQLScalarType;
  Product?: GqlProductResolvers<ContextType>;
  ProductAttribute?: GqlProductAttributeResolvers<ContextType>;
  ProductsQueryResult?: GqlProductsQueryResultResolvers<ContextType>;
  Query?: GqlQueryResolvers<ContextType>;
  QueryAttribute?: GqlQueryAttributeResolvers<ContextType>;
  QueryCategory?: GqlQueryCategoryResolvers<ContextType>;
  QueryCategoryAttribute?: GqlQueryCategoryAttributeResolvers<ContextType>;
  RGB?: GraphQLScalarType;
  RGBA?: GraphQLScalarType;
  RoutingNumber?: GraphQLScalarType;
  SafeInt?: GraphQLScalarType;
  SemVer?: GraphQLScalarType;
  Success?: GqlSuccessResolvers<ContextType>;
  Time?: GraphQLScalarType;
  TimeZone?: GraphQLScalarType;
  Timestamp?: GraphQLScalarType;
  URL?: GraphQLScalarType;
  USCurrency?: GraphQLScalarType;
  UUID?: GraphQLScalarType;
  UnsignedFloat?: GraphQLScalarType;
  UnsignedInt?: GraphQLScalarType;
  Upload?: GraphQLScalarType;
  User?: GqlUserResolvers<ContextType>;
  UtcOffset?: GraphQLScalarType;
  ValidationError?: GqlValidationErrorResolvers<ContextType>;
  ValidationErrors?: GqlValidationErrorsResolvers<ContextType>;
  Void?: GraphQLScalarType;
};

