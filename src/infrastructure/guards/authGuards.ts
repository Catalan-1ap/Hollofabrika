import { JwtPayload } from "../../features/Users/users.services.js";
import { makeApplicationError } from "../formatErrorHandler.js";
import { GqlErrorCode, GqlErrors, GqlRole } from "../types/gqlTypes.js";
import { HollofabrikaContext } from "../hollofabrikaContext.js";


export function anonymousGuard(context: HollofabrikaContext): asserts context is HollofabrikaContext & {
    user: JwtPayload
} {
    if (!context.user)
        throw makeApplicationError(GqlErrors.AnonymousGuardForbidden, GqlErrorCode.Forbidden);
}


const rolesOrder: GqlRole[] = [
    GqlRole.Admin,
    GqlRole.Standalone
];


export function roleGuard(context: HollofabrikaContext, role: GqlRole): asserts context is HollofabrikaContext & {
    user: JwtPayload
} {
    if (!context.user)
        throw makeApplicationError(GqlErrors.RoleGuardForbidden, GqlErrorCode.Forbidden);

    const isUserHaveRequiredRole = context.user?.role === role;
    const isUserHaveUpperRole = rolesOrder
        .slice(0, rolesOrder.findIndex(x => x === role))
        .some(x => x === context.user?.role);

    if (!isUserHaveRequiredRole && !isUserHaveUpperRole)
        throw makeApplicationError(GqlErrors.RoleGuardForbidden, GqlErrorCode.Forbidden);
}