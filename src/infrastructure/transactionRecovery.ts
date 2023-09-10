type RecoveryAction = (() => Promise<void>)[];


export class TransactionRecovery {
    private readonly _finalizers?: RecoveryAction;
    private readonly _catchers?: RecoveryAction;


    constructor({ finalizers, catchers }: {
        finalizers: RecoveryAction,
        catchers: RecoveryAction
    } = {
        finalizers: [],
        catchers: []
    }) {
        this._finalizers = finalizers;
        this._catchers = catchers;
    }


    get finalizers(): RecoveryAction {
        return this._finalizers ?? [];
    }


    get catchers(): RecoveryAction {
        return this._catchers ?? [];
    }


    public merge(other: TransactionRecovery) {
        this._catchers?.push(...other?._catchers ?? []);
        this._finalizers?.push(...other?._finalizers ?? []);

        return this;
    }


    public mergeAll(others: TransactionRecovery[]) {
        for (let other of others) {
            this._catchers?.push(...other?._catchers ?? []);
            this._finalizers?.push(...other?._finalizers ?? []);
        }

        return this;
    }
}