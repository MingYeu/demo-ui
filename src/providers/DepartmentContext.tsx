import { falsyDepartment } from '@/data/role';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useEffect, useState } from 'react';

export type PermissionContextType = {
    permissions: Permissions;
    setPermissions: Dispatch<SetStateAction<Permissions>>;
};

export const PermissionContext = createContext<PermissionContextType>({
    permissions: falsyDepartment(),
    setPermissions: () => void 0,
});

type PermissionProviderProps = PropsWithChildren;

const PermissionProvider = ({ children }: PermissionProviderProps) => {
    const [permissions, setPermissions] = useState<Permissions>(falsyDepartment());

    return <PermissionContext.Provider value={{ permissions, setPermissions }}>{children}</PermissionContext.Provider>;
};

export default PermissionProvider;
